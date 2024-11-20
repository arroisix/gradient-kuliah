import LearnLayout from 'commons/learnLayout';
import CopilotContainer from 'copilot/containers/CopilotContainer';
import { GetServerSideProps } from 'next';

const CopilotSession = (): JSX.Element => {
    return (
        <LearnLayout noPadding>
            <CopilotContainer />
        </LearnLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { sessionId } = params || {};

    if (!sessionId) {
        return {
            redirect: {
                destination: '/copilot',
                permanent: false
            }
        };
    }

    return {
        props: {
            canonical: `https://gradient.academy/copilot/${sessionId}`,
            title: 'Gradient Copilot AI - Chat Session',
            description: 'Interactive AI tutoring session'
        }
    };
};

export default CopilotSession;
