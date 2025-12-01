import React, { useMemo } from 'react';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';

const OpenEnded: React.FC<{
    openEndedAnswer: string;
    handleAnswerChange: (answer: string) => void;
}> = ({ openEndedAnswer, handleAnswerChange }) => {
    const router = useRouter();
    const { problemsetId, solution } = router.query;

    const showSolution = useMemo(() => {
        return solution || problemsetId;
    }, [solution, problemsetId]);

    return (
        <div className="w-full">
            <textarea
                className={cn(
                    'w-full p-3 rounded-lg resize-none border',
                    'bg-violet-3 text-white border-transparent min-h-0 lg:min-h-[200px]',
                    showSolution && 'cursor-not-allowed opacity-60'
                )}
                rows={1}
                placeholder="Tuliskan jawaban di sini"
                value={openEndedAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                disabled={!!showSolution}
            />
        </div>
    );
};

export default OpenEnded;
