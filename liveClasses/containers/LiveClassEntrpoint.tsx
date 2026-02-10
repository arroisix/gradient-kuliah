import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { EmptyLiveClass } from 'liveClasses/components/LiveClassEntrypoint/EmptyLiveClass';
import {
    useGetListLiveClassPrivateQuery,
    useGetListLiveClassPublicQuery
} from 'liveClasses/redux/liveClassApi';
import Skeleton from 'commons/components/elements/Skeleton';
import { LiveClassCard } from 'liveClasses/components/LiveClassCard';
import Button from 'commons/components/elements/Button';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { OngoingLiveClass } from 'liveClasses/components/LiveClassEntrypoint/OngoingLiveClass';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';

function LiveClassEntrypointContainer(): JSX.Element {
    const MAX_ITEMS_PER_PAGE = 6;

    const router = useRouter();
    const { page } = router.query as { page: string };
    const pageInt = page ? parseInt(page, 10) : 1;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const {
        isLoading: isLoadingCourseSubscription,
        is_subscribed,
        subscribedFeatures
    } = useCourseSubscription();

    const { data: liveClassPublicData, isLoading: isLoadingLiveClassPublic } =
        useGetListLiveClassPublicQuery(
            {
                limit: MAX_ITEMS_PER_PAGE,
                page: pageInt
            },
            {
                skip: isAuthenticated
            }
        );
    const { data: liveClassPrivateData, isLoading: isLoadingLiveClassPrivate } =
        useGetListLiveClassPrivateQuery(
            {
                limit: MAX_ITEMS_PER_PAGE,
                page: pageInt
            },
            {
                skip: !isAuthenticated
            }
        );
    const liveClass = isAuthenticated
        ? liveClassPrivateData
        : liveClassPublicData;
    const isLoadingLiveClass = isAuthenticated
        ? isLoadingLiveClassPrivate
        : isLoadingLiveClassPublic;
    const isLoading = isLoadingLiveClass || isLoadingCourseSubscription;
    const totalPages = liveClass
        ? liveClass.count_items / MAX_ITEMS_PER_PAGE
        : 0;

    const updatePage = (page: number) => {
        router.replace(
            {
                pathname: router.pathname,
                query: { page: String(page) }
            },
            undefined,
            { shallow: true }
        );
    };

    const handlePrevPage = () => {
        if (pageInt > 1) {
            updatePage(pageInt - 1);
        }
    };

    const handleNextPage = () => {
        if (pageInt < totalPages) {
            updatePage(pageInt + 1);
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        const totalPagesNum = Math.ceil(totalPages);
        const showPages = 5;

        if (totalPagesNum <= showPages) {
            for (let i = 1; i <= totalPagesNum; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (pageInt > 3) {
                pages.push('...');
            }

            const startPage = Math.max(2, pageInt - 1);
            const endPage = Math.min(totalPagesNum - 1, pageInt + 1);

            for (let i = startPage; i <= endPage; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (pageInt < totalPagesNum - 2) {
                pages.push('...');
            }

            pages.push(totalPagesNum);
        }

        return pages;
    };

    return (
        <>
            {!isLoading && liveClass && liveClass.count_items > 0 && (
                <h1 className="text-white font-bold text-2xl leading-tight mb-6">
                    Live Class
                </h1>
            )}

            <OngoingLiveClass />

            <div
                className={cn(
                    'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-rows-2 gap-4',
                    !isAuthenticated && 'md:grid-cols-2 lg:grid-cols-3',
                    !isLoading && liveClass && liveClass.count_items === 0 && 'flex flex-1'
                )}>
                {isLoading || !liveClass ? (
                    <>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </>
                ) : (
                    <>
                        {liveClass.count_items === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] w-full">
                                <EmptyLiveClass />
                            </div>
                        ) : (
                            <>
                                {liveClass.data.map((liveClassItem) => (
                                    <LiveClassCard
                                        key={liveClassItem.id}
                                        {...liveClassItem}
                                    />
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>

            {!isLoadingLiveClass &&
                liveClass &&
                (liveClass.next_page || liveClass.previous_page) && (
                    <div className="flex justify-center items-center gap-2 mt-8 z-20">
                        <Button
                            onClick={handlePrevPage}
                            variant="secondary"
                            disabled={pageInt === 1}
                            className={cn(
                                'text-center flex !p-0 !w-10 !h-10 items-center justify-center rounded-full bg-[#3A3A3A] border-none hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed'
                            )}>
                            <FiChevronLeft size={20} color="#ffffff" />
                        </Button>

                        {generatePageNumbers().map((pageNumber, idx) => (
                            <div key={idx}>
                                {pageNumber === '...' ? (
                                    <span className="text-white px-2">...</span>
                                ) : (
                                    <Button
                                        onClick={() =>
                                            updatePage(pageNumber as number)
                                        }
                                        variant="custom"
                                        className={cn(
                                            'text-center flex !p-0 !w-10 !h-10 items-center justify-center rounded-full border-none',
                                            pageInt === pageNumber
                                                ? 'bg-white text-black font-bold'
                                                : 'bg-[#2C2C2C] text-white hover:bg-[#4A4A4A]'
                                        )}>
                                        {pageNumber}
                                    </Button>
                                )}
                            </div>
                        ))}

                        <Button
                            onClick={handleNextPage}
                            variant="secondary"
                            disabled={
                                pageInt ===
                                liveClass.count_items / MAX_ITEMS_PER_PAGE
                            }
                            className={cn(
                                'text-center flex !p-0 !w-10 !h-10 items-center justify-center rounded-full bg-[#3A3A3A] border-none hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed'
                            )}>
                            <FiChevronRight size={20} color="#ffffff" />
                        </Button>
                    </div>
                )}

            {!is_subscribed ||
            (subscribedFeatures &&
                !subscribedFeatures.includes('live_class')) ? (
                <>
                    <div className="md:hidden py-4">
                        <RenewSubscriptionBanner
                            type="K12_MOBILE"
                            k12Product="Live Class"
                            k12Description="Selain Live Class nikmati ribuan video pembelajaran, bank soal, dan fitur eksklusif lainnya tanpa batas."
                        />
                    </div>
                    {isAuthenticated && (
                        <div className="w-full h-[108px] xl:hidden" />
                    )}
                    {isAuthenticated && (
                        <div className="w-full h-[64px] xl:block hidden" />
                    )}
                    <RenewSubscriptionBanner
                        type="K12"
                        k12Product="Live Class"
                        k12Description="Selain Live Class nikmati ribuan video pembelajaran, bank soal, dan fitur eksklusif lainnya tanpa batas."
                        className={cn(
                            isAuthenticated ? '' : 'md:translate-x-1/2'
                        )}
                    />
                </>
            ) : null}
        </>
    );
}

export { LiveClassEntrypointContainer };
