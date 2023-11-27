import { skipToken } from '@reduxjs/toolkit/dist/query';
import AuthContext from 'authentication/contexts/AuthProvider';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import {
    useGetCommunityPostDetailQuery,
    useGetCommunityPostQuery,
    useGetPublicCommunityPostDetailQuery,
    useGetPublicCommunityPostQuery,
    useGetPublicSubjectCategoriesQuery,
    useGetSubjectCategoriesQuery,
    usePostQuestionAnswerMutation
} from 'komunitas/redux/api/komunitasApi';
import { useRouter } from 'next/router';
import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTracker } from 'tracker/tracker';

interface KomunitasContextType {
    dataHome?: CommunityPostResponse & {
        count_items: number;
        next_page?: number;
        previous_page?: number;
    };
    isLoadingDataHome?: boolean;
    detailQuestion?: CommunityPostDetailResponse;
    isLoadingQuestion?: boolean;
    listComments?: CommunityPostCommentDetailResponse & {
        count_items: number;
        next_page?: number;
        previous_page?: number;
    };
    isLoadingComments?: boolean;
    subjects?: SubjectCategoriesResponse;
    search: string;
    searchState: string;
    page: number;
    filter: string;
    sort: 'LATEST' | 'POPULAR' | 'ANSWERED' | 'NOT_ANSWERED';
    isLoadingPost: boolean;
    handleSearch: () => void;
    handleSubmitPost: (data: {
        post_id?: string;
        content: string;
        category_id: string;
        attachment_urls: string[];
    }) => Promise<void>;
    setSearch: Dispatch<SetStateAction<string>>;
    setPage: Dispatch<SetStateAction<number>>;
    setFilter: Dispatch<SetStateAction<string>>;
    setSort: React.Dispatch<
        React.SetStateAction<'LATEST' | 'POPULAR' | 'ANSWERED' | 'NOT_ANSWERED'>
    >;
}

const KomunitasContext = createContext<KomunitasContextType>(
    {} as KomunitasContextType
);

