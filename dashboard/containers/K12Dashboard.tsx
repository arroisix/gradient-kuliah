import Link from 'next/link';
import { useTracker } from 'tracker/tracker';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import { CDN_URL } from 'commons/constants';
import { useMediaQuery } from 'usehooks-ts';
import { XIcon } from 'lucide-react';
import { BiSolidUpArrow } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { useGetStudentTargetInstitutionsQuery } from 'dashboard/redux/api/dashboardApi';

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
        icon: 'utbk/dashboard/materi.svg',
        iconDesktop: 'utbk/dashboard/materi-desktop.svg'
    },
    {
        id: 'kuis',
        title: 'Try Out',
        description: 'Uji kesiapan dengan simulasi UTBK.',
        url: '/utbk/try-out',
        icon: 'utbk/dashboard/try out.svg'
    },
    {
        id: 'copilot',
        title: 'Copilot AI',
        description: 'Teman bantu saat belajar.',
        url: '/copilot',
        icon: 'utbk/dashboard/copilot.svg'
    },
    {
        id: 'prediksi-ptn',
        title: 'Prediksi PTN',
        description: 'Perkirakan peluang masuk PTN.',
        url: '/utbk/prediksi-ptn',
        icon: 'utbk/dashboard/prediksi-ptn.svg'
    }
];

const K12Dashboard = (): JSX.Element => {
    const [isTooltipClosed, setIsTooltipClosed] = useState(true);
    const [tooltipText, setTooltipText] = useState('');

    const { is_subscribed: isSubscribed } = useCourseSubscription();
    const tracker = useTracker();

    const mediumMediaQuery = useMediaQuery('(min-width: 768px)');
    const cardBaseClasses =
        'relative group rounded-lg md:rounded-2xl transition-colors bg-[#222222] hover:bg-neutral-800 p-3 min-h-[65px]';

    const { data: targetInstitutions } = useGetStudentTargetInstitutionsQuery();

    useEffect(() => {
        // show tooltip if target institutions are empty
        if (
            Array.isArray(targetInstitutions) &&
            targetInstitutions.length === 0
        ) {
            setIsTooltipClosed(false);
            setTooltipText('Bingung mulai darimana?');
        }
    }, [targetInstitutions]);

    return (
        <section className="flex flex-col w-full gap-12 pb-12 mx-auto sm:overflow-x-clip overflow-x-visible max-w-[520px] lg:max-w-screen-md xl:max-w-[896px] md:h-[calc(100vh-128px)] justify-center">
            <div className="flex flex-col gap-10 md:gap-6 lg:scale-125">
                <h1 className="text-center font-bold text-white text-2xl leading-[125%]">
                    Mau Belajar apa Hari ini?
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center max-w-[436px] self-center w-full">
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
                                    cardBaseClasses,
                                    'flex flex-col justify-center gap-3 text-left pl-3 overflow-visible'
                                )}
                                style={{
                                    backgroundImage: mediumMediaQuery
                                        ? `url('${CDN_URL}/assets/${
                                              feature.iconDesktop ??
                                              feature.icon
                                          }')`
                                        : `url('${CDN_URL}/assets/${feature.icon}')`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center right'
                                }}>
                                <div className="flex flex-col items-start w-full gap-1">
                                    <h3 className="font-semibold text-white text-sm md:text-xs leading-[125%]">
                                        {feature.title}
                                    </h3>
                                    {/* Show description only on xl+ */}
                                    <p className="block text-xs md:text-[10px] md:leading-[150%] leading-[160%] text-neutral-400 w-[60%] whitespace-nowrap md:whitespace-normal">
                                        {feature.description}
                                    </p>
                                </div>
                            </Link>

                            {feature.url === '/copilot' && !isTooltipClosed ? (
                                <div className="bg-[#5F2BCE] absolute -bottom-[calc(32px+16px)] left-0 right-0 py-2 px-3 rounded-lg flex justify-between items-center gap-2">
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
