import RevampedHero from 'landing/components/RevampedSections/Hero';
import Pricing from 'landing/components/Sections/pricing';
import React from 'react';

const RevampedLandingContainer = ({
    pricingData
}: {
    pricingData?: PacketOffer[];
}): JSX.Element => {
    return (
        <div>
            <RevampedHero />
            {/* <AllClass />
            <Feature />
            <Testimony />
            <Certificate /> */}
            <Pricing
                pricingData={pricingData}
                ctaEventName="Pricing Button on Main Landing Page"
            />
        </div>
    );
};

export default RevampedLandingContainer;
