import React, { useEffect, useState } from 'react';
import { IoTimeOutline } from 'react-icons/io5';

interface ExerciseTimerProps {
    timeConstraint?: string;
    timeLimit?: number;
    currentProblemId?: string;
    problemProgress?: {
        started_at: string;
    };
    firstProblemProgress?: {
        started_at: string;
    };
    onTimeExpired: () => void;
}

const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
    timeConstraint,
    timeLimit = 0,
    currentProblemId,
    problemProgress,
    firstProblemProgress,
    onTimeExpired
}) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    useEffect(() => {
        if (timeConstraint === 'NONE' || !timeLimit) return;

        let startTime: number;
        if (timeConstraint === 'TOTAL_TIME' && firstProblemProgress) {
            startTime =
                new Date(firstProblemProgress.started_at).getTime() -
                7 * 60 * 60 * 1000;
        } else if (timeConstraint === 'PER_PROBLEM' && problemProgress) {
            startTime =
                new Date(problemProgress.started_at).getTime() -
                7 * 60 * 60 * 1000;
        } else {
            return;
        }

        const endTime = startTime + timeLimit * 1000;

        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.max(0, endTime - now);
            setTimeLeft(Math.floor(remaining / 1000));

            if (remaining <= 0) {
                onTimeExpired();
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [
        timeConstraint,
        timeLimit,
        currentProblemId,
        problemProgress,
        firstProblemProgress,
        onTimeExpired
    ]);

    if (timeConstraint === 'NONE') return null;

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const progressPercentage = Math.max(
        0,
        Math.min(100, (timeLeft / timeLimit) * 100)
    );

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
