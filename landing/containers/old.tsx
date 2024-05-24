import AllClass from '../components/OldSections/allClass';
import Certificate from '../components/OldSections/certificate';
import Feature from '../components/OldSections/feature';
import Hero from '../components/OldSections/hero';
import Pricing from '../components/OldSections/pricing';
import Testimony from '../components/OldSections/testimony';

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
