import { GetStaticProps } from 'next';
import FlashcardEntrypoint from '../../flashcard/containers/FlashcardEntrypoint';
import LearnLayout from 'commons/learnLayout';

const FlashcardPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <FlashcardEntrypoint />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            title: 'Flashcard - Learn with Gradient',
            description: 'Study efficiently with our flashcard system',
            canonical: 'https://gradient.academy/flashcard'
        }
    };
};

export default FlashcardPage;
