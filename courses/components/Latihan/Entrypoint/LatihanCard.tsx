import React from 'react';
import Link from 'next/link';
import { ExerciseItem } from '../../../types/exercises';
import { cn } from 'commons/utils';

interface LatihanCardProps {
    exercise: ExerciseItem;
}

const LatihanCard: React.FC<LatihanCardProps> = ({ exercise }) => {
    return (
        <Link
            href={`/latihan/${exercise.slug}`}
            className={cn(
                'block h-full w-full',
                'bg-graphite-800 rounded-2xl p-5',
                'transition-all duration-200 hover:bg-opacity-80',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
            )}>
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-3">
                    <div className="bg-[#333540] rounded-full w-9 h-9 flex items-center justify-center">
                        <span className="text-xl">{exercise.icon}</span>
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
            </div>
        </Link>
    );
};

export default LatihanCard;
