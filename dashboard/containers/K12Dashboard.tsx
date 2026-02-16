import Link from 'next/link';
import { useTracker } from 'tracker/tracker';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import { CDN_URL } from 'commons/constants';
import { XIcon } from 'lucide-react';
import { BiSolidUpArrow } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { useGetStudentTargetInstitutionsQuery } from 'dashboard/redux/api/dashboardApi';
import { useGetStudentTryoutLatestResultQuery } from 'exercises/redux/api/exercisesApi';
import Image from 'next/image';
import { useAuth } from 'authentication/contexts/AuthProvider';

type Feature = {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconDesktop?: string;
    url: string;
};

const features: Feature[] = [
    {
        id: 'materi',
        title: 'Materi',
        description: 'Belajar materi UTBK secara bertahap.',
        url: '/utbk/materi',
        icon: 'utbk/dashboard/materi_logo.svg'
    },
    {
        id: 'live-class',
        title: 'Live Class',
        description: 'Ikuti kelas langsung untuk uji kesiapan UTBK.',
        url: '/utbk/live-class',
        icon: 'utbk/dashboard/live_class.svg'
    },
    {
        id: 'prediksi-ptn',
        title: 'Prediksi PTN',
        description: 'Perkirakan peluang masuk PTN.',
        url: '/utbk/prediksi-ptn',
        icon: 'utbk/dashboard/prediksi_ptn_logo.svg'
    },
    {
        id: 'copilot',
        title: 'Copilot AI',
        description: 'Teman bantu saat belajar.',
        url: '/copilot',
        icon: 'utbk/dashboard/copilot_logo.svg'
    },
    {
        id: 'kuis',
        title: 'Try Out',
        description: 'Uji kesiapan dengan simulasi UTBK.',
        url: '/utbk/try-out',
        icon: 'utbk/dashboard/tryout_logo.svg'
    }
];

const K12Dashboard = (): JSX.Element => {
    const { profile } = useAuth();
    const [isTooltipClosed, setIsTooltipClosed] = useState(true);
    const [tooltipText, setTooltipText] = useState('');

    const { is_subscribed: isSubscribed } = useCourseSubscription();
    const tracker = useTracker();

    const { data: targetInstitutions } = useGetStudentTargetInstitutionsQuery();
    const { data: tryoutLatestResult } = useGetStudentTryoutLatestResultQuery();

    useEffect(() => {
        // show tooltip if target institutions are empty
        if (
            Array.isArray(targetInstitutions) &&
            targetInstitutions.length === 0
        ) {
            setIsTooltipClosed(false);
            setTooltipText('Bingung mulai darimana?');
        } else if (tryoutLatestResult?.is_has_latest_result) {
            setTooltipText('Habis TO? Liat kelebihan dan kekuranganmu disini!');
        }
    }, [targetInstitutions, tryoutLatestResult]);

    return (
        <section
            className={cn(
                'm-4 space-y-12 h-full',
                'lg:m-0 lg:grid lg:place-items-center'
            )}>
            <div
                className={cn(
                    'flex flex-col justify-center items-center gap-6',
                    'lg:scale-125'
                )}>
                <h1 className="text-center font-bold text-white text-2xl leading-[125%]">
                    Mau Belajar apa Hari ini?
                </h1>

                <div
                    className={cn(
                        'w-full max-w-lg mx-auto grid gap-4',
                        'lg:w-fit lg:grid-cols-2'
                    )}>
                    {features.map((feature) => (
                        <div key={feature.id} className="relative">
                            <Link
                                href={feature.url}
                                onClick={() =>
                                    tracker?.genericTrack(
                                        `Click ${feature.title} Dashboard Card`
                                    )
                                }
                                className={cn(
                                    'bg-[#222222] hover:opacity-75 transition-all rounded-2xl flex justify-between items-center gap-4 w-full h-[65px]',
                                    'lg:max-w-[210px] lg:h-[74px]'
                                )}>
                                <div className="space-y-1 pl-3">
                                    <h3 className="font-semibold text-white leading-[125%] text-xs">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[#999999] text-[10px]">
                                        {feature.description}
                                    </p>
                                </div>

                                <div
                                    className={cn(
                                        'shrink-0 relative w-16 h-16',
                                        'lg:h-[69px]'
                                    )}>
                                    <Image
                                        src={`${CDN_URL}/assets/${feature.icon}`}
                                        layout="fill"
                                        className="object-cover object-center"
                                    />
                                </div>
                            </Link>

                            {profile &&
                            feature.url === '/copilot' &&
                            !isTooltipClosed ? (
                                <div className="bg-[#5F2BCE] absolute -bottom-[calc(32px+16px)] z-10 left-0 right-0 py-2 px-3 rounded-lg flex justify-between items-center gap-2">
                                    <span className="text-white text-xs">
                                        {tooltipText}
                                    </span>{' '}
                                    <button
                                        onClick={() => setIsTooltipClosed(true)}
                                        type="button">
                                        <XIcon className="shrink-0 text-[#B6A6F3] size-4" />
                                    </button>
                                    <BiSolidUpArrow className="text-[#5F2BCE] size-4 absolute -top-3 z-20 right-2" />
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {isSubscribed === false && <RenewSubscriptionBanner type="K12" />}

            {isSubscribed === false && (
                <RenewSubscriptionBanner type="K12_MOBILE" />
            )}
        </section>
    );
};

export default K12Dashboard;
