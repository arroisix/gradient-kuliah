import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import ReferralModal from 'referral/components/ReferralModal';
import DashboardBanner from './dashboardBanner';
import DashboardContent from './dashboardContent';
import RenewalCard from 'payment/components/RenewalCard';
import DashboardPromptBar from 'copilot/components/DashboardPromptBar/DashboardPromptBar';

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
            <RenewalCard />
            {isAuthenticated && <DashboardPromptBar />}
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
