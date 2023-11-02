import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import ContinueLearning from 'dashboard/components/ContinueLearning';
import MyClass from 'dashboard/components/MyClass';
import OfferNotification from 'dashboard/components/OfferNotification';
import TutorBanner from 'dashboard/components/TutorBanner';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReferralModal from 'referral/components/ReferralModal';

const DashboardContainer = (): JSX.Element => {
    const router = useRouter();
    const { checkout } = router.query;
    const { is_subscribed, isLoading } = useCourseSubscription();
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

    useEffect(() => {
        if (checkout === 'success') setIsReferralModalOpen(true);
    }, []);

    return (
        <section className="flex flex-col min-h-screen gap-6">
            {!isLoading && is_subscribed ? (
                <TutorBanner />
            ) : (
                <OfferNotification />
            )}
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
