import Paywall from 'commons/components/elements/Paywall';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import ExerciseDetailHeader from '../Header/ExerciseDetailHeader';

const ExercisePaywall = ({ isFree }: { isFree: boolean }) => {
    const router = useRouter();
    const { slug } = router.query;
    const { is_subscribed } = useCourseSubscription();
    const { data } = useGetPacketOfferQuery();
    const { isTabletBreakpoints, isMobileBreakpoints } = useWindowBreakpoints();

    if (isFree || is_subscribed) {
        return null;
    }

    return (
        <div
            className={
                'fixed  top-0 left-0 h-screen w-screen -inset-2 backdrop-blur-lg lg:inset-0 z-[15] flex flex-col justify-center items-center'
            }>
            <div className="w-full max-w-screen-xl flex items-center absolute top-0 p-4">
                <ExerciseDetailHeader />
            </div>
            <h2 className="mb-4 text-xl font-extrabold leading-relaxed text-center">
                Tertarik? Langganan untuk mengakses seluruh materi
            </h2>
            <Paywall
                pricingData={data?.data}
                redirect={router.asPath}
                isCarousel={isTabletBreakpoints || isMobileBreakpoints}
                ctaEventName="Click Pricing Button on Exercise"
                ctaEventPayload={{ 'Exercise Slug': slug }}
                highlightedClassName="!order-none"
                pricingClassName="max-w-[18rem] sm:max-w-xs lg:max-w-sm"
            />
        </div>
    );
};

export default ExercisePaywall;
