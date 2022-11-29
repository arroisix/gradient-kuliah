import ContentHighlight from './contentHightlight';
import Hero from './hero';
import JoinDiscord from './joinDiscord';
import JoinGradient from './joinGradient';
import KnowDegree from './knowDegree';
import Testimony from './testimony';
import UniqueContent from './uniqueContent';

export default function LandingContainer(): JSX.Element {
    return (
        <div>
            <Hero />
            <ContentHighlight />
            <UniqueContent />
            <KnowDegree />
            <JoinDiscord />
            <Testimony />
            <JoinGradient />
        </div>
    );
}
