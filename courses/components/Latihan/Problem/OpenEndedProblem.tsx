import React from 'react';

interface OpenEndedProblemProps {
    answer: string;
    onAnswerChange: (answer: string) => void;
}

const OpenEndedProblem: React.FC<OpenEndedProblemProps> = ({
    answer,
    onAnswerChange
}) => {
    return (
        <div className="w-full">
            <textarea
                className="w-full p-3 bg-[#374151] text-white rounded-lg resize-none"
                rows={1}
                placeholder="Tuliskan jawaban di sini"
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
            />
        </div>
    );
};

export default OpenEndedProblem;
