import { useAuth } from 'authentication/contexts/AuthProvider';
import axios from 'axios';
import { Layout } from 'commons/components/Layout';
import NonAuthLayout from 'commons/utbkLayout';
import { cn } from 'commons/utils';
import { LiveClassEntrypointContainer } from 'liveClasses/containers/LiveClassEntrpoint';
import type { GetStaticProps } from 'next';
import config from 'redux/api/config';

const LiveClassPage = ({ courses }: { courses: Course[] }): JSX.Element => {
    const { profile } = useAuth();

    if (!profile) {
        return (
            <NonAuthLayout courses={courses}>
                <div className="w-full max-w-5xl mx-auto px-6 pt-[92px]">
                    <div className="min-h-[calc(100vh-92px)] flex flex-col pt-6">
                        <LiveClassEntrypointContainer />
                    </div>
                </div>
            </NonAuthLayout>
        );
    }

    return (
        <Layout>
            <div className={cn('m-4', 'lg:mx-12 lg:my-8')}>
                <LiveClassEntrypointContainer />
            </div>
        </Layout>
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
