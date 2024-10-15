import React from 'react';
import Link from 'next/link';
import { ExerciseItem } from '../../../types/exercises';
import { cn } from 'commons/utils';
import { IoTime } from 'react-icons/io5';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

interface LatihanCardProps {
    exercise: ExerciseItem;
    className?: string;
    cardType: 'myExercises' | 'allExercises';
}

const LatihanCard: React.FC<LatihanCardProps> = ({
    exercise,
    className,
    cardType
}) => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed } = useCourseSubscription();

    const decideURLLink = (): string => {
        if (isAuthenticated) {
            if (exercise.is_free || is_subscribed) {
                return `/latihan/${exercise.slug}`;
            } else {
                return '/langganan';
            }
        } else {
            return '/masuk';
        }
    };

    const renderProgresBadge = (): JSX.Element => {
        if (exercise.status === 'IN_PROGRESS' && exercise.progress) {
            return (
                <p
                    className={cn(
                        'flex items-center text-xs mb-2',
                        'text-accent-yellow items-center pl-1 pr-2 py-0.5 font-medium rounded bg-accent-yellow/25 w-max',
                        cardType === 'myExercises' && 'mt-6'
                    )}>
                    <>
                        <IoTime size={12} className="mr-1" /> In Progress -{' '}
                        {(
                            (exercise?.progress / exercise.total_questions) *
                            100
                        ).toFixed(0)}
                        %
                    </>
                </p>
            );
        } else if (exercise.status === 'COMPLETED') {
            return (
                <p
                    className={cn(
                        'flex items-center text-xs mb-2',
                        'text-[#43B75D] items-center pl-1 pr-2 py-0.5 font-medium rounded bg-[#55FF7B]/25 w-max'
                    )}>
                    <>
                        <TbCircleCheckFilled size={12} className="mr-1" />
                        Completed
                    </>
                </p>
            );
        }

        return <></>;
    };

    return (
        <Link
            href={decideURLLink()}
            className={cn(
                'block h-full w-full',
                'bg-graphite-800 rounded-2xl p-5',
                'transition-all duration-200 hover:bg-opacity-80',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
                className
            )}>
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="bg-[#333540] rounded-full w-9 h-9 flex items-center justify-center">
                            <span className="text-xl">{exercise.icon}</span>
                        </div>
                        {cardType === 'allExercises' && renderProgresBadge()}
                    </div>
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {exercise.title}
                    </h3>
                </div>
                <div className="text-sm text-graphite-400 mt-2 flex items-center justify-between">
                    <span className="truncate max-w-[60%]">
                        {exercise.subject}
                    </span>
                    <span className="whitespace-nowrap">
                        {exercise.total_questions} Soal
                    </span>
                </div>
                {cardType === 'myExercises' && renderProgresBadge()}
            </div>
        </Link>
    );
};

export default LatihanCard;
