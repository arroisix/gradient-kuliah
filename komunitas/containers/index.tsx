import AuthContext from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import Skeleton from 'commons/components/elements/Skeleton';
import useOnScreen from 'commons/hooks/useOnScreen';
import useTransition from 'commons/hooks/useTransition';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import DropdownFilter from 'komunitas/components/DropdownFilter';
import DropdownSort from 'komunitas/components/DropdownSort';
import KomunitasForm from 'komunitas/components/KomunitasForm';
import KomunitasInput from 'komunitas/components/KomunitasInput';
import MobileTabs from 'komunitas/components/MobileTabs';
import QuestionCard from 'komunitas/components/QuestionCard';
import {
    useGetCommunityPostQuery,
    useGetExploreQuestionQuery,
    useGetMyQuestionListQuery,
    useGetSubjectCategoriesQuery,
    usePostQuestionAnswerMutation
} from 'komunitas/redux/api/komunitasApi';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { CgSearch } from 'react-icons/cg';
import { MdChevronRight } from 'react-icons/md';
import { toast } from 'react-toastify';

const KomunitasContainer = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const router = useRouter();
    const { pathname } = router;
    const loadingTransition = useTransition(router);
    const { profile } = useContext(AuthContext);
    const anchor = useRef({} as HTMLDivElement);

    const { data: subjects } = useGetSubjectCategoriesQuery();
    const [postCommunity, { isLoading: isLoadingPost }] =
        usePostQuestionAnswerMutation();

    const [formContent, setFormContent] = useState('');
    const [category, setCategory] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
    const [attachmentName, setAttachmentName] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [showSort, setShowSort] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState<
        'LATEST' | 'POPULAR' | 'ANSWERED' | 'NOT_ANSWERED'
    >('LATEST');
    const isAnchorOnScreen = useOnScreen(anchor);

    const { data, isLoading: isLoadingData } = useGetCommunityPostQuery({
        sort_by: sort,
        category_id: filter,
        user_id: pathname.includes('pertanyaan-ku')
            ? profile?.user_id
            : undefined,
        page: page
    });

    useEffect(() => {
        if (data?.next_page !== null && isAnchorOnScreen && !isLoadingData) {
            setPage((prev) => prev + 1);
        }
    }, [isAnchorOnScreen]);

    const { data: myQuestion, isLoading: isLoadingMyQuestion } =
        useGetMyQuestionListQuery(
            {
                user_id: profile?.user_id as string
            },
            { skip: !profile?.user_id }
        );

    const { data: sideExploreData, isLoading: isLoadingSideExplore } =
        useGetExploreQuestionQuery(
            {},
            { skip: !pathname.includes('pertanyaan-ku') }
        );

    async function handleSubmit(): Promise<void> {
        if (!category) {
            toast.error('Kategori tidak boleh kosong', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true,
                toastId: 'KATEGORI_NULL'
            });
            return;
        }

        const contentwithAttachments =
            attachmentUrl.length !== 0
                ? `${formContent}${attachmentUrl.map(
                      (value) => `\n\n![image](${value})`
                  )}`
                : formContent;

        if (!contentwithAttachments) {
            toast.error('Pertanyaan tidak boleh kosong', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true,
                toastId: 'KATEGORI_NULL'
            });
            return;
        }

        await postCommunity({
            post_id: null,
            content: contentwithAttachments,
            category_id: category,
            attachment_urls: attachmentUrl
        });

        setFormContent('');
        setCategory('');
        setAttachmentUrl([]);
        setAttachmentName([]);
        setShowForm(false);
    }

    function handleChangeSearch(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        setSearch(event.target.value);
    }

    function handleChangeFilter(e: React.ChangeEvent<HTMLSelectElement>): void {
        setPage(1);
        setFilter(e.target.value);
    }

    function handleChangeSort(event: any): void {
        setPage(1);
        setSort(event.target.id);
    }

    return (
        <section className="flex flex-col lg:flex-row gap-[2rem]">
            <div className="w-full lg:w-8/12 flex flex-col gap-6">
                <KomunitasInput
                    type="text"
                    name="search"
                    value={search}
                    placeholder="Cari pertanyaan"
                    onChange={handleChangeSearch}
                    rightIcon={<CgSearch />}
                    handleSubmit={() => undefined}
                />
                {showForm ? (
                    <KomunitasForm
                        formContent={formContent}
                        setFormContent={setFormContent}
                        category={category}
                        setCategory={setCategory}
                        attachmentUrl={attachmentUrl}
                        setAttachmentUrl={setAttachmentUrl}
                        attachmentName={attachmentName}
                        setAttachmentName={setAttachmentName}
                        bucketKey="qna"
                        handleSubmit={handleSubmit}
                        cancelButton={() => setShowForm((prev) => !prev)}
                        isUsingCategories={true}
                        subjectCategories={subjects?.categories}
                        submitButtonText={
                            isLoadingPost ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : (
                                'Tanyakan'
                            )
                        }
                    />
                ) : (
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full px-5 py-[14px] bg-[#5F2BCE] rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="inline-block leading-none py-[4px] px-[6px] font-bold font-[Urbanist] text-center bg-black rounded-full">
                                G
                            </span>
                            <span className="inline-block font-body text-xs">
                                Tidak menemukan jawaban di komunitas?
                            </span>
                        </div>
                        <Button
                            variant="custom"
                            className="font-extrabold text-xs px-6 bg-black w-full md:w-fit"
                            onClick={() => setShowForm((prev) => !prev)}>
                            Tanya Sekarang
                        </Button>
                    </div>
                )}

                {isMobileBreakpoints && <MobileTabs />}
                <div className="flex justify-between items-center">
                    <h2 className="hidden md:block font-extrabold">
                        {pathname.includes('pertanyaan-ku')
                            ? 'Pertanyaanku'
                            : 'Eksplor'}
                    </h2>
                    <div className="flex gap-3 items-center w-full md:w-fit">
                        <DropdownFilter
                            onChange={handleChangeFilter}
                            options={subjects}
                        />
                        <DropdownSort
                            showSort={showSort}
                            setShowSort={setShowSort}
                            sort={sort}
                            setSort={setSort}
                            onChange={handleChangeSort}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-[18px]">
                    {isLoadingData ? (
                        <>
                            <Skeleton className="!mb-0 h-40" />
                            <Skeleton className="!mb-0 h-40" />
                            <Skeleton className="!mb-0 h-40" />
                        </>
                    ) : (
                        data?.community_posts?.map((value) => (
                            <QuestionCard
                                key={value.id}
                                {...value}
                                clickable={true}
                            />
                        ))
                    )}
                    <div ref={anchor} className="w-full h-0" />
                </div>
            </div>
            <div className="relative w-screen md:w-full lg:w-4/12">
                <div className="hidden md:block lg:fixed lg:w-[30%] lg:right-[2%] h-[85vh] bg-[#121212] ml-[-16px] mb-[-40px] md:m-0 px-[18px] py-5 md:rounded-lg overflow-hidden">
                    <h4 className="font-extrabold pb-[20px]">
                        {pathname.includes('pertanyaan-ku')
                            ? 'Eksplor'
                            : 'Pertanyaanku'}
                    </h4>
                    <div className="flex flex-col gap-[18px]">
                        {pathname.includes('pertanyaan-ku') ? (
                            isLoadingSideExplore ? (
                                <>
                                    <Skeleton className="h-3 !mb-0" />
                                    <Skeleton className="h-3 !mb-0" />
                                    <Skeleton className="h-3 !mb-0" />
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 px-[10px] py-[10px] bg-[#1D1D1D] rounded">
                                    {sideExploreData?.questions?.map(
                                        ({ slug, content }) => (
                                            <Link
                                                key={slug}
                                                href={`/komunitas/${slug}`}>
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
                                        )
                                    )}
                                </div>
                            )
                        ) : isLoadingMyQuestion || !profile ? (
                            <>
                                <Skeleton className="h-3 !mb-0" />
                                <Skeleton className="h-3 !mb-0" />
                                <Skeleton className="h-3 !mb-0" />
                            </>
                        ) : (
                            myQuestion?.questions?.map((value) => (
                                <div
                                    key={value.date}
                                    className="flex flex-col gap-2">
                                    <span className="font-body text-xs text-neutral-600">
                                        {moment(value.date)
                                            .utc()
                                            .format('MMM DD')}
                                    </span>
                                    <div className="flex flex-col gap-2 px-[10px] py-[10px] bg-[#1D1D1D] rounded">
                                        {value.items.map(
                                            ({
                                                slug,
                                                content,
                                                id,
                                                unseen_comment_counts
                                            }) => (
                                                <Link
                                                    key={id}
                                                    href={`/komunitas/${slug}`}>
                                                    <div className="flex justify-between items-center gap-2 py-1 cursor-pointer z-[1]">
                                                        <span className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                                                            {content}
                                                        </span>
                                                        <div className="flex items-center">
                                                            {unseen_comment_counts ? (
                                                                <span className="inline-block leading-none py-[2px] pl-[3px] pr-[4px] font-body text-center text-[10px] bg-[#B92011] rounded-full">
                                                                    {
                                                                        unseen_comment_counts
                                                                    }
                                                                </span>
                                                            ) : null}
                                                            <MdChevronRight
                                                                className="text-neutral-600"
                                                                size={18}
                                                            />
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="absolute w-full h-full left-0 top-0">
                        <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-[#121212] to-[#121212] z-[1]"></div>
                        <div className="absolute bottom-0 left-0 w-full px-[18px] z-[1]">
                            <Link
                                href={
                                    pathname.includes('pertanyaan-ku')
                                        ? '/komunitas'
                                        : '/komunitas/pertanyaan-ku'
                                }>
                                <button className="bg-neutral-800 font-extrabold text-xs w-full py-2 rounded-[70px]">
                                    {pathname.includes('pertanyaan-ku')
                                        ? 'Lihat di Komunitas'
                                        : 'Lihat Semua'}
                                </button>
                            </Link>
                            <div className="w-full h-[48px] md:h-[20px] bg-[#121212]"></div>
                        </div>
                    </div>
                </div>
            </div>
            {loadingTransition && <LoadingBackdrop />}
        </section>
    );
};

export default KomunitasContainer;
