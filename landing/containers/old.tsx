import AllClass from '../components/Sections/allClass';
import Certificate from '../components/Sections/certificate';
import Feature from '../components/Sections/feature';
import Hero from '../components/Sections/hero';
import Pricing from '../components/Sections/pricing';
import Testimony from '../components/Sections/testimony';

export default function LandingContainer({
    pricingData
}: {
    pricingData?: PacketOffer[];
}): JSX.Element {
    return (
        <div>
            <Hero />
            <AllClass />
            <Feature />
            <Testimony />
            <Certificate />
            <Pricing
                pricingData={pricingData}
                ctaEventName="Pricing Button on Main Landing Page"
            />
        </div>
    );
}
