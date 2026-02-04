import LatihanCard from 'exercises/components/Entrypoint/LatihanCard';
import { ExerciseItem } from 'exercises/types/exercises';

interface TryoutRecommendationProps {
    exercises: ExerciseItem[];
}

function TryoutRecommendation({
    exercises
}: TryoutRecommendationProps): JSX.Element {
    return (
        <div className="carousel flex items-stretch space-x-4">
            {exercises.map((exercise) => (
                <div
                    key={exercise.id}
                    className="carousel-item self-stretch w-full max-w-[328px]">
                    <LatihanCard exercise={exercise} cardType="allExercises" />
                </div>
            ))}
        </div>
    );
}

export { TryoutRecommendation };
