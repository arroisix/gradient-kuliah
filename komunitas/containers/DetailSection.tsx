import Skeleton from 'commons/components/elements/Skeleton';
import AnswerCard from 'komunitas/components/AnswerCard';
import QuestionCard from 'komunitas/components/QuestionCard';
import {
    useGetCommunityPostCommentDetailQuery,
    useGetCommunityPostDetailQuery,
    useGetExploreQuestionQuery,
    useGetSubjectCategoriesQuery
} from 'komunitas/redux/api/komunitasApi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdChevronRight } from 'react-icons/md';

const DetailSection = (): JSX.Element => {
    const router = useRouter();

    const { data: subjects } = useGetSubjectCategoriesQuery();

    const {
        data: question,
        isLoading: isLoadingQuestion,
        isFetching: isFetchingQuestion
    } = useGetCommunityPostDetailQuery(
        {
            slug: router.query.id as string
        },
        { skip: !router.query.id }
    );

    const category = subjects?.categories.filter(
        (value) => value.name === question?.category
    )[0];

    const {
        data: comments,
        isLoading: isLoadingComment,
        isFetching: isFetchingComment,
        refetch: refetchPostComment
    } = useGetCommunityPostCommentDetailQuery(
        {
            post_id: question?.id as string
        },
        { skip: !question?.id }
    );

    const { data: similiars } = useGetExploreQuestionQuery(
        {
            category_id: category?.id as string
        },
        {
            skip: !category?.id
        }
    );

    return (
        <section className="flex flex-col lg:flex-row gap-[2rem]">
            <div className="w-full lg:w-8/12 flex flex-col gap-9">
                <div>
                    <h3 className="font-bold text-sm pb-5">Pertanyaan</h3>
                    {isLoadingQuestion || isFetchingQuestion ? (
                        <Skeleton className="!mb-0 h-40" />
                    ) : (
                        <QuestionCard
                            {...(question as CommunityPostDetailResponse)}
                            category={category?.id as string}
                            refetchPostComment={refetchPostComment}
                            clickable={false}
                        />
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-sm pb-5">Jawaban</h3>
                    <div className="flex flex-col gap-[18px]">
                        {isLoadingQuestion ||
                        isFetchingQuestion ||
                        isLoadingComment ||
                        isFetchingComment ? (
                            <>
                                <Skeleton className="!mb-0 h-40" />
                                <Skeleton className="!mb-0 h-40" />
                            </>
                        ) : (
                            comments?.comments?.map((value) => (
                                <AnswerCard
                                    key={value.id}
                                    {...value}
                                    category={category?.id as string}
                                    isExpert={
                                        question?.student.username !==
                                            value.student.username &&
                                        value.student.is_expert
                                    }
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            <div className="relative w-screen md:w-full lg:w-4/12 h-[350px] bg-[#121212] ml-[-16px] mb-[-40px] md:m-0 px-[18px] py-5 md:rounded-lg overflow-hidden">
                <h4 className="font-extrabold pb-[20px]">Pertanyaan Serupa</h4>
                <div className="flex flex-col gap-2 px-[10px] py-[10px] bg-[#1D1D1D] rounded">
                    {similiars ? (
                        similiars?.questions?.map(({ slug, content }) => (
                            <Link key={slug} href={`/komunitas/${slug}`}>
                                <div className="flex justify-between items-center gap-2 py-1 cursor-pointer z-[1]">
                                    <span className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                                        {content}
                                    </span>
                                    <div>
                                        <MdChevronRight
                                            className="text-neutral-600"
                                            size={18}
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <>
                            <Skeleton className="h-3 !mb-0" />
                            <Skeleton className="h-3 !mb-0" />
                            <Skeleton className="h-3 !mb-0" />
                        </>
                    )}
                </div>
                <div className="absolute w-full h-full left-0 top-0">
                    <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-[#121212] to-[#121212] z-[1]"></div>
                    <div className="absolute bottom-0 left-0 w-full px-[18px] z-[1]">
                        <Link href={'/komunitas'}>
                            <button className="bg-neutral-800 font-extrabold text-xs w-full py-2 rounded-[70px]">
                                Lihat di Komunitas
                            </button>
                        </Link>
                        <div className="w-full h-[48px] md:h-[20px] bg-[#121212]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailSection;
