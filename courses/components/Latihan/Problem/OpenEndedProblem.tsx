import React from 'react';

interface OpenEndedProblemProps {
    answer: string;
    onAnswerChange: (answer: string) => void;
    isSubmitted: boolean;
    isCorrect: boolean;
    showSolution: string;
}

const OpenEndedProblem: React.FC<OpenEndedProblemProps> = ({
    answer,
    onAnswerChange,
    isSubmitted,
    isCorrect,
    showSolution
}) => {
    const getTextareaClass = () => {
        if (isSubmitted && showSolution !== 'AFTER_COMPLETE') {
            return isCorrect
                ? 'bg-[#2AC27A80] text-white'
                : 'bg-[#EC5D4980] text-white';
        }
        return 'bg-[#374151] text-white';
    };

    return (
        <div className="w-full">
            <textarea
                className={`w-full p-3 rounded-lg resize-none ${getTextareaClass()}`}
                rows={1}
                placeholder="Tuliskan jawaban di sini"
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
                disabled={isSubmitted && showSolution !== 'AFTER_COMPLETE'}
            />
        </div>
    );
};

export default OpenEndedProblem;
