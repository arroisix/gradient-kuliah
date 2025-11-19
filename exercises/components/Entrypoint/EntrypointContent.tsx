import React from 'react';
import Image from 'next/image';
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

    // Empty state
    if (exercises.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Image
                    src="https://assets.gradient.academy/assets/exercise-not-found.png"
                    alt="No exercises found"
                    width={200}
                    height={200}
                    className="mb-6"
                />
                <div className="flex flex-col gap-2 justify-center items-center">
                    <h3 className="text-white text-xl font-bold mb-2 text-center">
                        Masih belum ada soal yang tersedia
                        <br />
                        di tipe ini
                    </h3>
                    <p className="text-gray-400 text-sm text-center">
                        Soal yang tersedia akan muncul disini.
                    </p>
                </div>
            </div>
        );
    }

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
