import { skipToken } from '@reduxjs/toolkit/dist/query';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Paywall from 'commons/components/elements/Paywall';
import Skeleton from 'commons/components/elements/Skeleton';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Recommendations from 'dashboard/components/Recommendations';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import React, { useCallback } from 'react';
import { renderToString } from 'react-dom/server';
import { useSelector } from 'react-redux';
import { useLocalStorage } from 'usehooks-ts';
import useDriver from 'library/driver.js/useDriver';
import 'driver.js/dist/driver.css';
import { FiChevronRight } from 'react-icons/fi';
import { dashboardTourConfig } from './../constants/dashboard-tour';
import PrivateDashboardContent from 'dashboard/components/PrivateDashboardContent';
import { useGetMajorClassesQuery } from 'dashboard/redux/api/dashboardApi';

const DashboardContent = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: majorClasses, isLoading: isLoadingMajorClasses } =
        useGetMajorClassesQuery({ limit: 12 }, { skip: !isAuthenticated });

    const major = majorClasses?.major;

    const { is_subscribed, everSubscribed } = useCourseSubscription();
    const { data: pricingData, isLoading: isLoadingPricingData } =
        useGetPacketOfferQuery(is_subscribed ? skipToken : undefined);

    const isShowRecommendedMaterials =
        !isAuthenticated && !is_subscribed && !everSubscribed;

    const [tourViewed, setTourViewed] = useLocalStorage('tourViewed', false);
    const driver = useDriver({
        ...dashboardTourConfig,
        onPopoverRender: (popover, { config, state }) => {
            if (state.activeIndex == 0) {
                const skipButton = document.createElement('button');
                skipButton.innerText = 'Lewati';
                skipButton.classList.add('secondary');
                popover.footerButtons.prepend(skipButton);

                skipButton.addEventListener('click', () => {
                    driver.current?.destroy();
                });
            }

            if (config.steps && state.activeIndex == config.steps.length - 1) {
                popover.nextButton.innerText = 'Selesai';
            } else {
                popover.nextButton.innerHTML = `Lanjut ${renderToString(
                    <FiChevronRight size={16} className="ml-[2px] -mr-[5px]" />
                )}`;
            }

            const buttons = [];
            for (let i = 0; i < (config.steps?.length ?? 0); i++) {
                const button = document.createElement('button');

                button.className = 'step-button';
                if (i == state.activeIndex) {
                    button.classList.add('active');
                }
                if (state.activeIndex != null && i <= state.activeIndex) {
                    button.classList.add('visited');
                }

                button.addEventListener('click', () => {
                    driver.current?.drive(i);
                });

                buttons.push(button);
            }

            if (popover.nextButton.style.display !== 'none') {
                popover.nextButton.style.removeProperty('display');
            }
            if (popover.previousButton.style.display !== 'none') {
                popover.previousButton.style.removeProperty('display');
            }

            popover.progress.replaceChildren(...buttons);
        },
        onDestroyed() {
            setTourViewed(true);
        }
    });

    const showTutorial = useCallback(() => {
        if (isShowRecommendedMaterials && !tourViewed && isAuthenticated) {
            driver.current?.drive();
        }
    }, [tourViewed, isAuthenticated, isShowRecommendedMaterials, driver]);

    return isShowRecommendedMaterials ? (
        <div className="pb-16 space-y-12">
            <Recommendations onFinishLoading={showTutorial} />
            {!is_subscribed && (
                <div className="w-full space-y-6">
                    <p className="text-xl font-extrabold leading-relaxed text-center">
                        Tertarik? Beli sekarang untuk mengakses seluruh materi
                    </p>
                    {isLoadingPricingData && !pricingData ? (
                        <div className="flex flex-col items-center justify-center gap-4 xl:flex-row xl:flex-nowrap">
                            <Skeleton
                                repeat={3}
                                className="w-full max-w-xs md:max-w-sm h-96 !mb-0"
                            />
                        </div>
                    ) : (
                        <Paywall
                            pricingData={pricingData?.data}
                            ctaEventName="Click Pricing Button on Dashboard"
                            className="justify-center"
                        />
                    )}
                </div>
            )}
        </div>
    ) : (
        <>
            {isAuthenticated && (
                <div className="flex w-full justify-center lg:justify-start -mb-6">
                    <div className="inline-flex w-fit items-center gap-2 rounded-t-md md:rounded-t-lg lg:rounded-t-xl bg-[#291E4D] px-3 py-1.5 md:px-4 md:py-2">
                        <p className="inline text-sm md:text-base">✨</p>
                        <p className="inline text-white text-[10px] sm:text-sm">
                            Rekomendasi Spesial
                        </p>

                        <p className="inline rounded-lg bg-[#363488] px-2 py-0.5 text-white text-[10px] sm:text-sm font-semibold md:px-3 md:py-1">
                            Jurusan {major}
                        </p>
                    </div>
                </div>
            )}

            <PrivateDashboardContent />
        </>
    );
};

export default DashboardContent;
