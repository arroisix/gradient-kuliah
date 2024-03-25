import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import GradientIcon from 'commons/components/GradientIcon';
import Button from 'commons/components/elements/Button';
import Paywall from 'commons/components/elements/Paywall';
import Skeleton from 'commons/components/elements/Skeleton';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import ContinueLearning from 'dashboard/components/ContinueLearning';
import MyClass from 'dashboard/components/MyClass';
import Recommendations from 'dashboard/components/Recommendations';
import { useGetStudentLearningProgressQuery } from 'dashboard/redux/api/dashboardApi';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import React, { useCallback } from 'react';
import { renderToString } from 'react-dom/server';
import { useSelector } from 'react-redux';
import { useLocalStorage } from 'usehooks-ts';
import useDriver from 'library/driver.js/useDriver';
import 'driver.js/dist/driver.css';
import { FiChevronRight } from 'react-icons/fi';
import { dashboardTourConfig } from './../constants/dashboard-tour';

const DashboardContent = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    const { is_subscribed } = useCourseSubscription();
    const { data, isLoading } = useGetStudentLearningProgressQuery(
        !isAuthenticated ? skipToken : undefined
    );
    const { data: pricingData, isLoading: isLoadingPricingData } =
        useGetPacketOfferQuery(is_subscribed ? skipToken : undefined);

    const isShowRecommendedMaterials =
        isLandingPageRevampOn &&
        (!isAuthenticated ||
            !is_subscribed ||
            data?.learning_progress.length === 0);

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
            <div
                className="flex flex-col items-stretch justify-between gap-3 p-4 text-white rounded-lg md:items-center md:gap-4 lg:flex-row md:p-6 bg-accent-purple"
                data-tour="step-4">
                <div className="flex flex-1 gap-3 text-left">
                    <GradientIcon />
                    <div>
                        <p className="text-xl font-extrabold">
                            Bingung sama materi/soal?
                        </p>
                        <p className="font-body">
                            Tulis pertanyaanmu di Gradient untuk dijawab
                            mahasiswa lain
                        </p>
                    </div>
                </div>
                <Button
                    href="/komunitas"
                    variant="custom"
                    eventName="Click Community Card"
                    className="text-center text-white bg-black whitespace-nowrap">
                    Buat Pertanyaan Gratis
                </Button>
            </div>
            {!is_subscribed && (
                <div className="w-full space-y-6">
                    <h2 className="text-xl font-extrabold leading-relaxed text-center">
                        Tertarik? Beli sekarang untuk mengakses seluruh materi
                    </h2>
                    {isLoadingPricingData && !pricingData ? (
                        <div className="flex flex-col items-center justify-center gap-4 xl:flex-row xl:flex-nowrap">
                            <Skeleton
                                repeat={3}
                                className="w-full max-w-xs md:max-w-sm h-96 !mb-0"
                            />
                        </div>
                    ) : (
                        <Paywall
                            isCompact
                            pricingData={pricingData?.data}
                            ctaEventName="Click Pricing Button on Dashboard"
                        />
                    )}
                </div>
            )}
        </div>
    ) : (
        <div className="flex flex-col lg:flex-row-reverse gap-[2rem] pb-16">
            <MyClass className="w-full lg:w-3/12" />
            <ContinueLearning
                isLoading={isLoading}
                learningProgress={data?.learning_progress}
                className="w-full lg:w-9/12"
            />
        </div>
    );
};

export default DashboardContent;
