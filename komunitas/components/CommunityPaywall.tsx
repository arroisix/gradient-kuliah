import { useFeatureIsOn } from '@growthbook/growthbook-react';
import Paywall from 'commons/components/elements/Paywall';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import React from 'react';

const CommunityPaywall = (): JSX.Element => {
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    const { data } = useGetPacketOfferQuery();

    return isLandingPageRevampOn && !is_subscribed ? (
        <div
            className={cn(
                'flex flex-col items-center justify-center w-screen -mx-4 sm:w-auto sm:mx-0 relative z-[1]'
            )}>
            <h2 className="mb-4 text-xl font-extrabold leading-relaxed text-center">
                Beli untuk melihat jawaban
            </h2>
            <Paywall
                pricingData={data?.data}
                isCarousel
                redirect={router.asPath}
                className="w-screen sm:w-full"
                highlightedClassName="!order-none"
                pricingClassName="max-w-[18rem] sm:max-w-xs lg:max-w-sm"
            />
            <span className="absolute inset-0 pointer-events-none before:hidden after:hidden lg:before:block lg:after:block before:absolute after:absolute before:z-[2] after:z-[2] before:w-8 after:w-8 before:inset-y-0 after:inset-y-0 before:pointer-events-none after:pointer-events-none before:bg-[linear-gradient(to_right,rgba(0,0,0,0.5),rgba(0,0,0,0))] before:left-0 after:bg-[linear-gradient(to_left,rgba(0,0,0,0.5),rgba(0,0,0,0))] after:right-0"></span>
        </div>
    ) : (
        <></>
    );
};

export default CommunityPaywall;
