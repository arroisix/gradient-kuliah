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
import { useKomunitas } from 'komunitas/contexts/KomunitasProvider';
import {
    useGetExploreQuestionQuery,
    useGetMyQuestionListQuery,
    useGetSubjectCategoriesQuery
} from 'komunitas/redux/api/komunitasApi';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { posthog } from 'posthog-js';
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
    const anchor = useRef({} as HTMLDivElement);

    const { data: subjects } = useGetSubjectCategoriesQuery();

    const {
        dataHome,
        isLoadingDataHome,
        isLoadingPost,
        handleSearch,
        handleSubmitPost,
        sort,
        search,
        searchState,
        setSearch,
        setPage,
        setFilter,
        setSort
    } = useKomunitas();

    const [formContent, setFormContent] = useState('');
    const [category, setCategory] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
    const [attachmentName, setAttachmentName] = useState<string[]>([]);
    const [showSort, setShowSort] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const isAnchorOnScreen = useOnScreen(anchor);

    useEffect(() => {
        if (
            dataHome?.next_page !== null &&
            isAnchorOnScreen &&
            !isLoadingDataHome
        ) {
            setPage(dataHome?.next_page as number);
        }
    }, [isAnchorOnScreen]);

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
                      (value) => `\n\n[![image](${value})](${value})`
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

        await handleSubmitPost({
            content: contentwithAttachments,
            category_id: category,
            attachment_urls: attachmentUrl
        });

        posthog.capture('Submit Question on Community');

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
        posthog.capture('Filter Community Post', {
            CATEGORY_NAME: e.target.options[e.target.options.selectedIndex].text
        });
        setPage(1);
        setFilter(e.target.value);
    }

    function handleChangeSort(event: any): void {
        posthog.capture('Sort Community Post', {
            SORT_BY: event.target.textContent
        });
        setPage(1);
        setSort(event.target.id);
    }

    return (
        <section className="flex flex-col lg:flex-row gap-[2rem]">
            <div className="w-full lg:w-8/12 flex flex-col gap-6">
                <div className="sticky top-16 flex flex-col gap-6 z-[2] bg-black p-1">
                    <KomunitasInput
                        type="text"
                        name="search"
                        value={search}
                        placeholder="Cari pertanyaan"
                        onChange={handleChangeSearch}
                        rightIcon={<CgSearch />}
                        handleSubmit={() => handleSearch()}
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
                                onClick={() => {
                                    posthog.capture(
                                        'Click "Tanya Sekarang" Button'
                                    );
                                    setShowForm((prev) => !prev);
                                }}>
                                Tanya Sekarang
                            </Button>
                        </div>
                    )}
                </div>

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
                    {isLoadingDataHome ? (
                        <>
                            <Skeleton className="!mb-0 h-40" />
                            <Skeleton className="!mb-0 h-40" />
                            <Skeleton className="!mb-0 h-40" />
                        </>
                    ) : dataHome?.community_posts.length === 0 ? (
                        <EmptyState
                            setShowForm={setShowForm}
                            isOnSearch={searchState !== ''}
                        />
                    ) : (
                        dataHome?.community_posts?.map((value, index) => (
                            <QuestionCard
                                key={index}
                                {...value}
                                clickable={true}
                            />
                        ))
                    )}
                    <div ref={anchor} className="w-full h-0" />
                </div>
            </div>
            <div className="relative w-screen md:w-full lg:w-4/12">
                <RightSidebar />
            </div>
            {loadingTransition && <LoadingBackdrop />}
        </section>
    );
};

const RightSidebar = (): JSX.Element => {
    const router = useRouter();
    const { pathname } = router;
    const { profile } = useContext(AuthContext);

    const { data: myQuestion, isLoading: isLoadingMyQuestion } =
        useGetMyQuestionListQuery(
            {
                user_id: profile?.user_id as string
            },
            { skip: !profile?.user_id, refetchOnMountOrArgChange: true }
        );

    const { data: sideExploreData, isLoading: isLoadingSideExplore } =
        useGetExploreQuestionQuery(
            {},
            { skip: !pathname.includes('pertanyaan-ku') }
        );

    return (
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
                        <div className="flex flex-col gap-2 bg-[#1D1D1D] rounded">
                            {sideExploreData?.questions?.map(
                                ({ slug, content }) => (
                                    <Link
                                        key={slug}
                                        href={`/komunitas/${slug}`}>
                                        <div className="flex justify-between items-center gap-2 cursor-pointer z-[1] px-[10px] py-[10px] first:border-none border-t-[1px] border-t-[#2C2C2C]">
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
                        <div key={value.date} className="flex flex-col gap-2">
                            <span className="font-body text-xs text-neutral-600">
                                {moment(value.date).utc().format('MMM DD')}
                            </span>
                            <div className="flex flex-col gap-2 bg-[#1D1D1D] rounded">
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
                                            <div
                                                key={id}
                                                className="flex justify-between items-center gap-2 cursor-pointer z-[1] px-[10px] py-[10px] first:border-none border-t-[1px] border-t-[#2C2C2C]">
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
                    <button
                        className="bg-neutral-800 font-extrabold text-xs w-full py-2 rounded-[70px]"
                        onClick={() => {
                            posthog.capture(
                                pathname.includes('pertanyaan-ku')
                                    ? 'Visit Community Explore Page'
                                    : 'Visit Community Pertanyaanku Page'
                            );
                            router.push(
                                pathname.includes('pertanyaan-ku')
                                    ? '/komunitas'
                                    : '/komunitas/pertanyaan-ku'
                            );
                        }}>
                        {pathname.includes('pertanyaan-ku')
                            ? 'Lihat di Komunitas'
                            : 'Lihat Semua'}
                    </button>
                    <div className="w-full h-[48px] md:h-[20px] bg-[#121212]"></div>
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({
    setShowForm,
    isOnSearch
}: {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    isOnSearch: boolean;
}): JSX.Element => {
    const { pathname } = useRouter();

    return (
        <div className="flex flex-col gap-6 pt-6">
            <div className="relative h-[250px]">
                <Image
                    src={
                        isOnSearch
                            ? 'https://assets.gradient.academy/assets/empty-search-community.png'
                            : pathname === '/komunitas'
                            ? 'https://assets.gradient.academy/assets/empty-explore-community.png'
                            : 'https://assets.gradient.academy/assets/empty-my-question-community.png'
                    }
                    alt={
                        isOnSearch
                            ? 'empty-search-community'
                            : pathname === '/komunitas'
                            ? 'empty-explore-community'
                            : 'empty-my-question-community'
                    }
                    layout="fill"
                    className="object-contain"
                />
            </div>
            <div className="flex flex-col items-center gap-[18px]">
                {isOnSearch ? (
                    <span className="inline-block font-extrabold">
                        Tidak ada yang cocok
                    </span>
                ) : pathname === '/komunitas' ? (
                    <>
                        <span className="inline-block font-extrabold">
                            Belum ada postingan
                        </span>
                        <Button
                            variant="primary"
                            className="font-extrabold text-xs"
                            onClick={() => setShowForm(true)}>
                            Mulai Post
                        </Button>
                    </>
                ) : (
                    <>
                        <span className="inline-block font-extrabold">
                            Kamu belum pernah menanyakan apapun
                        </span>
                        <Button
                            variant="custom"
                            className="font-extrabold text-xs bg-[#242424]"
                            onClick={() => setShowForm(true)}>
                            Mulai Bertanya
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default KomunitasContainer;
