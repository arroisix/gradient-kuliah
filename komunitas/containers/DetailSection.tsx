import AuthContext from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import useOnScreen from 'commons/hooks/useOnScreen';
import AnswerCard from 'komunitas/components/AnswerCard';
import QuestionCard from 'komunitas/components/QuestionCard';
import { useKomunitas } from 'komunitas/contexts/KomunitasProvider';
import {
    useGetCommunityPostCommentDetailQuery,
    useGetExploreQuestionQuery
} from 'komunitas/redux/api/komunitasApi';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdChevronRight } from 'react-icons/md';

const DetailSection = (): JSX.Element => {
    const anchor = useRef({} as HTMLDivElement);
    const isAnchorOnScreen = useOnScreen(anchor);

    const [isShowForm, setIsShowForm] = useState(false);
    const [page, setPage] = useState(1);

    const { detailQuestion, isLoadingQuestion, subjects } = useKomunitas();

    const category = subjects?.categories.filter(
        (value) => value.name === detailQuestion?.category
    )[0];

    const { data: comments, isLoading: isLoadingComment } =
        useGetCommunityPostCommentDetailQuery(
            {
                post_id: detailQuestion?.id as string,
                page: page
            },
            { skip: !detailQuestion?.id }
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
        <section className="flex flex-col lg:flex-row gap-[2rem]">
            <div className="w-full lg:w-8/12 flex flex-col gap-9">
                <div>
                    <h3 className="font-bold text-sm pb-5">Pertanyaan</h3>
                    {isLoadingQuestion ? (
                        <Skeleton className="!mb-0 h-40" />
                    ) : (
                        <QuestionCard
                            {...(detailQuestion as CommunityPostDetailResponse)}
                            category={category?.id as string}
                            clickable={false}
                            isShowForm={isShowForm}
                            setIsShowForm={setIsShowForm}
                        />
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-sm pb-5">Jawaban</h3>
                    <div className="flex flex-col gap-[18px]">
                        {isLoadingQuestion || isLoadingComment ? (
                            <>
                                <Skeleton className="!mb-0 h-40" />
                                <Skeleton className="!mb-0 h-40" />
                            </>
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
                                />
                            ))
                        )}
                        <div ref={anchor} className="w-full h-0" />
                    </div>
                </div>
            </div>
            <RightSidebar category={category} />
        </section>
    );
};

const RightSidebar = ({
    category
}: {
    category?: {
        id: string;
        name: string;
    };
}): JSX.Element => {
    const { detailQuestion } = useKomunitas();

    const { data: similiars } = useGetExploreQuestionQuery(
        {
            category_id: category?.id,
            current_post: detailQuestion?.id
        },
        {
            skip: !category?.id || !detailQuestion?.id
        }
    );

    return (
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
    );
};

const EmptyState = ({
    setIsShowForm
}: {
    setIsShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
    const { profile } = useContext(AuthContext);
    const { detailQuestion } = useKomunitas();

    return (
        <div className="flex flex-col gap-6 p-6 lg:p-10 bg-[#161616] rounded-xl">
            <div className="relative h-[250px]">
                <Image
                    src="https://assets.gradient.academy/assets/empty-answer-community.png"
                    alt="empty-answer-community"
                    layout="fill"
                    className="object-contain"
                />
            </div>
            <div className="flex flex-col items-center gap-[18px]">
                <span className="inline-block font-extrabold">
                    {profile?.username === detailQuestion?.student.username
                        ? 'Pertanyaan ini masih menunggu jawaban'
                        : `${detailQuestion?.student.username} menunggu jawabanmu`}
                </span>
                {!!!(
                    profile?.username === detailQuestion?.student.username
                ) && (
                    <Button
                        variant="custom"
                        className="font-extrabold text-xs bg-[#242424]"
                        onClick={() => setIsShowForm(true)}>
                        Tambahkan Jawaban
                    </Button>
                )}
            </div>
        </div>
    );
};

export default DetailSection;