export function KomunitasProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const { profile } = useContext(AuthContext);
    const router = useRouter();
    const { pathname } = router;

    const [dataHome, setDataHome] = useState<
        CommunityPostResponse & {
            count_items: number;
            next_page?: number;
            previous_page?: number;
        }
    >();

    const [detailQuestion, setDetailQuestion] =
        useState<CommunityPostDetailResponse>();

    const [searchState, setSearchState] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState<
        'LATEST' | 'POPULAR' | 'ANSWERED' | 'NOT_ANSWERED'
    >('LATEST');

    const isAuthenticated = useSelector(getIsAuthenticated);
    const privateCategoryResult = useGetSubjectCategoriesQuery(
        isAuthenticated ? undefined : skipToken,
        { refetchOnMountOrArgChange: true }
    );
    const publicCategoryResult = useGetPublicSubjectCategoriesQuery(
        isAuthenticated ? skipToken : undefined,
        { refetchOnMountOrArgChange: true }
    );
    const { data: subjects } = isAuthenticated
        ? privateCategoryResult
        : publicCategoryResult;

    const privateCommunityPostResult = useGetCommunityPostQuery(
        {
            sort_by: sort,
            category_id: filter,
            user_id: pathname.includes('pertanyaan-ku')
                ? profile?.user_id
                : undefined,
            page: page,
            search: searchState
        },
        {
            skip:
                !isAuthenticated ||
                (pathname !== '/komunitas' || pathname.includes('pertanyaan-ku')
                    ? !profile?.user_id
                    : false),
            refetchOnMountOrArgChange: true
        }
    );
    const publicCommunityPostResult = useGetPublicCommunityPostQuery(
        {
            sort_by: sort,
            category_id: filter,
            user_id: pathname.includes('pertanyaan-ku')
                ? profile?.user_id
                : undefined,
            page: page,
            search: searchState
        },
        {
            skip: isAuthenticated || pathname.includes('pertanyaan-ku'),
            refetchOnMountOrArgChange: true
        }
    );
    const {
        data,
        isLoading: isLoadingDataHome,
        refetch: refetchCommunity
    } = isAuthenticated
        ? privateCommunityPostResult
        : publicCommunityPostResult;

    const privateCommunityPostDetailResult = useGetCommunityPostDetailQuery(
        { slug: router.query.id as string },
        { skip: !router.query.id || !isAuthenticated }
    );
    const publicCommunityPostDetailResult =
        useGetPublicCommunityPostDetailQuery(
            { slug: router.query.id as string },
            { skip: !router.query.id || isAuthenticated }
        );
    const { data: question, isLoading: isLoadingQuestion } = isAuthenticated
        ? privateCommunityPostDetailResult
        : publicCommunityPostDetailResult;

    const [postCommunity, { isLoading: isLoadingPost }] =
        usePostQuestionAnswerMutation();

    const tracker = useTracker();
    function handleSearch(): void {
        tracker?.genericTrack('Search Community Post', { Query: search });
        setSearchState(search);
        setPage(1);
        router.push(pathname);
    }

    async function handleSubmitPost({
        post_id,
        content,
        category_id,
        attachment_urls
    }: {
        post_id?: string;
        content: string;
        category_id: string;
        attachment_urls: string[];
    }): Promise<void> {
        try {
            const result = await postCommunity({
                post_id: post_id ? post_id : null,
                content: content,
                category_id: category_id,
                attachment_urls: attachment_urls
            }).unwrap();

            const SelectedCategory = subjects?.categories.filter(
                (value) => value.id === filter
            )[0];

            if (
                result &&
                (SelectedCategory?.name === result?.category ||
                    filter === '') &&
                (pathname === '/komunitas' ||
                    pathname === '/komunitas/pertanyaan-ku')
            ) {
                const newQuestion = {
                    id: result?.id,
                    content: result?.content,
                    slug: result?.slug,
                    category: result?.category,
                    viewer_counts: result?.viewer_counts,
                    comment_counts: result?.comment_counts,
                    created_at: result?.created_at,
                    student: {
                        id: result?.student.id,
                        photo_url: result?.student.photo_url,
                        username: result?.student.username
                    }
                };
                const newListQuestions = dataHome?.community_posts
                    ? dataHome?.community_posts.map((value) => value)
                    : [];

                newListQuestions.unshift(newQuestion as CommunityPost);

                const newData = {
                    community_posts: newListQuestions,
                    count_items: dataHome?.count_items as number,
                    next_page: dataHome?.next_page,
                    previous_page: dataHome?.previous_page
                };

                setDataHome(newData);
                router.push(pathname);
            }
        } catch (error) {
            toast.error('Oops terjadi kesalahan', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true,
                toastId: 'POST_COMMUNITY_FAILED'
            });
        }
    }

    useEffect(() => {
        if (page === 1) {
            setDataHome(data);
        } else if (!isLoadingDataHome && data) {
            const newQuestion = dataHome?.community_posts
                ? dataHome?.community_posts.map((value) => value)
                : [];
            data?.community_posts.map((value) => {
                newQuestion?.push(value);
            });

            const newData = {
                community_posts: newQuestion as CommunityPost[],
                count_items: data?.count_items as number,
                next_page: data?.next_page,
                previous_page: data?.previous_page
            };

            setDataHome(newData);
        }
    }, [data, isLoadingDataHome]);

    useEffect(() => {
        if (!isLoadingQuestion && question) {
            setDetailQuestion(question);
            refetchCommunity();
        }
    }, [isLoadingQuestion, question]);

    const memoedValue = useMemo(
        () => ({
            dataHome,
            isLoadingDataHome,
            detailQuestion,
            isLoadingQuestion,
            subjects,
            search,
            searchState,
            page,
            filter,
            sort,
            isLoadingPost,
            handleSearch,
            handleSubmitPost,
            setSearch,
            setPage,
            setFilter,
            setSort
        }),
        [
            dataHome,
            isLoadingDataHome,
            detailQuestion,
            isLoadingQuestion,
            isLoadingPost,
            subjects,
            search,
            searchState,
            page,
            filter,
            sort
        ]
    );

    return (
        <KomunitasContext.Provider value={memoedValue}>
            {children}
        </KomunitasContext.Provider>
    );
}

export const useKomunitas = (): KomunitasContextType => {
    return useContext(KomunitasContext);
};
