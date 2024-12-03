import LearnLayout from 'commons/learnLayout';
import CopilotContainer from 'copilot/containers/CopilotContainer';
import { GetServerSideProps } from 'next';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useRouter } from 'next/router';

const CopilotSession = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();
    const { sessionId } = router.query;

    return (
        <LearnLayout
            noPadding
            hideNavbar={isAuthenticated && isMobileBreakpoints}
            noTopPadding>
            <CopilotContainer sessionId={sessionId as string} />
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
