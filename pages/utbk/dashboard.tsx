import { useAuth } from 'authentication/contexts/AuthProvider';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import LearnLayout from 'commons/learnLayout';
import Layout from 'commons/utbkLayout';
import withAnon from 'commons/withAnon';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import K12Dashboard from 'dashboard/containers/K12Dashboard';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import config from 'redux/api/config';

const Dashboard = ({ courses }: { courses: Course[] }): JSX.Element => {
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription();

    const onClickSubscribeBanner = () => {
        router.push('/langganan');
    };

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
            <>
                <K12Dashboard />

                {is_subscribed === false && (
                    <div className="mx-auto max-w-[520px] md:max-w-[717px] md:fixed md:bottom-0 md:left-1/2 md:w-[60%] z-40 md:translate-x-[calc(-50%+125px)]">
                        <div className="relative rounded-2xl md:rounded-none md:rounded-t-2xl px-6 py-4 md:p-6 flex flex-col md:flex-row md:items-center gap-6 bg-[#5F2BCE] overflow-hidden">
                            <div className="flex flex-col gap-2 z-10">
                                <h2 className="text-white font-semibold text-base leading-[140%]">
                                    Langganan untuk mendapat akses penuh ke
                                    materi
                                </h2>

                                <span className="text-white text-sm leading-[160%]">
                                    Nikmati ribuan video pembelajaran, bank
                                    soal, dan fitur eksklusif lainnya tanpa
                                    batas.
                                </span>
                            </div>

                            <Button
                                variant="custom"
                                size="normal"
                                className="self-start md:self-center bg-white text-[#5F2BCE] font-semibold px-12 z-10 text-sm md:text-base leading-[125%] md:leading-[140%] md:h-[46px] md:basis-[31.5%]"
                                onClick={onClickSubscribeBanner}>
                                Langganan
                            </Button>

                            <div className="absolute aspect-square w-[320px] lg:w-[260px] z-0 right-0 bottom-[-88px] lg:bottom-[-70px]">
                                <Image
                                    src={`${CDN_URL}/assets/k12-subscribe-illustration.png`}
                                    alt="Subscribe"
                                    layout="fill"
                                    objectPosition="center"
                                    objectFit="contain"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </>
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
