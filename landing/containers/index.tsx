import ContentHighlight from './contentHightlight';
import Hero from './hero';
import JoinDiscord from './joinDiscord';
import ValueProposition from './valueProposition';

export default function LandingContainer(): JSX.Element {
    return (
        <div>
            <Hero />
            <ContentHighlight />
            <ValueProposition />
            <JoinDiscord />
        </div>
    );
}
