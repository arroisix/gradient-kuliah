import React from 'react';
import Container from './Container';
import Paywall from 'commons/components/elements/Paywall';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import { UTBKSubscriptionBanner } from 'commons/components/UTBKSubscriptionBanner';

const Pricing = ({
    pricingData,
    ctaEventName
}: LandingPricingProps): JSX.Element => {
    const { isTabletBreakpoints } = useWindowBreakpoints();
    return (
        <Container
            id="pricing"
            className={cn(
                'space-y-6 py-9 md:py-16 scroll-mt-12',
                isTabletBreakpoints && '!px-0'
            )}>
            <p className="text-xl font-extrabold leading-relaxed text-center">
                Tertarik? Langganan untuk mengakses seluruh materi
            </p>
            <Paywall
                pricingData={pricingData}
                ctaEventName={ctaEventName}
                isCarousel={isTabletBreakpoints}
            />
            <UTBKSubscriptionBanner />
        </Container>
    );
};

export default Pricing;
