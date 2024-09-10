import React from 'react';
import { Check, X } from 'lucide-react';

interface Option {
    id: string;
    text: string;
    is_correct: boolean;
}

interface MultipleChoiceProblemProps {
    options: Option[];
    selectedAnswers: string[];
    onAnswerSelect: (selectedAnswers: string[]) => void;
    isSubmitted: boolean;
}

const MultipleChoiceProblem: React.FC<MultipleChoiceProblemProps> = ({
    options,
    selectedAnswers,
    onAnswerSelect,
    isSubmitted
}) => {
    const handleAnswerSelect = (answerId: string) => {
        if (!isSubmitted) {
            onAnswerSelect(
                selectedAnswers.includes(answerId)
                    ? selectedAnswers.filter((id) => id !== answerId)
                    : [...selectedAnswers, answerId]
            );
        }
    };

    const getButtonClass = (option: Option) => {
        if (isSubmitted) {
            if (option.is_correct) {
                return 'bg-[#2AC27A80] text-white bg-opacity-50';
            }
            if (selectedAnswers.includes(option.id) && !option.is_correct) {
                return 'bg-[#EC5D4980] text-white bg-opacity-50';
            }
        }
        return selectedAnswers.includes(option.id)
            ? 'bg-[#7F56D9] text-white'
            : 'bg-[#374151] text-white';
    };

    return (
        <div className="flex flex-col space-y-2">
            {options.map((option) => (
                <button
                    key={option.id}
                    className={`flex items-center justify-between w-full p-3 rounded-lg text-left ${getButtonClass(
                        option
                    )}`}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={isSubmitted}>
                    <span>{option.text}</span>
                    {isSubmitted ? (
                        option.is_correct ? (
                            <Check className="text-white" size={20} />
                        ) : selectedAnswers.includes(option.id) ? (
                            <X className="text-white" size={20} />
                        ) : null
                    ) : (
                        selectedAnswers.includes(option.id) && (
                            <Check className="text-white" size={20} />
                        )
                    )}
                </button>
            ))}
        </div>
    );
};

export default MultipleChoiceProblem;
