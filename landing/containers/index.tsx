import AllClass from './allClass';
import Certificate from './certificate';
import Feature from './feature';
import Hero from './hero';
import Pricing from './pricing';
import Testimony from './testimony';

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
            <Pricing pricingData={pricingData} />
        </div>
    );
}
