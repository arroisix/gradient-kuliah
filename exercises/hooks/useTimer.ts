import { ProblemInProblemSet } from 'exercises/types/exercises';
import { useEffect, useState, useRef, useCallback } from 'react';

interface UseTimerProps {
    timeConstraint?: string;
    timeLimit?: number;
    currentProblemId?: string;
    problemProgress?: ProblemInProblemSet['problem_progress'];
    firstProblemProgress?: {
        started_at: string;
        should_completed_at?: string;
    };
    onTimeExpired?: () => void;
    isCurrentProblemSubmitted?: boolean;
}

interface UseTimerReturn {
    timeLeft: number;
    progressPercentage: number;
    isLowTime: boolean;
    isTimeLimitReached: boolean;
    formatTime: (seconds: number) => string;
}

export const useTimer = ({
    timeConstraint = 'NONE',
    timeLimit = 40,
    currentProblemId,
    problemProgress,
    firstProblemProgress,
    onTimeExpired,
    isCurrentProblemSubmitted = false
}: UseTimerProps): UseTimerReturn => {
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

        const now = Date.now();
        const remaining = Math.max(0, endTimeRef.current - now);
        setTimeLeft(Math.floor(remaining / 1000));

        if (remaining <= 0 && !hasExpiredRef.current) {
            clearTimer();
            hasExpiredRef.current = true;
            if (onTimeExpiredRef.current) {
                console.log('Time expired');
                onTimeExpiredRef.current();
            }
        }
    }, [clearTimer]);

    useEffect(() => {
        if (timeConstraint === 'NONE' || !timeLimit) {
            // For demo purposes, start a simple countdown
            endTimeRef.current = Date.now() + timeLimit * 1000;
            hasExpiredRef.current = false;

            updateTimer();

            clearTimer();
            timerRef.current = setInterval(updateTimer, 1000);

            return clearTimer;
        }

        let endTime: Date | null = null;

        // Use should_completed_at if available, otherwise calculate from started_at + timeLimit
        if (timeConstraint === 'TOTAL_TIME' && firstProblemProgress) {
            if (firstProblemProgress.should_completed_at) {
                endTime = new Date(firstProblemProgress.should_completed_at);
            } else {
                const startTime = new Date(firstProblemProgress.started_at);
                endTime = new Date(startTime.getTime() + timeLimit * 1000);
            }
        } else if (timeConstraint === 'PER_PROBLEM' && problemProgress) {
            if (problemProgress.should_completed_at) {
                endTime = new Date(problemProgress.should_completed_at);
            } else {
                const startTime = new Date(problemProgress.started_at);
                endTime = new Date(startTime.getTime() + timeLimit * 1000);
            }
        }

        console.log('problemProgress', problemProgress);
        console.log('firstProblemProgress', firstProblemProgress);
        console.log('timeConstraint', timeConstraint);
        console.log('isCurrentProblemSubmitted', isCurrentProblemSubmitted);
        console.log('currentProblemId', currentProblemId);
        console.log('timeLimit', timeLimit);
        console.log('endTime', endTime);

        if (!endTime) {
            return;
        }

        endTimeRef.current = endTime.getTime();
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

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')} : ${minutes
            .toString()
            .padStart(2, '0')} : ${remainingSeconds
            .toString()
            .padStart(2, '0')}`;
    };

    const progressPercentage = Math.max(
        0,
        Math.min(100, (timeLeft / timeLimit) * 100)
    );

    const isLowTime = timeLeft < 60;
    const isTimeLimitReached = timeLeft <= 0;

    return {
        timeLeft,
        progressPercentage,
        isLowTime,
        isTimeLimitReached,
        formatTime
    };
};
