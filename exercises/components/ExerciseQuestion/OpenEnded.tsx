import React from 'react';
import { cn } from 'commons/utils';

const OpenEnded: React.FC<{
    openEndedAnswer: string;
    handleAnswerChange: (answer: string) => void;
}> = ({ openEndedAnswer, handleAnswerChange }) => {
    return (
        <div className="w-full">
            <textarea
                className={cn(
                    'w-full p-3 rounded-lg resize-none border',
                    'bg-violet-3 text-white border-transparent min-h-0 lg:min-h-[200px]'
                )}
                rows={1}
                placeholder="Tuliskan jawaban di sini"
                value={openEndedAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                // disabled={isSubmitted && showSolution !== 'AFTER_COMPLETE'}
            />
        </div>
    );
};

export default OpenEnded;
