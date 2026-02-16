import { useAuth } from 'authentication/contexts/AuthProvider';
import axios from 'axios';
import { Layout } from 'commons/components/Layout';
import NonAuthLayout from 'commons/utbkLayout';
import withAnon from 'commons/withAnon';
import SetTargetDrawer from 'exercises/components/Entrypoint/SetTargetDrawer';
import { TryoutEntrypoint } from 'exercises/components/utbk/TryoutEntrypoint';
import type { GetStaticProps } from 'next';
import { useEffect } from 'react';
import config from 'redux/api/config';
import { useTracker } from 'tracker/tracker';

const TryOutPage = ({ courses }: { courses: Course[] }): JSX.Element => {
    const tracker = useTracker();
    const { profile } = useAuth();

    useEffect(() => {
        tracker?.genericTrack('Visit Try Out Landing Page');
    }, [tracker]);

    if (!profile) {
        return (
            <NonAuthLayout courses={courses}>
                <div className="max-w-screen-lg mx-auto pt-32 px-4 lg:px-0">
                    <TryoutEntrypoint />
                </div>
            </NonAuthLayout>
        );
    }

    return (
        <Layout>
            <SetTargetDrawer>
                <TryoutEntrypoint />
            </SetTargetDrawer>
        </Layout>
    );
};

TryOutPage.displayName = 'Try Out';
export default withAnon(TryOutPage);

export const getStaticProps: GetStaticProps = async () => {
    const META_TITLE = 'Tryout UTBK 2026';
    const META_DESCRIPTION =
        'Ikuti tryout UTBK 2026 gratis dari Gradient dan asah kemampuanmu untuk menghadapi ujian sesungguhnya. Dapatkan analisis hasil tryout untuk meningkatkan performa belajarmu.';

    try {
        const { data: coursesResponse } = await axios.get<
            ListResponseData<Course>
        >(`${config.API_BASE_URL}courses/v2/public?type=UTBK`);

        return {
            props: {
                courses: coursesResponse.data,
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
    } catch (error) {
        console.error('getStaticProps error for', error);

        // Transient error (network, 5xx, timeouts) -> return a safe fallback props
        // and a short revalidate so ISR retries soon
        return {
            props: {
                courses: [],
                // you can pass an error flag/message to the page
                __errorMessage: 'Could not load data, please try again later'
            } as any,
            revalidate: 30 // retry in 30s
        };
    }
};
