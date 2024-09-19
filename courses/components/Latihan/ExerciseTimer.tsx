import React, { useEffect, useState } from 'react';
import { IoTimeOutline } from 'react-icons/io5';

interface ExerciseTimerProps {
    timeConstraint?: string;
    timeLimit?: number;
    currentProblemId?: string;
}

const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
    timeConstraint,
    timeLimit = 0,
    currentProblemId
}) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    useEffect(() => {
        if (timeConstraint === 'NONE') return;

        if (timeConstraint === 'PER_PROBLEM') {
            setTimeLeft(timeLimit);
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeConstraint, timeLimit, currentProblemId]);

    if (timeConstraint === 'NONE') return null;

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const progressPercentage = (timeLeft / timeLimit) * 100;

    return (
        <div className="w-[520px] mb-4 flex flex-col items-center">
            <div className="w-full h-2 bg-[#666666] rounded-full mb-2">
                <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
            <div className="flex flex-row items-center justify-center text-xl font-semibold">
                <IoTimeOutline className="text-white mr-2" />
                <span className="text-white">{formatTime(timeLeft)}</span>
            </div>
        </div>
    );
};

export default ExerciseTimer;
