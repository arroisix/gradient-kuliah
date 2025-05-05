import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import ReferralModal from 'referral/components/ReferralModal';
import DashboardContent from './dashboardContent';
import DashboardPromptBar from 'copilot/components/DashboardPromptBar/DashboardPromptBar';
import DashboardFeatures from '../components/DashboardFeatures';
import LanjutBelajarSection from '../components/LanjutBelajar/LanjutBelajarSection';
import DashboardUpdatesBanner from 'dashboard/components/DashboardBanner';

const DashboardContainer = (): JSX.Element => {
    const router = useRouter();
    const { checkout } = router.query;
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (checkout === 'success') setIsReferralModalOpen(true);
    }, []);

    return (
        <section className="flex flex-col w-full gap-6 pb-4 mx-auto sm:overflow-x-clip md:overflow-x-visible max-w-screen-2xl">
            <DashboardUpdatesBanner />
            {isAuthenticated && <DashboardPromptBar />}
            <DashboardFeatures />
            <LanjutBelajarSection />
            <DashboardContent />
            <ReferralModal
                isOpen={isReferralModalOpen}
                setOpen={setIsReferralModalOpen}
            />
        </section>
    );
};

export default DashboardContainer;
