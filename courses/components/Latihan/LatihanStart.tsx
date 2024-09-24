import React from 'react';
import Link from 'next/link';

type Exercise = {
    slug: string;
    title: string;
    course: {
        name: string;
    };
    icon: string;
    total_problems: number;
    total_duration: number;
    problem_sets: Array<{
        id: string;
        name: string;
        order: number;
        show_solution: string;
        time_constraint: string;
        time_limit: number;
        problem_count: number;
    }>;
};

interface ExerciseStartProps {
    exercise: Exercise;
}

const LatihanStart: React.FC<ExerciseStartProps> = ({ exercise }) => {
    const firstSectionId = exercise.problem_sets[0]?.id;

    const formatDuration = (duration: number) => {
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
                <div className="bg-[#333540] rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-4">
                    <span className="text-4xl">{exercise.icon}</span>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                    {exercise.title}
                </h2>
                <p className="text-base text-gray-400 mb-2">
                    {exercise.course.name}
                </p>
                <p className="text-base text-gray-400 mb-2">
                    {exercise.total_problems} Soal
                </p>
                {exercise.total_duration > 0 && (
                    <p className="text-base text-gray-400">
                        {formatDuration(exercise.total_duration)}
                    </p>
                )}
            </div>
            <div className="mt-auto">
                <Link href={`/latihan/${exercise.slug}/${firstSectionId}`}>
                    <button className="w-full bg-[#7F56D9] text-white py-3 rounded-full font-semibold hover:bg-[#6941C6] transition-colors">
                        Mulai Latihan
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default LatihanStart;
