import Hero from 'landing/components/Sections/Hero';
import Features from 'landing/components/Sections/Features';
import IndonesiaMapCTA from 'landing/components/Sections/IndonesiaMapCTA';
import Pricing from 'landing/components/Sections/Pricing';

const LandingContainer = ({
    pricingData
}: LandingContainerProps): JSX.Element => {
    return (
        <div className="bg-black min-h-screen">
            <Hero />
            <Features />
            <Pricing
                pricingData={pricingData}
                ctaEventName="Pricing Button on Main Landing Page"
            />
            <IndonesiaMapCTA />
        </div>
    );
};

export default LandingContainer;
