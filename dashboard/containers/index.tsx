import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReferralModal from 'referral/components/ReferralModal';
import DashboardContent from './dashboardContent';
import DashboardFeatures from '../components/DashboardFeatures';
import LanjutBelajarSection from '../components/LanjutBelajar/LanjutBelajarSection';
import SearchSection from 'dashboard/components/Search/SearchSection';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import AnnouncementModal from 'dashboard/components/Announcement/AnnouncementModal';
import { useGetAnnouncementsQuery } from 'dashboard/redux/api/dashboardApi';
import DashboardUpdatesBanner from 'dashboard/components/DashboardBanner';

const DashboardContainer = (): JSX.Element => {
    const router = useRouter();
    const { checkout } = router.query;
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] =
        useState(false);
    const [isAnnouncementAlreadyOpened, setIsAnnouncementAlreadyOpened] =
        useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: announcements } = useGetAnnouncementsQuery(undefined, {
        skip: !isAuthenticated
    });

    useEffect(() => {
        if (checkout === 'success') setIsReferralModalOpen(true);
    }, []);

    useEffect(() => {
        if (announcements && announcements.data.length > 0) {
            setIsAnnouncementModalOpen(true);
        }
    }, [announcements]);

    const onClose = (status: boolean) => {
        setIsAnnouncementModalOpen(status);
        setIsAnnouncementAlreadyOpened(true);
    };

    return (
        <section className="flex flex-col w-full gap-6 pb-4 mx-auto sm:overflow-x-clip md:overflow-x-visible max-w-screen-2xl">
            <DashboardUpdatesBanner bannerType="campaign" />
            <SearchSection />
            <DashboardFeatures />
            {isAuthenticated && <LanjutBelajarSection />}
            <DashboardContent />
            <ReferralModal
                isOpen={isReferralModalOpen}
                setOpen={setIsReferralModalOpen}
            />
            <AnnouncementModal
                isOpen={isAnnouncementModalOpen && !isAnnouncementAlreadyOpened}
                setOpen={onClose}
            />
        </section>
    );
};

export default DashboardContainer;
