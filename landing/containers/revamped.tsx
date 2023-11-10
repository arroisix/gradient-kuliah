import Classes from 'landing/components/RevampedSections/Classes';
import RevampedFeature from 'landing/components/RevampedSections/Feature';
import RevampedHero from 'landing/components/RevampedSections/Hero';
import IndonesiaMapCTA from 'landing/components/RevampedSections/IndonesiaMapCTA';
import Pricing from 'landing/components/RevampedSections/Pricing';
import Testimony from 'landing/components/Sections/testimony';
import React from 'react';

type RevampedLandingContainerProps = {
    pricingData?: PacketOffer[];
    classData?: Course[];
};

const RevampedLandingContainer = ({
    pricingData,
    classData
}: RevampedLandingContainerProps): JSX.Element => {
    return (
        <>
            <RevampedHero />
            <RevampedFeature />
            <Classes classData={classData} />
            <Testimony revamped />
            <Pricing
                pricingData={pricingData}
                ctaEventName="Pricing Button on Main Landing Page"
            />
            <IndonesiaMapCTA />
        </>
    );
};

export default RevampedLandingContainer;
