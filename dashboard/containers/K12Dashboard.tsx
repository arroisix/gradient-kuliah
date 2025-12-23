import KelasIcon from '../assets/KelasIcon';
import CopilotAIIconFull from 'dashboard/assets/CopilotAIIconFull';
import DashboardQuizIcon from '../components/DashboardQuizIcon';
import Link from 'next/link';
import { useTracker } from 'tracker/tracker';
import { cn } from 'commons/utils';
import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';

type Feature = {
    id: string;
    title: string;
    description: string;
    Icon: React.FC<{ width?: number; height?: number; isSmall?: boolean }>;
    url: string;
};

// The dashboard component for K12 users
const K12Dashboard = () => {
    const router = useRouter();
    const { is_subscribed: isSubscribed } = useCourseSubscription();
    const tracker = useTracker();
    const cardBaseClasses =
        'relative group rounded-xl transition-colors bg-[#1D1D1D] hover:bg-neutral-800 h-[80px] md:h-[100px] xl:h-[84px]';

    const features: Feature[] = [
        {
            id: 'materi',
            title: 'Materi',
            description: 'Belajar materi UTBK secara bertahap',
            Icon: () => <KelasIcon width={64} height={69} />,
            url: '/materi'
        },
        {
            id: 'kuis',
            title: 'Try Out',
            description: 'Uji kesiapan dengan simulasi UTBK',
            Icon: () => <DashboardQuizIcon />,
            url: '/latihan'
        },
        {
            id: 'copilot',
            title: 'Copilot AI',
            description: 'Teman bantu saat belajar',
            Icon: ({ isSmall }: { isSmall?: boolean }) =>
                isSmall ? (
                    <CopilotAIIconFull width={24} height={24} />
                ) : (
                    <CopilotAIIconFull width={64} height={69} />
                ),
            url: '/copilot'
        }
    ];

    const onClickSubscribeBanner = () => {
        router.push('/langganan');
    };

    return (
        <section className="flex flex-col w-full gap-12 pb-4 mx-auto sm:overflow-x-clip overflow-x-visible max-w-screen-2xl mt-4 md:mt-8">
            <div className="flex flex-col gap-6">
                <h1 className="text-center font-bold md:font-semibold text-white text-2xl md:text-xl">
                    Mau Belajar apa Hari ini?
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center justify-center">
                    {features.map((feature) => (
                        <Link
                            key={feature.id}
                            href={feature.url}
                            onClick={() =>
                                tracker?.genericTrack(
                                    `Click ${feature.title} Dashboard Card`
                                )
                            }
                            className={cn(
                                cardBaseClasses,
                                'flex flex-col items-center text-center gap-2 flex-row items-center justify-between gap-3 text-left pl-3 overflow-hidden'
                            )}>
                            <div className="relative w-14 h-14 rounded-full bg-[#1D1D1D] flex items-center justify-center w-auto h-auto rounded-none bg-transparent order-2">
                                <div className="flex items-center justify-center w-full h-full">
                                    <div className="absolute right-[-4px] md:right-[-12px]">
                                        <feature.Icon />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start w-full gap-1 mr-[56px] md:mr-[48px]">
                                <h3 className="font-bold text-white text-xs text-sm">
                                    {feature.title}
                                </h3>
                                {/* Show description only on xl+ */}
                                <p className="block text-[11px] text-xs text-neutral-400 leading-snug">
                                    {feature.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {isSubscribed === false && (
                <div className="md:hidden px-6 py-4 flex flex-col gap-6 bg-[#5F2BCE] rounded-2xl relative overflow-hidden">
                    <div className="flex flex-col gap-2 z-10">
                        <h2 className="text-white font-semibold">
                            Langganan untuk mendapat akses penuh ke materi
                        </h2>
                        <span className="text-sm text-white">
                            Nikmati ribuan video pembelajaran, bank soal, dan
                            fitur eksklusif lainnya tanpa batas.
                        </span>
                    </div>

                    <Button
                        variant="custom"
                        size="normal"
                        className="bg-white text-[#5F2BCE] font-semibold px-12 w-fit text-sm z-10"
                        onClick={onClickSubscribeBanner}>
                        Langganan
                    </Button>

                    <div className="absolute aspect-square w-[180px] z-0 right-0 top-0">
                        <Image
                            src={`${CDN_URL}/assets/k12-subscribe-illustration-mobile.png`}
                            alt="Subscribe"
                            layout="fill"
                            objectPosition="center"
                            objectFit="fill"
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default K12Dashboard;
