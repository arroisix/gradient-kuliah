import Skeleton from 'commons/components/elements/Skeleton';
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from 'react';
import EmptyState from './CommunityPost/EmptyState';
import AnswerCard from './AnswerCard';
import useOnScreen from 'commons/hooks/useOnScreen';
import { useGetCommunityPostCommentDetailQuery } from 'komunitas/redux/api/komunitasApi';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useKomunitas } from 'komunitas/contexts/KomunitasProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import CommunityPaywall from './CommunityPaywall';

type AnswerSectionProps = {
    category?: {
        id: string;
        name: string;
    };
    setIsShowForm: Dispatch<SetStateAction<boolean>>;
};

const AnswerSection = ({
    category,
    setIsShowForm
}: AnswerSectionProps): JSX.Element => {
    const anchor = useRef({} as HTMLDivElement);
    const isAnchorOnScreen = useOnScreen(anchor);
    const [page, setPage] = useState(1);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { detailQuestion, isLoadingQuestion } = useKomunitas();

    const { data: comments, isLoading: isLoadingComment } =
        useGetCommunityPostCommentDetailQuery(
            {
                post_id: detailQuestion?.id as string,
                page: page
            },
            { skip: !isAuthenticated || !detailQuestion?.id }
        );

    useEffect(() => {
        if (
            comments?.next_page !== null &&
            comments?.next_page !== undefined &&
            isAnchorOnScreen &&
            !isLoadingComment
        ) {
            setPage(comments.next_page);
        }
    }, [isAnchorOnScreen]);

    return (
        <div>
            <h3 className="pb-5 text-sm font-bold">Jawaban</h3>
            <div className="flex flex-col gap-[18px]">
                {isLoadingQuestion || isLoadingComment ? (
                    <Skeleton repeat={2} className="!mb-0 h-40" />
                ) : comments?.comments.length === 0 ? (
                    <EmptyState setIsShowForm={setIsShowForm} />
                ) : (
                    comments?.comments?.map((value) => (
                        <AnswerCard
                            key={value.id}
                            {...value}
                            category={category?.id as string}
                            isExpert={
                                detailQuestion?.student.username !==
                                    value.student.username &&
                                value.student.is_expert
                            }
                            questionId={detailQuestion?.id as string}
                        />
                    ))
                )}
                <CommunityPaywall />
                <div ref={anchor} className="w-full h-0" />
            </div>
        </div>
    );
};

export default AnswerSection;
