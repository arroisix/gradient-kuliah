import ContinueLearning from 'dashboard/components/ContinueLearning';
import MyClass from 'dashboard/components/MyClass';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReferralModal from 'referral/components/ReferralModal';
import DashboardBanner from './dashboardBanner';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetStudentLearningProgressQuery } from 'dashboard/redux/api/dashboardApi';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import Recommendations from 'dashboard/components/Recommendations';

const DashboardContainer = (): JSX.Element => {
    const router = useRouter();
    const { checkout } = router.query;
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed } = useCourseSubscription();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    const { data, isLoading } = useGetStudentLearningProgressQuery(
        !isAuthenticated ? skipToken : undefined
    );

    useEffect(() => {
        if (checkout === 'success') setIsReferralModalOpen(true);
    }, []);

    const DashboardContent = (): JSX.Element => {
        const isShowRecommendedMaterials =
            isLandingPageRevampOn &&
            (!isAuthenticated ||
                !is_subscribed ||
                data?.learning_progress.length === 0);

        return isShowRecommendedMaterials ? (
            <Recommendations />
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

    return (
        <section className="flex flex-col gap-6">
            <DashboardBanner />
            <DashboardContent />
            <ReferralModal
                isOpen={isReferralModalOpen}
                setOpen={setIsReferralModalOpen}
            />
        </section>
    );
};

export default DashboardContainer;
