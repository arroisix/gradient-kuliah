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
import { useGetSubjectCategoriesQuery } from 'komunitas/redux/api/komunitasApi';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { CgSearch } from 'react-icons/cg';
import { useTracker } from 'tracker/tracker';
import { toast } from 'react-toastify';
import RightSidebar from 'komunitas/components/RightSidebar';
import EmptyState from 'komunitas/components/EmptyState';
import GradientIcon from 'commons/components/GradientIcon';

const KomunitasContainer = (): JSX.Element => {
    const { isMobileBreakpoints, isTabletBreakpoints } = useWindowBreakpoints();
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

    const [showSort, setShowSort] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const isAnchorOnScreen = useOnScreen(anchor);
    const tracker = useTracker();

    useEffect(() => {
        if (
            dataHome?.next_page !== null &&
            isAnchorOnScreen &&
            !isLoadingDataHome
        ) {
            setPage(dataHome?.next_page as number);
        }
    }, [isAnchorOnScreen]);

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
        setFilter(e.target.value);
    }

    function handleChangeSort(event: any): void {
        tracker?.genericTrack('Sort Community Post', {
            'Sort By': event.target.textContent
        });
        setPage(1);
        setSort(event.target.id);
    }

    return (
        <section className="flex flex-col lg:grid lg:grid-cols-5 gap-[2rem]">
            <div className="flex flex-col w-full gap-6 lg:col-span-3">
                <div className="sticky top-16 flex flex-col gap-6 z-[2] bg-black py-4">
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
                            context="q"
                        />
                    ) : (
                        <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full px-5 py-[14px] bg-[#5F2BCE] rounded-lg">
                            <div className="flex items-center gap-3">
                                <GradientIcon />
                                <span className="inline-block text-xs font-body">
                                    Tidak menemukan jawaban di komunitas?
                                </span>
                            </div>
                            <Button
                                variant="custom"
                                className="w-full px-6 text-xs font-extrabold bg-black md:w-fit whitespace-nowrap"
                                eventName='"Tanya Sekarang" Button'
                                onClick={() => {
                                    setShowForm((prev) => !prev);
                                }}>
                                Tanya Sekarang
                            </Button>
                        </div>
                    )}
                </div>

                {isMobileBreakpoints || (isTabletBreakpoints && <MobileTabs />)}
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
                <div className="flex flex-col gap-[18px]">
                    {isLoadingDataHome ? (
                        <Skeleton repeat={3} className="!mb-0 h-40" />
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
            <div className="relative lg:col-span-2">
                {/* md:w-full lg:w-4/12 */}
                <RightSidebar />
            </div>
            {loadingTransition && <LoadingBackdrop />}
        </section>
    );
};

export default KomunitasContainer;
