import { useAuth } from 'authentication/contexts/AuthProvider';
import { Layout } from 'commons/components/Layout';
import LearnLayout from 'commons/learnLayout';
import CopilotContainer from 'copilot/containers/revamp/CopilotContainer';
import { useRouter } from 'next/router';

const Copilot = (): JSX.Element => {
    const { profile } = useAuth();
    const router = useRouter();
    const sessionId = router.query.sessionId?.[0];

    if (!profile) {
        return (
            <LearnLayout fullHeightSidebar>
                <div className="h-[calc(100vh-128px)]">
                    <CopilotContainer />
                </div>
            </LearnLayout>
        );
    }

    return (
        <Layout>
            <CopilotContainer sessionId={sessionId} />
        </Layout>
    );
};

export default Copilot;
