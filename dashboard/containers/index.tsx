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
import { useAuth } from 'authentication/contexts/AuthProvider';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import K12Dashboard from './K12Dashboard';
import Button from 'commons/components/elements/Button';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

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
    const { profile } = useAuth();
    const { is_subscribed: isSubscribed } = useCourseSubscription();

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

    const onClickSubscribeBanner = () => {
        router.push('/langganan');
    };

    if (isAuthenticated && !profile) {
        return <LoadingBackdrop />;
    }

    if (profile?.current_role === 'K12') {
        return (
            <>
                <K12Dashboard />

                {isSubscribed === false && (
                    <div className="hidden md:block fixed bottom-0 left-1/2 -translate-x-1/2 w-[60%] lg:w-fit z-40 md:translate-x-[calc(-50%+125px)]">
                        <div className="relative rounded-t-2xl p-6 flex flex-row items-center gap-6 bg-[#5F2BCE] overflow-hidden">
                            <div className="flex flex-col gap-2 z-10">
                                <h2 className="text-white font-semibold">
                                    Langganan untuk mendapat akses penuh ke
                                    materi
                                </h2>

                                <span className="text-sm text-white">
                                    Nikmati ribuan video pembelajaran, bank
                                    soal, dan fitur eksklusif lainnya tanpa
                                    batas.
                                </span>
                            </div>

                            <Button
                                variant="custom"
                                size="normal"
                                className="bg-white text-[#5F2BCE] font-semibold px-12 z-10"
                                onClick={onClickSubscribeBanner}>
                                Langganan
                            </Button>

                            <div className="absolute aspect-square w-[320px] lg:w-[260px] z-0 right-0 bottom-[-88px] lg:bottom-[-70px]">
                                <Image
                                    src={`${CDN_URL}/assets/k12-subscribe-illustration.png`}
                                    alt="Subscribe"
                                    layout="fill"
                                    objectPosition="center"
                                    objectFit="contain"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

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
