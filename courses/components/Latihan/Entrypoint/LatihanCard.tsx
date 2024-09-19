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

    const { refetch: refetchProblemProgress } =
        useGetLatestExerciseProblemProgressQuery(
            {
                problem_progress_id: exerciseProgress?.last_problem_id ?? ''
            },
            {
                skip:
                    !exerciseProgress?.id || !exerciseProgress?.last_problem_id
            }
        );

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
        return `/latihan/${exercise.slug}`;
    };

    return (
        <Link
            href={getLinkHref()}
            className="block h-full w-full"
            onClick={handleExerciseStart}>
            <div className="bg-graphite-800 rounded-2xl p-5 flex flex-col justify-between h-full w-full transition-all duration-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <div className="flex flex-col gap-3">
                    <div className="bg-[#333540] rounded-full w-9 h-9 flex items-center justify-center">
                        <span className="text-xl">{exercise.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {exercise.title}
                    </h3>
                </div>
                <div className="text-sm text-gray-400 mt-2 flex items-center justify-between">
                    <span className="truncate max-w-[60%]">
                        {exercise.subject}
                    </span>
                    <span className="whitespace-nowrap">
                        {exercise.total_questions} Soal
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default LatihanCard;
