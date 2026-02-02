import { useAuth } from 'authentication/contexts/AuthProvider';
import axios from 'axios';
import LearnLayout from 'commons/learnLayout';
import Layout from 'commons/utbkLayout';
import { LiveClassContainer } from 'live-class/containers/LiveClassContainer';
import type { GetStaticProps } from 'next';
import config from 'redux/api/config';

const LiveClassPage = ({ courses }: { courses: Course[] }): JSX.Element => {
    const { isLoadingProfile, isAuthenticated } = useAuth();

    // it's necessary to prevent glitch
    // proper loading state will be addressed later
    if (isLoadingProfile === undefined || isLoadingProfile) {
        return <></>;
    }

    if (!isAuthenticated) {
        return (
            <Layout courses={courses}>
                <div className="w-full max-w-5xl mx-auto px-6 pt-[92px]">
                    <div className="grid place-items-center min-h-[calc(100vh-92px)]">
                        <LiveClassContainer />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <LearnLayout showSidebar fullHeightSidebar className="relative">
            <div className="w-full max-w-5xl mx-auto mt-[calc(48px+32px)]">
                <div className="grid place-items-center h-[calc(100vh-48px-32px-64px)]">
                    <LiveClassContainer />
                </div>
            </div>
        </LearnLayout>
    );
};

LiveClassPage.displayName = 'LiveClass';
export default LiveClassPage;

export const getStaticProps: GetStaticProps = async () => {
    const META_TITLE = '';
    const META_DESCRIPTION = '';

    try {
        const { data: coursesResponse } = await axios.get<
            ListResponseData<Course>
        >(`${config.API_BASE_URL}courses/v2/public?type=UTBK`);

        return {
            props: {
                courses: coursesResponse.data,
                title: META_TITLE,
                description: META_DESCRIPTION,
                canonical: `https://gradient.academy/utbk/materi`,
                openGraph: {
                    type: 'website',
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    url: `https://gradient.academy/utbk`,
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
