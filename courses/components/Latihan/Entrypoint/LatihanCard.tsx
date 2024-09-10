import React from 'react';
import Link from 'next/link';
import { ExerciseItem } from '../../../types/exercises';
import {
    useGetExerciseProgressQuery,
    useCreateExerciseProgressMutation,
    useGetLatestExerciseProblemProgressQuery
} from '../../../redux/api/exercisesApi';

interface LatihanCardProps {
    exercise: ExerciseItem;
}

const LatihanCard: React.FC<LatihanCardProps> = ({ exercise }) => {
    const { data: exerciseProgress, refetch: refetchProgress } =
        useGetExerciseProgressQuery({ exercise_slug: exercise.slug });
    const [createExerciseProgress] = useCreateExerciseProgressMutation();

    const { data: problemProgress, refetch: refetchProblemProgress } =
        useGetLatestExerciseProblemProgressQuery(
            {
                problem_progress_id: exerciseProgress?.last_problem_id ?? ''
            },
            {
                skip:
                    !exerciseProgress?.id || !exerciseProgress?.last_problem_id
            }
        );

    const truncateTitle = (title: string, maxLength: number) => {
        return title.length > maxLength
            ? title.substring(0, maxLength) + '...'
            : title;
    };

    const handleExerciseStart = async () => {
        if (!exerciseProgress || exerciseProgress.status === 'COMPLETED') {
            try {
                await createExerciseProgress({
                    exercise_slug: exercise.slug
                }).unwrap();
                await refetchProgress();
            } catch (error) {
                console.error('Failed to create new exercise progress:', error);
            }
        } else if (exerciseProgress.last_problem_id) {
            await refetchProblemProgress();
        }
    };

    const getLinkHref = () => {
        if (exerciseProgress?.status !== 'COMPLETED' && problemProgress) {
            return `/latihan/${exercise.slug}/problems/${problemProgress.problem_id}`;
        }
        return `/latihan/${exercise.slug}`;
    };

    return (
        <Link
            href={getLinkHref()}
            className="block"
            onClick={handleExerciseStart}>
            <div className="bg-graphite-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <div className="w-full flex flex-col gap-3">
                    <div className="bg-[#333540] rounded-full w-9 h-9 flex items-center justify-center">
                        <span className="text-xl">{exercise.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                        {truncateTitle(exercise.title, 72)}
                    </h3>
                </div>
                <p className="text-sm text-gray-400 mt-2 w-fit h-[18px] flex items-center gap-3">
                    {exercise.subject} | {exercise.total_questions} Soal
                </p>
            </div>
        </Link>
    );
};

export default LatihanCard;
