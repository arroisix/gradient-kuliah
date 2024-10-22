import React from 'react';
import Link from 'next/link';
import { cn } from 'commons/utils';
import { Exercise } from '../../types/exercises';
import { GraduationCap, List, Clock } from 'lucide-react';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';
import { IoTime } from 'react-icons/io5';

interface LatihanStartProps {
    exercise: Exercise;
}

const LatihanStart: React.FC<LatihanStartProps> = ({ exercise }) => {
    const firstSectionId = exercise.problem_sets[0]?.id;
    const tracker = useTracker();
    const router = useRouter();
    const params = router.query;

    const handleStartClick = (): void => {
        tracker?.genericTrack('Click Start Latihan Button', {
            EXERCISE_SLUG: exercise.slug as string
        });
    };

    const formatDuration = (duration: number): string => {
        if (duration < 60) {
            return `${duration} Detik`;
        } else {
            const minutes = Math.floor(duration / 60);
            return `${minutes} Menit`;
        }
    };

    const decideStartButton = (): string => {
        if (
            exercise.latest_progress &&
            exercise.latest_progress.answered_questions > 0 &&
            exercise.latest_progress.next_section_id !== null &&
            exercise.latest_progress.next_problem_id !== null &&
            exercise.latest_progress.status !== 'COMPLETED'
        ) {
            return `/latihan/${exercise.slug}/${exercise.latest_progress.next_section_id}/${exercise.latest_progress.next_problem_id}`;
        }

        return `/latihan/${exercise.slug}/${firstSectionId}`;
    };

    if (
        exercise.latest_progress !== null &&
        exercise.latest_progress.status === 'COMPLETED' &&
        !params.reattempt
    ) {
        router.replace(
            `/latihan/${exercise.slug}/report/${exercise.latest_progress.id}`
        );
        return <></>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow">
                <div
                    className={cn(
                        'bg-[#333540] rounded-full flex items-center justify-center mb-4',
                        'w-12 h-12 md:w-16 md:h-16'
                    )}>
                    <span className="text-4xl">{exercise.icon}</span>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                    {exercise.title}
                </h2>
                <div className="flex items-center text-base text-graphite-400 mb-2">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    <p>{exercise.course.name}</p>
                </div>
                <div className="flex items-center text-base text-graphite-400 mb-2">
                    <List className="w-5 h-5 mr-2" />
                    <p>{exercise.total_problems} Soal</p>
                </div>
                {!!exercise.total_duration && (
                    <div className="flex items-center text-base text-graphite-400">
                        <Clock className="w-5 h-5 mr-2" />
                        <p>{formatDuration(exercise.total_duration)}</p>
                    </div>
                )}
            </div>
            <div className="mt-auto flex flex-col w-full gap-6">
                {exercise.latest_progress !== null &&
                    exercise.latest_progress.answered_questions > 0 &&
                    exercise.latest_progress.status !== 'COMPLETED' && (
                        <div
                            className={cn(
                                'flex flex-col h-full',
                                'bg-graphite-800 rounded-2xl p-5',
                                'transition-all duration-200 hover:bg-opacity-80',
                                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                            )}>
                            <p
                                className={cn(
                                    'flex items-center text-xs mb-3',
                                    'text-accent-yellow items-center pl-1 pr-2 py-0.5 font-medium rounded bg-accent-yellow/25 w-max'
                                )}>
                                <>
                                    <IoTime size={12} className="mr-1" /> In
                                    Progress -{' '}
                                    {(
                                        (exercise?.latest_progress
                                            .answered_questions /
                                            exercise?.latest_progress
                                                .total_questions) *
                                        100
                                    ).toFixed(0)}
                                    %
                                </>
                            </p>
                            <h3 className="text-xs text-graphite-400 line-clamp-2">
                                {exercise.latest_progress.next_section_title}
                            </h3>
                            <h4 className="text-sm text-white font-semibold line-clamp-2">
                                {exercise.latest_progress.next_problem_title}
                            </h4>
                        </div>
                    )}
                <Link
                    replace
                    href={decideStartButton()}
                    onClick={handleStartClick}
                    className={cn(
                        'w-full bg-[#7F56D9] text-white py-3 rounded-full font-semibold',
                        'hover:bg-[#6941C6] transition-colors',
                        'flex items-center justify-center'
                    )}>
                    {exercise.latest_progress !== null &&
                    exercise.latest_progress.answered_questions > 0 &&
                    exercise.latest_progress.status !== 'COMPLETED'
                        ? 'Lanjutkan Latihan'
                        : 'Mulai Latihan'}
                </Link>
            </div>
        </div>
    );
};

export default LatihanStart;
