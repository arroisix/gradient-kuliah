import Classes from 'landing/components/RevampedSections/Classes';
import RevampedFeature from 'landing/components/RevampedSections/Feature';
import RevampedHero from 'landing/components/RevampedSections/Hero';
import IndonesiaMapCTA from 'landing/components/RevampedSections/IndonesiaMapCTA';
import Pricing from 'landing/components/RevampedSections/Pricing';
import Testimony from 'landing/components/OldSections/testimony';
import React from 'react';

type RevampedLandingContainerProps = {
    pricingData?: PacketOffer[];
    classData?: Course[];
    majorData?: MajorOptions[];
};

const RevampedLandingContainer = ({
    pricingData,
    classData,
    majorData
}: RevampedLandingContainerProps): JSX.Element => {
    return (
        <>
            <RevampedHero majorData={majorData} />
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
