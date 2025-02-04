import { GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import LearningToolsEntrypoint from 'learningTools/containers/LearningToolsEntrypoint';

const LearningToolsPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <LearningToolsEntrypoint />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            title: 'Alat Belajar - Gradient Academy',
            description: 'Learning tools to help you study better',
            canonical: 'https://gradient.academy/alat-belajar'
        }
    };
};

export default LearningToolsPage;
