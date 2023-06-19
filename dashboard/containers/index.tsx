import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import ContinueLearning from 'dashboard/components/ContinueLearning';
import MyClass from 'dashboard/components/MyClass';
import OfferNotification from 'dashboard/components/OfferNotification';

const DashboardContainer = (): JSX.Element => {
    const { is_subscribed, isLoading } = useCourseSubscription();

    return (
        <section className="min-h-screen flex flex-col gap-6">
            {!is_subscribed && !isLoading && <OfferNotification />}
            <div className="flex flex-col md:flex-row-reverse gap-[2rem]">
                <MyClass className="w-full md:w-3/12" />
                <ContinueLearning className="w-full md:w-9/12" />
            </div>
        </section>
    );
};

export default DashboardContainer;
