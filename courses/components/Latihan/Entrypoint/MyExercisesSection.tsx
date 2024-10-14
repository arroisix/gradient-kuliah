import React from 'react';
import { ExerciseItem } from '../../../types/exercises';
import LatihanCard from './LatihanCard';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

interface MyExercisesSectionProps {
    myExercises: ExerciseItem[];
}

const MyExercisesSection: React.FC<MyExercisesSectionProps> = ({
    myExercises
}) => {
    const { is_subscribed: isSubscribed } = useCourseSubscription();
    const { isMobileBreakpoints } = useWindowBreakpoints();

    if (!myExercises || myExercises.length === 0) return null;

    return (
        <div className="relative pt-6 pb-4 mb-6 sm:pb-6 space-y-4 z-[1] overflow-x-visible">
            <div className="absolute h-full -z-[1] -inset-x-full bg-neutral-900 top-0"></div>

            <b className="text-white">Latihanku</b>

            <div
                className={cn(
                    'w-screen relative gap-4 carousel carousel-center right-4 md:right-8 lg:right-12',
                    isSubscribed
                        ? 'md:w-[calc(100vw-250px)] min-[1786px]:-inset-x-[calc((100vw-250px-1536px)/2)]'
                        : 'md:w-screen min-[1786px]:-inset-x-[calc((100vw-1536px)/2)]'
                )}>
                {myExercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        className={cn(
                            'carousel-item first:ml-4 last:mr-4 md:first:ml-8 md:last:mr-8 lg:first:ml-12 lg:last:mr-12',
                            isSubscribed
                                ? 'min-[1786px]:first:ml-[calc((100vw-250px-1536px)/2)] min-[1786px]:last:mr-[calc((100vw-250px-1536px)/2)]'
                                : 'min-[1786px]:first:ml-[calc((100vw-1536px)/2)] min-[1786px]:last:mr-[calc((100vw-1536px)/2)]'
                        )}>
                        <LatihanCard
                            exercise={exercise}
                            cardType="myExercises"
                            className={
                                isMobileBreakpoints
                                    ? 'w-[175px] h-[210px]'
                                    : 'w-[300px] h-[190px]'
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyExercisesSection;
