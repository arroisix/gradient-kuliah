import Classes from 'landing/components/RevampedSections/Classes';
import RevampedFeature from 'landing/components/RevampedSections/Feature';
import RevampedHero from 'landing/components/RevampedSections/Hero';
import Pricing from 'landing/components/Sections/pricing';
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
        <div>
            <RevampedHero />
            <RevampedFeature />
            <Classes classData={classData} />
            {/* <Testimony />
            <Certificate /> */}
            <Pricing
                pricingData={pricingData}
                ctaEventName="Pricing Button on Main Landing Page"
            />
        </div>
    );
};

export default RevampedLandingContainer;
