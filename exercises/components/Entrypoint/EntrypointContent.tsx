import React from 'react';
import LatihanCard from './LatihanCard';
import Paginator from 'commons/components/elements/Paginator';
import Skeleton from 'commons/components/elements/Skeleton';
import { ExerciseItem } from '../../types/exercises';

interface LatihanContentProps {
    isLoading: boolean;
    exercises: ExerciseItem[];
    myExercises: ExerciseItem[];
    totalItems: number;
    currentPage: number;
    limit: number;
}

const LatihanContent: React.FC<LatihanContentProps> = ({
    isLoading,
    exercises,
    totalItems,
    currentPage,
    limit
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                <Skeleton repeat={6} className="w-full h-[158px] !mb-0" />
            </div>
        );
    }

    const totalPages = Math.ceil(totalItems / limit);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {exercises.map((exercise) => (
                    <LatihanCard
                        key={exercise.id}
                        exercise={exercise}
                        cardType="allExercises"
                    />
                ))}
            </div>
            <Paginator
                totalPages={totalPages}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                className="justify-center w-full py-8"
            />
        </div>
    );
};

export default LatihanContent;
