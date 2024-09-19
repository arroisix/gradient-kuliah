import React from 'react';

interface OpenEndedProblemProps {
    answer: string;
    onAnswerChange: (answer: string) => void;
    isSubmitted: boolean;
    isCorrect: boolean;
}

const OpenEndedProblem: React.FC<OpenEndedProblemProps> = ({
    answer,
    onAnswerChange,
    isSubmitted,
    isCorrect
}) => {
    const getTextareaClass = () => {
        if (isSubmitted) {
            return isCorrect
                ? 'bg-[#EC5D4980] text-white'
                : 'bg-[#2AC27A80] text-white';
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
                disabled={isSubmitted}
            />
        </div>
    );
};

export default OpenEndedProblem;
