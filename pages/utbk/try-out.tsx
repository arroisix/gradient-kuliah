import { useAuth } from 'authentication/contexts/AuthProvider';
import LearnLayout from 'commons/learnLayout';
import Layout from 'commons/utbkLayout';
import withAnon from 'commons/withAnon';
import SetTargetDrawer from 'exercises/components/Entrypoint/SetTargetDrawer';
import { TryoutEntrypoint } from 'exercises/components/utbk/TryoutEntrypoint';
import { useEffect } from 'react';
import { useTracker } from 'tracker/tracker';

const TryOutPage = (): JSX.Element => {
    const tracker = useTracker();
    const { isLoadingProfile, isAuthenticated } = useAuth();

    useEffect(() => {
        tracker?.genericTrack('Visit Try Out Landing Page');
    }, [tracker]);

    if (isLoadingProfile === undefined || isLoadingProfile) {
        return (
            <LearnLayout showSidebar fullHeightSidebar>
                <></>
            </LearnLayout>
        );
    }

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="max-w-screen-lg mx-auto pt-32 px-4 md:px-0">
                    <TryoutEntrypoint />
                </div>
            </Layout>
        );
    }

    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <SetTargetDrawer>
                <TryoutEntrypoint />
            </SetTargetDrawer>
        </LearnLayout>
    );
};

TryOutPage.displayName = 'Try Out';
export default withAnon(TryOutPage);
