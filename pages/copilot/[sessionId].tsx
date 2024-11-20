import LearnLayout from 'commons/learnLayout';
import CopilotContainer from 'copilot/containers/CopilotContainer';
import { GetServerSideProps } from 'next';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

const CopilotSession = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <LearnLayout noPadding hideNavbar={isMobileBreakpoints} noTopPadding>
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
