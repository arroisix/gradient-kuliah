import React from 'react';
import Link from 'next/link';
import { ExerciseItem } from '../../types/exercises';
import { cn } from 'commons/utils';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';
import Button from 'commons/components/elements/Button';
import { Clock } from 'lucide-react';
import Pencil from 'commons/components/elements/Icons/Pencil';
import List from 'commons/components/elements/Icons/List';
import UniversityIcon from 'commons/components/elements/Icons/University';

interface LatihanCardProps {
    exercise: ExerciseItem;
    className?: string;
    cardType: 'myExercises' | 'allExercises';
    onClick?: () => void;
}

type ExerciseState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

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
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed } = useCourseSubscription();
    const tracker = useTracker();

    const handleClick = () => {
        tracker?.genericTrack('Click Latihan Card', {
            EXERCISE_SLUG: exercise.slug
        });
        if (onClick) onClick();
    };

    const decideURLLink = (): string => {
        if (isAuthenticated) {
            if (exercise.is_free || is_subscribed) {
                return `/latihan/${exercise.slug}`;
            } else {
                return '/langganan';
            }
        } else {
            return `/masuk?redirect=${router.asPath}`;
        }
    };

    const getExerciseColorResult = (): string => {
        if (exercise.score === undefined || exercise.score === null) {
            return '#FFFFFF'; // Default color if score is not available
        }
        if (exercise?.score >= 75) {
            return '#43B75D'; // Green for passing score
        } else if (exercise?.score < 75 && exercise?.score >= 50) {
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
            percentage: Math.round(percentage),
            fraction: `${currentProgress} / ${totalQuestions}`
        };
    };

    const renderBadges = (): JSX.Element | null => {
        return (
            <div className="h-full">
                {exercise.university_name && (
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

    const renderMetadata = (): JSX.Element => {
        return (
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 flex-col py-3 flex-1 rounded-lg bg-violet-3">
                    <Pencil />
                    <span className="text-xs text-graphite-400">UAS</span>
                </span>
                <span className="flex items-center gap-1 flex-col py-3 flex-1 rounded-lg bg-violet-3">
                    <List />
                    <span className="text-xs text-graphite-400">
                        {exercise.total_questions} Soal
                    </span>
                </span>
                <span className="flex items-center gap-1 flex-col py-3 flex-1 rounded-lg bg-violet-3">
                    <Clock size={14} color="#7D89CC" />
                    <span className="text-xs text-graphite-400">
                        {exercise.duration} Menit
                    </span>
                </span>
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
                <div className="flex items-center justify-between text-xs">
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
                <div className="space-y-2 mt-4 flex flex-row items-center gap-6 w-full">
                    {renderProgressBar(0, 'IN_PROGRESS')}
                    <Button
                        variant="primary"
                        size="small"
                        className="!px-6 !py-2 !text-sm !font-semibold">
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
                            <span className="text-graphite-400">/ 100</span>
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

    const renderActionSection = (): JSX.Element | null => {
        const state = exercise.status as ExerciseState;

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
            className={cn(
                'flex flex-col gap-1 h-full w-full relative overflow-hidden justify-between',
                'bg-violet-2 rounded-2xl p-5',
                'transition-all duration-200 hover:bg-opacity-80',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
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

            {exercise.exercise_code && (
                <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-medium border-l border-b border-[#333540]">
                    <span className="text-sm">
                        Paket {exercise.exercise_code}
                    </span>
                </div>
            )}

            <div className="flex flex-col h-full relative">
                {renderBadges()}
                <div className="mt-3">{renderMetadata()}</div>
                {renderActionSection()}
            </div>
        </Link>
    );
};

export default LatihanCard;
