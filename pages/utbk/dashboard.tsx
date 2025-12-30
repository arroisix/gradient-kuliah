import { useAuth } from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import LearnLayout from 'commons/learnLayout';
import Layout from 'commons/utbkLayout';
import withAnon from 'commons/withAnon';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import K12Dashboard from 'dashboard/containers/K12Dashboard';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Dashboard = (): JSX.Element => {
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription();

    const onClickSubscribeBanner = () => {
        router.push('/langganan');
    };

    const { isLoadingProfile, isAuthenticated } = useAuth();

    // it's necessary to prevent glitch
    // proper loading state will be addressed later
    if (isLoadingProfile === undefined || isLoadingProfile) {
        return <></>;
    }

    if (!isAuthenticated) {
        router.replace('/utbk');
        return (
            <Layout>
                <div className="w-screen h-screen"></div>
            </Layout>
        );
    }

    return (
        <LearnLayout showSidebar fullHeightSidebar className="relative">
            <>
                <K12Dashboard />

                {is_subscribed === false && (
                    <div className="hidden md:block fixed bottom-0 left-1/2 -translate-x-1/2 w-[60%] lg:w-fit z-40 md:translate-x-[calc(-50%+125px)]">
                        <div className="relative rounded-t-2xl p-6 flex flex-row items-center gap-6 bg-[#5F2BCE] overflow-hidden">
                            <div className="flex flex-col gap-2 z-10">
                                <h2 className="text-white font-semibold">
                                    Langganan untuk mendapat akses penuh ke
                                    materi
                                </h2>

                                <span className="text-sm text-white">
                                    Nikmati ribuan video pembelajaran, bank
                                    soal, dan fitur eksklusif lainnya tanpa
                                    batas.
                                </span>
                            </div>

                            <Button
                                variant="custom"
                                size="normal"
                                className="bg-white text-[#5F2BCE] font-semibold px-12 z-10"
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
