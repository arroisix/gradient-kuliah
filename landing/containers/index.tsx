import Hero from 'landing/components/Sections/Hero';
import IndonesiaMapCTA from 'landing/components/Sections/IndonesiaMapCTA';
import Pricing from 'landing/components/Sections/Pricing';

type LandingContainerProps = {
    pricingData?: PacketOffer[];
};

const LandingContainer = ({
    pricingData
}: LandingContainerProps): JSX.Element => {
    return (
        <div className="bg-black min-h-screen">
            <Hero />
            <Pricing
                pricingData={pricingData}
                ctaEventName="Pricing Button on Main Landing Page"
            />
            <IndonesiaMapCTA />
        </div>
    );
};

export default LandingContainer;
