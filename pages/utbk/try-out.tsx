import { useAuth } from 'authentication/contexts/AuthProvider';
import LearnLayout from 'commons/learnLayout';
import Layout from 'commons/utbkLayout';
import withAnon from 'commons/withAnon';
import SetTargetDrawer from 'exercises/components/Entrypoint/SetTargetDrawer';
import { TryoutEntrypoint } from 'exercises/components/utbk/TryoutEntrypoint';
import type { GetStaticProps } from 'next';
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

export const getStaticProps: GetStaticProps = () => {
    const META_TITLE = 'Tryout UTBK 2026';
    const META_DESCRIPTION =
        'Ikuti tryout UTBK 2026 gratis dari Gradient dan asah kemampuanmu untuk menghadapi ujian sesungguhnya. Dapatkan analisis hasil tryout untuk meningkatkan performa belajarmu.';

    return {
        props: {
            title: META_TITLE,
            description: META_DESCRIPTION,
            canonical: `https://gradient.academy/utbk/try-out`,
            openGraph: {
                type: 'website',
                title: META_TITLE,
                description: META_DESCRIPTION,
                url: `https://gradient.academy/utbk/try-out`,
                images: [
                    {
                        url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                        width: 48,
                        height: 48,
                        alt: 'Gradient UTBK'
                    }
                ]
            }
        },
        revalidate: 60
    };
};
