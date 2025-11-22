import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import { useGetProblemInProblemSetQuery } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import { ProblemInProblemSet } from 'exercises/types/exercises';

interface TimerProps {
    timeConstraint?: string;
    timeLimit?: number;
    currentProblemId?: string;
    problemProgress?: ProblemInProblemSet['problem_progress'];
    firstProblemProgress?: {
        started_at: string;
    };
    onTimeExpired?: () => void;
    isCurrentProblemSubmitted?: boolean;
}

const Timer: React.FC<TimerProps> = ({
    timeConstraint = 'NONE',
    timeLimit = 40,
    currentProblemId,
    problemProgress,
    firstProblemProgress,
    onTimeExpired,
    isCurrentProblemSubmitted = false
}) => {
    const router = useRouter();
    const { slug, sectionId, problemId } = router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: sectionId as string,
            problemId: problemId as string
        },
        { skip: !slug || !sectionId || !problemId }
    );

    console.log('problem', problem);

    const { timeLeft, progressPercentage, isLowTime, formatTime } = useTimer({
        timeConstraint,
        timeLimit,
        currentProblemId,
        problemProgress,
        firstProblemProgress,
        onTimeExpired,
        isCurrentProblemSubmitted
    });

    const timerColor = isLowTime ? 'text-state-error' : 'text-white';
    const progressColor = isLowTime ? 'bg-state-error' : 'bg-accent-purple';
    const bgTimerColor = isLowTime ? 'bg-[#EF7F73]' : 'bg-[#B6A6F3]';

    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2">
                <div
                    className={`w-6 h-6 rounded-full ${bgTimerColor} flex items-center justify-center`}>
                    <TimerIcon className={`w-3.5 h-3.5 text-white`} />
                </div>
                <div
                    className={`text-lg font-semibold leading-none ${timerColor}`}>
                    {formatTime(timeLeft)}
                </div>
            </div>
            <div className="w-full lg:w-1/2 h-[4px] bg-gray-700/50 rounded-full overflow-hidden">
                <div
                    className={`h-full ${progressColor} transition-all duration-300 ease-linear rounded-full`}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
};

export default Timer;
