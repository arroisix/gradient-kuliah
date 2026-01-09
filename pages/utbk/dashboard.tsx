import { useAuth } from 'authentication/contexts/AuthProvider';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import LearnLayout from 'commons/learnLayout';
import Layout from 'commons/utbkLayout';
import withAnon from 'commons/withAnon';
import K12Dashboard from 'dashboard/containers/K12Dashboard';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import config from 'redux/api/config';

const Dashboard = ({ courses }: { courses: Course[] }): JSX.Element => {
    const router = useRouter();

    // return <LoadingBackdrop />;

    const { isLoadingProfile, isAuthenticated } = useAuth();

    // it's necessary to prevent glitch
    // proper loading state will be addressed later
    if (isLoadingProfile === undefined || isLoadingProfile) {
        return <></>;
    }

    if (!isAuthenticated) {
        router.replace('/utbk');
        return (
            <Layout courses={courses}>
                <LoadingBackdrop />
            </Layout>
        );
    }

    return (
        <LearnLayout showSidebar fullHeightSidebar className="relative">
            <K12Dashboard />
        </LearnLayout>
    );
};

export default withAnon(Dashboard);

export const getStaticProps: GetStaticProps = async () => {
    const META_TITLE = 'Materi UTBK dan Tryout Gratis UTBK 2026';
    const META_DESCRIPTION =
        'Persiapkan dirimu menghadapi UTBK 2026 dengan tryout UTBK gratis dari Gradient. Dapatkan pengalaman ujian sesungguhnya dan analisis hasil untuk meningkatkan performa belajarmu.';

    try {
        const { data: coursesResponse } = await axios.get<
            ListResponseData<Course>
        >(`${config.API_BASE_URL}courses/v2/public?type=UTBK`);

        return {
            props: {
                courses: coursesResponse.data,
                title: META_TITLE,
                description: META_DESCRIPTION,
                canonical: `https://gradient.academy/utbk/dashboard`,
                openGraph: {
                    type: 'website',
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    url: `https://gradient.academy/utbk/dashboard`,
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
