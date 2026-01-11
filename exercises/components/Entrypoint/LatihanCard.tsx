import React from 'react';
import Link from 'next/link';
import { ExerciseItem } from '../../types/exercises';
import { cn } from 'commons/utils';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useTracker } from 'tracker/tracker';
import Button from 'commons/components/elements/Button';
import { Clock } from 'lucide-react';
import Pencil from 'commons/components/elements/Icons/Pencil';
import List from 'commons/components/elements/Icons/List';
import UniversityIcon from 'commons/components/elements/Icons/University';
import { FaRegCalendar } from 'react-icons/fa6';
import { IoMdMegaphone } from 'react-icons/io';
import { GoClock } from 'react-icons/go';
import { FaLock, FaRegClock, FaStar } from 'react-icons/fa';

interface LatihanCardProps {
    exercise: ExerciseItem;
    className?: string;
    cardType: 'myExercises' | 'allExercises';
    onClick?: () => void;
}

type ExerciseState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

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

// Helper function to format date and time
const formatDateTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        const dateOptions: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta'
        };

        const formattedDate = date.toLocaleDateString('id-ID', dateOptions);
        const formattedTime = date.toLocaleTimeString('id-ID', timeOptions);

        return `${formattedDate}, ${formattedTime} WIB`;
    } catch (error) {
        return dateString; // Return original string if parsing fails
    }
};

const STATE_COLORS = {
    NOT_STARTED: {
        button: 'bg-[#5F2BCE]',
        buttonHover: 'hover:bg-[#4D22A0]',
        text: 'text-white'
    },
    IN_PROGRESS: {
        progressBar: 'bg-[#B6A6F3]',
        progressBg: 'bg-violet-1',
        text: 'text-[#B6A6F3]',
        barFill: 'bg-[#B6A6F3]'
    },
    COMPLETED: {
        progressBar: 'bg-[#43B75D]',
        progressBg: 'bg-[#55FF7B]/25',
        text: 'text-[#43B75D]',
        barFill: 'bg-gradient-to-r from-green-500 to-green-600',
        link: 'text-[#B6A6F3]'
    }
} as const;

