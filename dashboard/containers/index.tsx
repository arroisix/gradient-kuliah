import ContinueLearning from 'dashboard/components/ContinueLearning';
import MyClass from 'dashboard/components/MyClass';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReferralModal from 'referral/components/ReferralModal';
import DashboardBanner from './dashboardBanner';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

const DashboardContainer = (): JSX.Element => {
    const router = useRouter();
    const { checkout } = router.query;
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    useEffect(() => {
        if (checkout === 'success') setIsReferralModalOpen(true);
    }, []);

    return (
        <section className="flex flex-col gap-6">
            <DashboardBanner />
            {isLandingPageRevampOn.toString()}
            <div className="flex flex-col lg:flex-row-reverse gap-[2rem]">
                <MyClass className="w-full lg:w-3/12" />
                <ContinueLearning className="w-full lg:w-9/12" />
            </div>
            <ReferralModal
                isOpen={isReferralModalOpen}
                setOpen={setIsReferralModalOpen}
            />
        </section>
    );
};

export default DashboardContainer;
