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
            title: 'Flashcard Online Tempat Belajar Kebut Semalam ',
            description: 'Belajar efisien dengan sistem flashcard Gradient',
            canonical: 'https://gradient.academy/flashcard'
        }
    };
};

export default FlashcardPage;
