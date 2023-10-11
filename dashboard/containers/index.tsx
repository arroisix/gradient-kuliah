import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import ContinueLearning from 'dashboard/components/ContinueLearning';
import MyClass from 'dashboard/components/MyClass';
import OfferNotification from 'dashboard/components/OfferNotification';
import TutorBanner from 'dashboard/components/TutorBanner';

const DashboardContainer = (): JSX.Element => {
    const { is_subscribed, isLoading } = useCourseSubscription();

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
        </section>
    );
};

export default DashboardContainer;
