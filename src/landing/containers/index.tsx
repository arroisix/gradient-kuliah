import ContentHighlight from './contentHightlight';
import Hero from './hero';
import JoinGradient from './joinGradient';
import ValueProposition from './valueProposition';

export default function LandingContainer(): JSX.Element {
    return (
        <div>
            <Hero />
            <ContentHighlight />
            <ValueProposition />
            <JoinGradient />
        </div>
    );
}
