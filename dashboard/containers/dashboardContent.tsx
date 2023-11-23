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
import React from 'react';
import { useSelector } from 'react-redux';

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
        useGetPacketOfferQuery();

    const isShowRecommendedMaterials =
        isLandingPageRevampOn &&
        (!isAuthenticated ||
            !is_subscribed ||
            data?.learning_progress.length === 0);

    return isShowRecommendedMaterials ? (
        <div className="pb-16 space-y-12">
            <Recommendations />
            <div className="flex flex-col items-stretch justify-between gap-3 p-4 text-white rounded-lg md:items-center md:gap-4 lg:flex-row md:p-6 bg-accent-purple">
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
                    href="/kelas"
                    variant="custom"
                    eventName="Click Community Card"
                    className="text-center text-white bg-black whitespace-nowrap">
                    Buat Pertanyaan GRATIS
                </Button>
            </div>
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
        </div>
    ) : (
        <div className="flex flex-col lg:flex-row-reverse gap-[2rem]">
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
