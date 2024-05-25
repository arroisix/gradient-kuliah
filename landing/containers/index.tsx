import Hero from 'landing/components/Sections/Hero';
import Features from 'landing/components/Sections/Features';
import IndonesiaMapCTA from 'landing/components/Sections/IndonesiaMapCTA';
import Pricing from 'landing/components/Sections/Pricing';
import Testimony from 'landing/components/Sections/Testimony';

const LandingContainer = ({
    pricingData
}: LandingContainerProps): JSX.Element => {
    return (
        <div className="bg-black min-h-screen">
            <Hero />
            <Features />
            <Testimony />
            <Pricing
                pricingData={pricingData}
                ctaEventName="Pricing Button on Main Landing Page"
            />
            <IndonesiaMapCTA />
        </div>
    );
};

export default LandingContainer;
