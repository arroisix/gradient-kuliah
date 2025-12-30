import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useOnScreen from 'commons/hooks/useOnScreen';
import useTransition from 'commons/hooks/useTransition';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import DropdownFilter from 'komunitas/components/DropdownFilter';
import DropdownSort from 'komunitas/components/DropdownSort';
import KomunitasInput from 'komunitas/components/KomunitasInput';
import MobileTabs from 'komunitas/components/MobileTabs';
import QuestionCard from 'komunitas/components/QuestionCard';
import { useKomunitas } from 'komunitas/contexts/KomunitasProvider';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { CgSearch } from 'react-icons/cg';
import { useTracker } from 'tracker/tracker';
import { toast } from 'react-toastify';
import RightSidebar from 'komunitas/components/RightSidebar';
import EmptyState from 'komunitas/components/EmptyState';
import CommunityBanner from 'komunitas/components/CommunityBanner';
import Button from 'commons/components/elements/Button';
import { FaRegComment } from 'react-icons/fa';
import { cn } from 'commons/utils';
import Skeleton from 'commons/components/elements/Skeleton';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Spinner from 'commons/components/elements/Spinner';
import Breadcrumb from 'commons/components/modules/Breadcrumb';

const KomunitasForm = dynamic(
    () => import('komunitas/components/KomunitasForm'),
    { ssr: false }
);

const KomunitasContainer = ({
    initialData
}: {
    initialData?: CommunityPostResponse & {
        count_items: number;
        next_page?: number;
        previous_page?: number;
    };
}): JSX.Element => {
    const { isMobileBreakpoints, isTabletBreakpoints } = useWindowBreakpoints();
    const router = useRouter();
    const { pathname } = router;
    const { ask, category } = router.query;
    const loadingTransition = useTransition(router);
    const anchor = useRef({} as HTMLDivElement);

    const {
        dataHome = initialData,
        isLoadingDataHome,
        isLoadingPost,
        handleSearch,
        handleSubmitPost,
        sort,
        search,
        subjects,
        searchState,
        setSearch,
        setPage,
        setFilter,
        setSort
    } = useKomunitas();
    const isAuthenticated = useSelector(getIsAuthenticated);

    const [showSort, setShowSort] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const isAnchorOnScreen = useOnScreen(anchor);
    const tracker = useTracker();
    const categoryName = subjects?.categories.filter(
        ({ slug }) => slug === category
    )[0]
        ? subjects?.categories.filter(({ slug }) => slug === category)[0].name
        : '';

    useEffect(() => {
        if (
            dataHome?.next_page !== null &&
            isAnchorOnScreen &&
            !isLoadingDataHome
        ) {
            setPage(dataHome?.next_page as number);
        }
    }, [isAnchorOnScreen]);

    useEffect(() => {
        if (ask === 'true') setShowForm(true);
    }, [ask]);

    async function handleSubmit(
        formContent: string,
        category: string,
        attachmentUrl: string[]
    ): Promise<void> {
        if (!category) {
            toast.error('Kategori tidak boleh kosong', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true,
                toastId: 'KATEGORI_NULL'
            });
            throw new Error('KATEGORI_NULL');
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

        tracker?.genericTrack('Submit Question on Community');

        setShowForm(false);
    }

    function handleChangeSearch(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        setSearch(event.target.value);
    }

    function handleChangeFilter(e: React.ChangeEvent<HTMLSelectElement>): void {
        tracker?.genericTrack('Filter Community Post', {
            'Category Name':
                e.target.options[e.target.options.selectedIndex].text
        });
        setPage(1);

        if (pathname.includes('pertanyaan-ku')) {
            setFilter(e.target.value);
        } else {
            router.push(`/komunitas/${e.target.value}`);
        }
    }

    function handleChangeSort(event: any): void {
        tracker?.genericTrack('Sort Community Post', {
            'Sort By': event.target.textContent
        });
        setPage(1);
        setSort(event.target.id);
    }

    return (
        <>
            <Breadcrumb
                className="w-full py-5"
                nextItem={
                    pathname === '/komunitas/[category]'
                        ? ({
                              name: categoryName
                          } as BreadcrumbItemProps)
                        : undefined
                }
            />
            <section className="grid w-full grid-cols-1 gap-8 lg:grid-cols-5">
                <div className="flex flex-col w-full gap-5 lg:col-span-3">
                    <div className="sticky top-14 flex flex-col gap-5 z-[2] bg-black py-4">
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
                                bucketKey="qna"
                                onSubmit={handleSubmit}
                                cancelButton={() =>
                                    setShowForm((prev) => !prev)
                                }
                                isUsingCategories={true}
                                subjectCategories={subjects?.categories}
                                submitButtonText={
                                    isLoadingPost ? (
                                        <AiOutlineLoading3Quarters className="animate-spin" />
                                    ) : (
                                        'Tanyakan'
                                    )
                                }
                                context="q"
                            />
                        ) : (
                            <CommunityBanner
                                askNow={() =>
                                    toast.info(
                                        'Mohon maaf fitur Diskusi sudah tidak tersedia untuk saat ini, silahkan beralih menggunakan fitur Copilot AI ya!',
                                        {
                                            position: 'top-center',
                                            theme: 'colored',
                                            hideProgressBar: true,
                                            toastId: 'DISKUSI_DEPRECATED'
                                        }
                                    )
                                }
                            />
                        )}
                    </div>

                    {(isMobileBreakpoints || isTabletBreakpoints) && (
                        <MobileTabs />
                    )}
                    <div className="flex items-center justify-between">
                        <h2 className="hidden font-extrabold md:block">
                            {pathname.includes('pertanyaan-ku')
                                ? 'Pertanyaanku'
                                : 'Eksplor'}
                        </h2>
                        <div className="flex items-center w-full gap-3 md:w-fit">
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
                    <div className="flex flex-col items-stretch gap-[18px]">
                        {isLoadingDataHome && !dataHome?.community_posts && (
                            <Skeleton repeat={3} className="h-32 !mb-0" />
                        )}
                        {dataHome?.community_posts.length === 0 ? (
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
                        {isLoadingDataHome && (
                            <Spinner
                                size="medium"
                                className="border-b-accent-purple border-l-accent-purple"
                            />
                        )}
                        <div ref={anchor} className="w-full h-0" />
                    </div>
                </div>
                <div className="relative lg:col-span-2">
                    <RightSidebar askNow={() => setShowForm((prev) => !prev)} />
                </div>
                {loadingTransition && <LoadingBackdrop />}
                <Button
                    variant="primary"
                    className={cn(
                        'transition duration-500 fixed flex items-center gap-2 text-sm md:hidden right-4 bottom-20 md:bottom-8',
                        !showForm
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                    )}
                    onClick={() => setShowForm(true)}>
                    <FaRegComment size={16} />
                    Tanya {!isAuthenticated && ' Gratis'}
                </Button>
            </section>
        </>
    );
};

export default KomunitasContainer;
