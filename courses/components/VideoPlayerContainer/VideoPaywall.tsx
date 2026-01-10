import { useAuth } from 'authentication/contexts/AuthProvider';
import Paywall from 'commons/components/elements/Paywall';
import { cn } from 'commons/utils';
import Langganan from 'landing/components/utbk/Langganan';
import { useRouter } from 'next/router';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import React from 'react';

const VideoPaywall = ({
    header = 'Beli untuk melihat video ini'
}: {
    header?: string;
}): JSX.Element => {
    const { profile } = useAuth();
    const router = useRouter();
    const { data } = useGetPacketOfferQuery(undefined, {
        skip:
            profile?.current_role === 'K12' || router.pathname.includes('/utbk')
    });

    return (
        <div
            className={cn(
                'py-4 flex flex-col items-center justify-center w-full'
            )}>
            <h2 className="text-[#999999] mb-4 text-xl font-extrabold leading-relaxed text-center">
                {header}
            </h2>

            {profile?.current_role === 'K12' ||
            router.pathname.includes('/utbk') ? (
                <Langganan className="w-full" isVideoPaywall />
            ) : (
                <Paywall
                    pricingData={data?.data}
                    isCarousel
                    redirect={router.asPath}
                    className={cn('w-screen sm:w-auto')}
                    highlightedClassName="!order-none"
                    pricingClassName="max-w-[18rem] sm:max-w-xs"
                    ctaEventName="Click Pricing Button on Video"
                />
            )}
        </div>
    );
};

export default VideoPaywall;
