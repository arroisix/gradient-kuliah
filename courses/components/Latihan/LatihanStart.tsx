import React from 'react';
import Link from 'next/link';
import { cn } from 'commons/utils';
import { Exercise } from '../../types/exercises';
import { GraduationCap, List, Clock } from 'lucide-react';

interface LatihanStartProps {
    exercise: Exercise;
}

const LatihanStart: React.FC<LatihanStartProps> = ({ exercise }) => {
    const firstSectionId = exercise.problem_sets[0]?.id;

    const formatDuration = (duration: number): string => {
        if (duration < 60) {
            return `${duration} Detik`;
        } else {
            const minutes = Math.floor(duration / 60);
            return `${minutes} Menit`;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow">
                <div
                    className={cn(
                        'bg-[#333540] rounded-full flex items-center justify-center mb-4',
                        'w-12 h-12 md:w-16 md:h-16'
                    )}>
                    <span className="text-4xl">{exercise.icon}</span>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                    {exercise.title}
                </h2>
                <div className="flex items-center text-base text-graphite-400 mb-2">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    <p>{exercise.course.name}</p>
                </div>
                <div className="flex items-center text-base text-graphite-400 mb-2">
                    <List className="w-5 h-5 mr-2" />
                    <p>{exercise.total_problems} Soal</p>
                </div>
                {!!exercise.total_duration && (
                    <div className="flex items-center text-base text-graphite-400">
                        <Clock className="w-5 h-5 mr-2" />
                        <p>{formatDuration(exercise.total_duration)}</p>
                    </div>
                )}
            </div>
            <div className="mt-auto">
                <Link
                    replace
                    href={`/latihan/${exercise.slug}/${firstSectionId}`}
                    className={cn(
                        'w-full bg-[#7F56D9] text-white py-3 rounded-full font-semibold',
                        'hover:bg-[#6941C6] transition-colors',
                        'flex items-center justify-center'
                    )}>
                    Mulai Latihan
                </Link>
            </div>
        </div>
    );
};

export default LatihanStart;
