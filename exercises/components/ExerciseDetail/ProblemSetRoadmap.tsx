import {
    useGetExerciseDetailV2Query,
    useGetProblemsetDetailInterstitialQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import { Check, Clock } from 'lucide-react';
import { cn } from 'commons/utils';
import Skeleton from 'commons/components/elements/Skeleton';
import ProblemSetInformation from './ProblemSetInformation';
import { FaRegCalendar } from 'react-icons/fa6';
import List from 'commons/components/elements/Icons/List';
import { useWindowSize } from 'usehooks-ts';
import { GoClock } from 'react-icons/go';

// Helper function to format date range
const formatDateRange = (dateString: string): string => {
    try {
        const [openDate, closeDate] = dateString
            .split(' ~ ')
            .map((date) => date.trim());

        const formatDate = (dateStr: string): string => {
            const date = new Date(dateStr);
            const options: Intl.DateTimeFormatOptions = {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            };
            return date.toLocaleDateString('id-ID', options);
        };

        const formattedOpen = formatDate(openDate);
        const formattedClose = formatDate(closeDate);

        return `${formattedOpen} ~ ${formattedClose}`;
    } catch (error) {
        return dateString; // Return original string if parsing fails
    }
};

const ProblemSetRoadmap = () => {
    const router = useRouter();
    const { slug, sectionId, exerciseProgressId } = router.query;
    const { width } = useWindowSize();

    const { data: problemsets, isLoading } =
        useGetProblemsetDetailInterstitialQuery(
            { slug: slug as string, problemset_id: sectionId as string },
            {
                skip: !slug || !sectionId
            }
        );

    const { data: exercise } = useGetExerciseDetailV2Query(
        {
            exercise_slug: slug as string,
            exercise_progress_id: exerciseProgressId as string
        },
        {
            skip: !slug
        }
    );

    if (isLoading) {
        return (
            <div className="w-full lg:w-1/2 bg-neutral-800 rounded-lg p-6">
                <Skeleton className="h-6 w-32 !mb-4" />
                <div className="flex flex-col gap-4">
                    <Skeleton repeat={4} className="h-16 !mb-2" />
                </div>
            </div>
        );
    }

    if (!problemsets?.data || problemsets.data.length === 0) {
        return null;
    }

    const currentIndex = problemsets.data.findIndex((item) => item.is_current);

    const renderCircleIcon = (
        isCompleted: boolean,
        isCurrent: boolean,
        isLocked: boolean
    ): JSX.Element | null => {
        if (exercise?.tryout_type === 'UTBK') {
            return (
                <div
                    className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10',
                        (isCompleted || isCurrent) &&
                            'bg-transparent border-2 border-[#5F2BCE]',
                        isLocked && 'bg-transparent border-2 border-white'
                    )}>
                    {(isCompleted || isCurrent) && (
                        <div
                            className={cn(
                                'w-2 h-2 rounded-full',
                                isCompleted ? 'bg-[#5F2BCE]' : 'bg-white'
                            )}
                        />
                    )}
                </div>
            );
        }
        return (
            <div
                className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10',
                    isCompleted && 'bg-[#B6A6F3] border-2 border-[#B6A6F3]',
                    isCurrent && 'bg-transparent border-2 border-white',
                    isLocked && 'bg-transparent border-2 border-gray-600'
                )}>
                {isCompleted ? (
                    <Check className="w-3 h-3 text-white" />
                ) : (
                    <div
                        className={cn(
                            'w-3 h-3 rounded-full',
                            isCurrent && 'bg-white',
                            isLocked && 'bg-transparent'
                        )}
                    />
                )}
            </div>
        );
    };

    const renderSectionContent = (
        isCompleted: boolean,
        isCurrent: boolean,
        sectionTitle: string,
        sectionOrder: number
    ): JSX.Element | null => {
        if (exercise?.tryout_type === 'UTBK') {
            return (
                <div className="flex-1 lg:mb-6">
                    <div className="flex flex-col gap-2">
                        <div>
                            <p
                                className={cn(
                                    'text-sm mb-1',
                                    isCompleted || isCurrent
                                        ? 'text-gray-400'
                                        : 'text-gray-600'
                                )}>
                                Section {sectionOrder + 1}
                            </p>
                            <h3
                                className={cn(
                                    'text-base font-semibold',
                                    isCompleted
                                        ? 'text-[#B6A6F3]'
                                        : isCurrent
                                        ? 'text-white'
                                        : 'text-gray-600'
                                )}>
                                {sectionTitle}
                            </h3>
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <div className="py-1 px-3 rounded-lg border-2 border-[#333540] flex flex-row gap-2 items-center">
                                <GoClock size={14} color="#999999" />
                                <span className="text-white font-regular text-xs">
                                    30m
                                </span>
                            </div>

                            <div className="py-1 px-3 rounded-lg border-2 border-[#333540] flex flex-row gap-2 items-center">
                                <List size={14} color="#999999" />
                                <span className="text-white font-regular text-xs">
                                    20 Soal
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Info Card - only show for current section */}
                    {isCurrent && width < 1024 && (
                        <div className="lg:hidden mt-4 mb-2">
                            <ProblemSetInformation />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="flex-1">
                <p
                    className={cn(
                        'text-sm mb-1',
                        isCompleted || isCurrent
                            ? 'text-gray-400'
                            : 'text-gray-600'
                    )}>
                    Section {sectionOrder + 1}
                </p>
                <h3
                    className={cn(
                        'text-base font-semibold',
                        isCompleted
                            ? 'text-[#B6A6F3]'
                            : isCurrent
                            ? 'text-white'
                            : 'text-gray-600'
                    )}>
                    {sectionTitle}
                </h3>

                {/* Mobile Info Card - only show for current section */}
                {isCurrent && width < 1024 && (
                    <div className="lg:hidden mt-4 mb-2">
                        <ProblemSetInformation />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full lg:w-1/2 rounded-lg lg:p-6 py-4 overflow-auto flex flex-col gap-8">
            {exercise?.tryout_type === 'UTBK' && (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row gap-3">
                        <div className="flex flex-row items-center gap-2 px-3 py-1 rounded-lg bg-[#282B3C]">
                            <FaRegCalendar size={14} color="#ffffff" />
                            <span className="text-xs text-white font-bold">
                                {formatDateRange(
                                    `${exercise.opens_at} ~ ${exercise.closes_at}`
                                )}
                            </span>
                        </div>

                        {!!exercise.exercise_code && (
                            <div className="py-1 px-3 rounded-lg border-2 border-[#333540]">
                                <span className="text-white text-xs font-bold">
                                    Paket {exercise.exercise_code}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-stretch gap-3 w-full">
                        <span className="flex items-center justify-center flex-col py-3 flex-1 rounded-lg bg-violet-3 gap-1">
                            <List
                                color="#B6A6F3"
                                size={width < 768 ? 14 : 20}
                            />
                            <span className="text-xs md:text-sm text-white text-center font-semibold">
                                {exercise?.total_problems} Soal
                            </span>
                        </span>
                        {(exercise?.total_duration as number) > 0 && (
                            <span className="flex items-center justify-center flex-col py-3 flex-1 rounded-lg bg-violet-3 gap-1">
                                <Clock
                                    size={width < 768 ? 14 : 20}
                                    color="#B6A6F3"
                                />
                                <span className="text-xs md:text-sm text-white text-center font-semibold">
                                    {(
                                        (exercise?.total_duration as number) /
                                        60
                                    ).toFixed(0)}{' '}
                                    Menit
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            )}
            <div>
                <h2 className="text-white text-lg font-semibold mb-6 hidden lg:block">
                    {exercise?.tryout_type === 'UTBK' ? 'Daftar' : 'Quiz'}{' '}
                    Section
                </h2>
                <div className={cn('flex flex-col')}>
                    {problemsets.data.map((section, index) => {
                        const isCompleted = index < currentIndex;
                        const isCurrent = section.is_current;
                        const isLocked = index > currentIndex;

                        return (
                            <div
                                key={section.id}
                                className="flex items-start gap-3">
                                {/* Vertical Line and Circle */}
                                <div className="flex flex-col items-center">
                                    {/* Circle Icon */}
                                    {renderCircleIcon(
                                        isCompleted,
                                        isCurrent,
                                        isLocked
                                    )}

                                    {/* Vertical Line */}
                                    {index < problemsets.data.length && (
                                        <div
                                            className={cn(
                                                isCurrent
                                                    ? 'w-0.5 lg:h-[88px] md:h-[250px] h-[280px]'
                                                    : 'w-0.5 h-[88px]',
                                                isCompleted
                                                    ? 'bg-[#B6A6F3]'
                                                    : 'bg-gray-600 border-dashed border-l-2 border-gray-600'
                                            )}
                                            style={{
                                                borderStyle: !(
                                                    isCompleted || isCurrent
                                                )
                                                    ? 'dashed'
                                                    : 'solid'
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Section Content */}
                                {renderSectionContent(
                                    isCompleted,
                                    isCurrent,
                                    section.title,
                                    section.order
                                )}
                            </div>
                        );
                    })}
                    <div key={'done'} className="flex items-start gap-3">
                        {/* Vertical Line and Circle */}
                        <div className="flex flex-col items-center">
                            {/* Circle Icon */}
                            <div
                                className={cn(
                                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10',
                                    'bg-transparent border-2 border-white'
                                )}>
                                <Check className="w-5 h-5 text-black" />
                            </div>
                        </div>

                        {/* Section Content */}
                        <div className="flex-1 pb-8">
                            <h3
                                className={cn(
                                    'text-base font-semibold',
                                    'text-gray-600'
                                )}>
                                Selesai
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemSetRoadmap;
