import React from 'react';
import { cn } from 'commons/utils';
import TiptapViewer from '../../Textbook/TiptapViewer';

interface OpenEndedProblemProps {
    answer: string;
    correctAnswer: string;
    onAnswerChange: (answer: string) => void;
    isSubmitted: boolean;
    isCorrect: boolean;
    showSolution: string;
}

const OpenEndedProblem: React.FC<OpenEndedProblemProps> = ({
    answer,
    correctAnswer,
    onAnswerChange,
    isSubmitted,
    isCorrect,
    showSolution
}) => {
    const getTextareaClass = () => {
        if (isSubmitted && showSolution !== 'AFTER_COMPLETE') {
            return isCorrect
                ? 'bg-[#2AC27A40] text-[#2AC27A] border-[#2AC27A]'
                : 'bg-[#EA5D4940] text-[#EA5D49] border-[#EA5D49]';
        }
        return 'bg-[#374151] text-white border-transparent';
    };

    return (
        <div className="w-full">
            <textarea
                className={cn(
                    'w-full p-3 rounded-lg resize-none border',
                    getTextareaClass()
                )}
                rows={1}
                placeholder="Tuliskan jawaban di sini"
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
                disabled={isSubmitted && showSolution !== 'AFTER_COMPLETE'}
            />
            {isSubmitted && showSolution !== 'AFTER_COMPLETE' && (
                <div className="mt-2">
                    <p className="text-sm text-white">
                        Jawaban Benar:{' '}
                        <span className="font-semibold">
                            <TiptapViewer content={correctAnswer} />
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default OpenEndedProblem;
