import Paywall from 'commons/components/elements/Paywall';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import React from 'react';

const VideoPaywall = ({
    header = 'Beli untuk melihat video ini'
}: {
    header?: string;
}): JSX.Element => {
    const router = useRouter();
    const { data } = useGetPacketOfferQuery();
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center w-screen -mx-4 sm:w-auto sm:mx-0 md:sticky '
            )}>
            <h2 className="mb-4 text-xl font-extrabold leading-relaxed text-center">
                {header}
            </h2>
            <Paywall
                pricingData={data?.data}
                isCarousel
                redirect={router.asPath}
                className={cn('w-screen sm:w-auto')}
                highlightedClassName="!order-none"
                pricingClassName="max-w-[18rem] sm:max-w-xs"
                ctaEventName="Click Pricing Button on Video"
            />
        </div>
    );
};

export default VideoPaywall;
