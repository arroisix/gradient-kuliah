import LearnLayout from 'commons/learnLayout';
import { GetStaticProps } from 'next';
import CopilotContainer from '../../copilot/containers/CopilotContainer';

const Copilot = (): JSX.Element => {
    return (
        <LearnLayout noPadding>
            <CopilotContainer />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            canonical: 'https://gradient.academy/copilot',
            title: 'Gradient Copilot AI - Your Smart Study Assistant',
            description:
                'Learn with AI-powered assistance that helps you understand concepts better through interactive discussions and guided problem-solving.'
        }
    };
};

export default Copilot;
