import moment from 'moment';
import React, { useEffect, useState, useRef, useCallback } from 'react';
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
    onTimeExpired?: () => void;
    isCurrentProblemSubmitted?: boolean;
}

const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
    timeConstraint,
    timeLimit = 0,
    currentProblemId,
    problemProgress,
    firstProblemProgress,
    onTimeExpired,
    isCurrentProblemSubmitted = false
}) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const endTimeRef = useRef<number | null>(null);
    const hasExpiredRef = useRef(false);
    const onTimeExpiredRef = useRef(onTimeExpired);

    useEffect(() => {
        onTimeExpiredRef.current = onTimeExpired;
    }, [onTimeExpired]);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const updateTimer = useCallback(() => {
        if (endTimeRef.current === null) return;

        const now = moment().utc(true).valueOf();
        const endTimeUTC = moment(endTimeRef.current).utc(false).valueOf();
        const remaining = Math.max(0, endTimeUTC - now);
        setTimeLeft(Math.floor(remaining / 1000));

        if (remaining <= 0 && !hasExpiredRef.current) {
            clearTimer();
            hasExpiredRef.current = true;
            if (onTimeExpiredRef.current) {
                onTimeExpiredRef.current();
            }
        }
    }, [clearTimer]);

    useEffect(() => {
        if (timeConstraint === 'NONE' || !timeLimit) return;

        let startTime: moment.Moment;
        if (timeConstraint === 'TOTAL_TIME' && firstProblemProgress) {
            startTime = moment(firstProblemProgress.started_at).utc(true);
        } else if (timeConstraint === 'PER_PROBLEM' && problemProgress) {
            startTime = moment(problemProgress.started_at).utc(true);
        } else {
            return;
        }

        endTimeRef.current = startTime.add(timeLimit, 'seconds').valueOf();
        hasExpiredRef.current = false;

        updateTimer();

        if (!isCurrentProblemSubmitted || timeConstraint === 'TOTAL_TIME') {
            clearTimer();
            timerRef.current = setInterval(updateTimer, 1000);
        }

        return clearTimer;
    }, [
        timeConstraint,
        timeLimit,
        currentProblemId,
        problemProgress,
        firstProblemProgress,
        isCurrentProblemSubmitted,
        clearTimer,
        updateTimer
    ]);

    useEffect(() => {
        if (timeConstraint === 'PER_PROBLEM' && isCurrentProblemSubmitted) {
            clearTimer();
        }
    }, [timeConstraint, isCurrentProblemSubmitted, clearTimer]);

    if (timeConstraint === 'NONE') return null;

    const formatTime = (seconds: number): string => {
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
        <div className="w-full max-w-[520px] mb-4 flex flex-col items-center">
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
