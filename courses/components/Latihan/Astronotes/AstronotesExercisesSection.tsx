import React from 'react';
import Skeleton from 'commons/components/elements/Skeleton';
import LatihanCard from '../Entrypoint/LatihanCard';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';

interface AstronotesExercise {
    id: string;
    title: string;
    subject: string;
    icon: string;
    total_questions: number;
    progress?: number;
    status?: string;
    is_free: boolean;
    slug: string;
}

interface AstronotesExercisesSectionProps {
    exercises: AstronotesExercise[];
    isLoading: boolean;
}

const AstronotesExercisesSection: React.FC<AstronotesExercisesSectionProps> = ({
    exercises,
    isLoading
}) => {
    const tracker = useTracker();
    const router = useRouter();
    const { slug: astronotesSlug } = router.query;

    const handleExerciseClick = (exercise: AstronotesExercise) => {
        tracker?.genericTrack('Click Exercise from Astronotes', {
            EXERCISE_SLUG: exercise.slug,
            ASTRONOTES_SLUG: astronotesSlug as string,
            PAGE: router.asPath
        });
    };

    if (!isLoading && exercises.length === 0) return null;

    return (
        <div className="flex flex-col w-full gap-6 py-5 bg-graphite-900 rounded-box">
            <h2 className="font-bold px-4 lg:px-5">
                Tes pemahamanmu dengan latihan ini!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-5">
                {isLoading ? (
                    <>
                        <Skeleton className="w-full rounded-lg h-28 animate-pulse" />
                        <Skeleton className="w-full rounded-lg h-28 animate-pulse" />
                        <Skeleton className="w-full rounded-lg h-28 animate-pulse" />
                    </>
                ) : (
                    exercises.map((exercise) => (
                        <LatihanCard
                            key={exercise.id}
                            exercise={exercise}
                            cardType="allExercises"
                            onClick={() => handleExerciseClick(exercise)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AstronotesExercisesSection;
