import React from 'react';
import { ExerciseItem } from '../../../types/exercises';
import LatihanCard from './LatihanCard';
import { cn } from 'commons/utils';

interface MyExercisesSectionProps {
    myExercises: ExerciseItem[];
}

const MyExercisesSection: React.FC<MyExercisesSectionProps> = ({
    myExercises
}) => {
    if (!myExercises || myExercises.length === 0) return null;

    return (
        <div className="relative pt-6 pb-4 mb-6 sm:pb-6 space-y-4 z-[1] overflow-x-visible">
            <div className="absolute h-full -z-[1] -inset-x-full bg-neutral-900 top-0"></div>

            <b className="text-white">Latihanku</b>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myExercises.map((exercise) => (
                    <div key={exercise.id} className={cn('carousel-item')}>
                        <LatihanCard exercise={exercise} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyExercisesSection;