const LatihanCard: React.FC<LatihanCardProps> = ({
    exercise,
    className,
    onClick
}) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const tracker = useTracker();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const urlLink = decideURLLink();

        // Prevent navigation jika URL kosong
        if (!urlLink) {
            e.preventDefault();
            e.stopPropagation();
        }

        tracker?.genericTrack('Click Latihan Card', {
            EXERCISE_SLUG: exercise.slug
        });
        if (onClick) onClick();
    };

    const decideURLLink = (): string => {
        if (
            exercise.tryout_type === 'UTBK' &&
            exercise.status !== 'COMPLETED' &&
            (new Date() < new Date(exercise.opens_at as string) ||
                new Date() > new Date(exercise.closes_at as string) ||
                exercise.is_time_expired)
        ) {
            return '';
        }

        return `/latihan/${exercise.slug}`;
    };

    const getExerciseColorResult = (): string => {
        if (exercise.score === undefined || exercise.score === null) {
            return 'transparent'; // Default color if score is not available
        }

        const weight = exercise.tryout_type === 'UTBK' ? 10 : 1;

        if (exercise?.score >= 75 * weight) {
            return '#43B75D'; // Green for passing score
        } else if (
            exercise?.score < 75 * weight &&
            exercise?.score >= 50 * weight
        ) {
            return '#FFC107'; // Yellow for failing score
        } else {
            return '#FF4C4C'; // Red for low score
        }
    };

    const getProgressData = () => {
        const currentProgress = exercise.progress || 0;
        const totalQuestions = exercise.total_questions;
        const percentage = exercise.progress_percentage ?? 0;

        return {
            current: currentProgress,
            total: totalQuestions,
            percentage: Math.min(Math.round(percentage), 100),
            fraction: `${currentProgress} / ${totalQuestions}`
        };
    };

    const renderBadges = (): JSX.Element | null => {
        return (
            <div className="h-full">
                {exercise.university_name && exercise.tryout_type !== 'UTBK' && (
                    <div className="flex items-center gap-1 flex-wrap">
                        <UniversityIcon
                            color={exercise.university_color}
                            size={14}
                        />
                        <span
                            className={cn('text-xs font-medium')}
                            style={
                                exercise.university_color
                                    ? {
                                          color: exercise.university_color
                                      }
                                    : undefined
                            }>
                            {exercise.university_name}
                        </span>
                    </div>
                )}
                <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {exercise.title}
                </h3>
            </div>
        );
    };

    const renderWorkingDate = (): JSX.Element | null => {
        if (exercise.tryout_type !== 'UTBK') return null;

        return (
            <div className="flex flex-row gap-1 items-center">
                {isHovered ? (
                    <>
                        <IoMdMegaphone size={14} color="#B6A6F3" />
                        <span className="text-xs text-[#B6A6F3]">
                            Hasil diumumkan :{' '}
                            <span className="font-bold">
                                {formatDateTime(
                                    exercise.score_published_at as string
                                )}
                            </span>
                        </span>
                    </>
                ) : (
                    <>
                        <FaRegCalendar size={14} className="fill-white" />
                        <span className="text-white text-xs">
                            {formatDateRange(
                                `${exercise.opens_at} ~ ${exercise.closes_at}`
                            )}
                        </span>
                    </>
                )}
            </div>
        );
    };

    const renderMetadata = (): JSX.Element => {
        return (
            <div className="flex items-center gap-3">
                {exercise.tryout_type && (
                    <span className="flex items-center gap-1 flex-col py-3 flex-1 rounded-lg bg-violet-3">
                        <Pencil />
                        <span className="text-xs text-graphite-400">
                            {exercise.tryout_type}
                        </span>
                    </span>
                )}
                <span className="flex items-center gap-1 flex-col py-3 flex-1 rounded-lg bg-violet-3">
                    <List />
                    <span className="text-xs text-graphite-400">
                        {exercise.total_questions} Soal
                    </span>
                </span>
                {(exercise?.duration as number) > 0 && (
                    <span className="flex items-center gap-1 flex-col py-3 flex-1 rounded-lg bg-violet-3">
                        <Clock size={14} color="#7D89CC" />
                        <span className="text-xs text-graphite-400">
                            {((exercise?.duration as number) / 60).toFixed(0)}{' '}
                            Menit
                        </span>
                    </span>
                )}
            </div>
        );
    };

    const renderProgressBar = (
        percentage: number,
        state: 'IN_PROGRESS' | 'COMPLETED'
    ): JSX.Element => {
        const colors = STATE_COLORS[state];

        return (
            <div className="space-y-2 w-full">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-graphite-400">Progress</span>
                    <span className={colors.text}>{percentage}%</span>
                </div>
                <div className={cn('h-2 rounded-full', colors.progressBg)}>
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-300',
                            colors.barFill
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    };

    const renderNotStarted = (): JSX.Element => {
        return (
            <div className="items-end mt-4 flex w-full h-full">
                <div
                    className={cn(
                        'space-y-2 mt-4 flex flex-row items-center gap-6 w-full',
                        isAuthenticated ? '' : 'justify-end'
                    )}>
                    {isAuthenticated && renderProgressBar(0, 'IN_PROGRESS')}
                    <Button
                        variant="primary"
                        size="small"
                        className={cn(
                            '!px-6 !py-2 !text-sm !font-semibold',
                            isAuthenticated ? '' : 'w-full'
                        )}>
                        Mulai
                    </Button>
                </div>
            </div>
        );
    };

    const renderInProgress = (): JSX.Element => {
        const progress = getProgressData();

        return (
            <div className="items-end mt-4 flex w-full h-full">
                <div className="space-y-2 mt-4 flex flex-row items-center gap-6 w-full">
                    {renderProgressBar(progress.percentage, 'IN_PROGRESS')}
                    <Button
                        variant="primary"
                        size="small"
                        className="!px-6 !py-2 !text-sm !font-semibold">
                        Lanjut
                    </Button>
                </div>
            </div>
        );
    };

    const renderCompleted = (): JSX.Element => {
        return (
            <div className="items-end mt-4 flex w-full h-full">
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                        <span className="text-xs text-graphite-400">Skor</span>
                        <span
                            className={cn('text-sm font-medium')}
                            style={{ color: getExerciseColorResult() }}>
                            {exercise.score?.toFixed(0) ?? 0}{' '}
                            {exercise.tryout_type !== 'UTBK' && (
                                <span className="text-graphite-400">/ 100</span>
                            )}
                        </span>
                    </div>
                    <span
                        className={cn(
                            'text-sm font-medium flex items-center gap-1',
                            STATE_COLORS.COMPLETED.link,
                            'hover:underline cursor-pointer'
                        )}>
                        Lihat Hasil →
                    </span>
                </div>
            </div>
        );
    };

    const renderScoreNotPublished = (): JSX.Element => {
        const progress = getProgressData();

        return (
            <div className="items-center mt-4 flex w-full flex-row gap-4">
                <div className="flex-1">
                    {renderProgressBar(progress.percentage, 'IN_PROGRESS')}
                </div>
                <span
                    className={cn(
                        'text-sm font-medium flex flex-row items-center gap-1 whitespace-nowrap text-[#B6A6F3]/50',
                        'hover:underline cursor-pointer'
                    )}>
                    <GoClock size={16} color="#B6A6F380" />
                    Nilai Dihitung
                </span>
            </div>
        );
    };

    const renderWorkingDateNotStarted = (): JSX.Element | null => {
        return (
            <div className="flex flex-col h-full justify-end">
                <div className="flex flex-row items-center gap-2 bg-[#2A225F] py-2 px-4 rounded-lg w-fit">
                    <FaLock size={12} color="#B6A6F3" />
                    <span className="text-[#B6A6F3] text-xs font-regular">
                        Belum Dibuka
                    </span>
                </div>
            </div>
        );
    };

    const renderWorkingDateHasEnded = (): JSX.Element | null => {
        return (
            <div className="flex flex-col h-full justify-end">
                <div className="flex flex-row items-center gap-2 bg-[#FF3B3026] py-2 px-4 rounded-lg w-fit">
                    <FaRegClock size={12} color="#E56052" />
                    <span className="text-[#E56052] text-xs font-regular">
                        Waktu Habis
                    </span>
                </div>
            </div>
        );
    };

    const renderActionSection = (): JSX.Element | null => {
        const state = exercise.status as ExerciseState;

        if (exercise.tryout_type === 'UTBK') {
            if (exercise.status === 'PENDING_SCORING') {
                return renderScoreNotPublished();
            }

            if (
                exercise.status !== 'COMPLETED' &&
                new Date() < new Date(exercise.opens_at as string)
            ) {
                return renderWorkingDateNotStarted();
            }

            if (
                (exercise.status !== 'COMPLETED' &&
                    new Date() > new Date(exercise.closes_at as string)) ||
                exercise.is_time_expired
            ) {
                return renderWorkingDateHasEnded();
            }
        }

        switch (state) {
            case 'IN_PROGRESS':
                return renderInProgress();
            case 'COMPLETED':
                return renderCompleted();
            default:
                return renderNotStarted();
        }
    };

    return (
        <Link
            href={decideURLLink()}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                'flex flex-col gap-1 h-full w-full relative overflow-hidden justify-between',
                'bg-violet-2 rounded-2xl p-5',
                'transition-all duration-200 hover:bg-opacity-80',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
                exercise.tryout_type === 'UTBK' &&
                    exercise.status !== 'COMPLETED' &&
                    (new Date() < new Date(exercise.opens_at as string) ||
                        new Date() > new Date(exercise.closes_at as string) ||
                        exercise.is_time_expired)
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer',
                className
            )}>
            {/* Blurry gradient effect at bottom */}
            {exercise.status === 'COMPLETED' && (
                <div
                    className="absolute left-0 right-0 -bottom-28 h-1"
                    style={{
                        background: `radial-gradient(ellipse 150% 100% at bottom, ${getExerciseColorResult()} 0%, transparent 70%)`,
                        height: '250px',
                        filter: 'blur(60px)',
                        opacity: 0.7
                    }}
                />
            )}

            {exercise.tryout_type === 'UTBK' ? (
                <>
                    {exercise.is_free ? (
                        <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg border-l border-b border-[#333540]">
                            <span className="text-sm font-bold text-white">
                                Gratis
                            </span>
                        </div>
                    ) : (
                        <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg border-l border-b border-[#333540] flex flex-row items-center gap-1 bg-gradient-to-r from-[#F2C04C] via-[#E48E0D] to-[#E4B50D]">
                            <FaStar size={14} color="#FFFFFF" />
                            <span className="text-sm font-bold text-white">
                                Member
                            </span>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {exercise.exercise_code && (
                        <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-medium border-l border-b border-[#333540]">
                            <span className="text-sm">
                                Paket {exercise.exercise_code}
                            </span>
                        </div>
                    )}
                </>
            )}

            {exercise.tryout_type === 'UTBK' ? (
                <div className="flex flex-col h-full relative gap-4">
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-1">
                            {renderBadges()}
                            {renderWorkingDate()}
                        </div>
                        <div className="mt-3">{renderMetadata()}</div>
                    </div>
                    {renderActionSection()}
                </div>
            ) : (
                <div className="flex flex-col h-full relative">
                    <div className="flex flex-col gap-1">
                        {renderBadges()}
                        {renderWorkingDate()}
                    </div>
                    <div className="mt-3">{renderMetadata()}</div>
                    {renderActionSection()}
                </div>
            )}
        </Link>
    );
};

export default LatihanCard;
