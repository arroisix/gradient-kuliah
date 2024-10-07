import React from 'react';
import { Check, X } from 'lucide-react';
import TiptapViewer from '../../Textbook/TiptapViewer';
import { cn } from 'commons/utils';

interface Option {
    id: string;
    answer: any;
    is_correct: boolean;
}

interface MultipleChoiceProblemProps {
    options: Option[];
    selectedAnswers: string[];
    onAnswerSelect: (selectedAnswers: string[]) => void;
    isSubmitted: boolean;
    isSingleAnswer: boolean;
    showSolution: string;
}

const MultipleChoiceProblem: React.FC<MultipleChoiceProblemProps> = ({
    options,
    selectedAnswers,
    onAnswerSelect,
    isSubmitted,
    isSingleAnswer,
    showSolution
}) => {
    const handleAnswerSelect = (answerId: string) => {
        if (!isSubmitted || showSolution === 'AFTER_COMPLETE') {
            if (isSingleAnswer) {
                onAnswerSelect([answerId]);
            } else {
                const updatedAnswers = selectedAnswers.includes(answerId)
                    ? selectedAnswers.filter((id) => id !== answerId)
                    : [...selectedAnswers, answerId];
                onAnswerSelect(updatedAnswers);
            }
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            {options.map((option) => (
                <div
                    key={option.id}
                    className={cn(
                        'flex items-center p-3 rounded-lg w-full cursor-pointer',
                        isSubmitted && showSolution === 'AFTER_PROBLEM'
                            ? option.is_correct
                                ? 'bg-[#2AC27A80]'
                                : selectedAnswers.includes(option.id)
                                ? 'bg-[#EC5D4980]'
                                : 'bg-[#4B4E5F]'
                            : selectedAnswers.includes(option.id)
                            ? 'bg-[#333540]'
                            : 'bg-[#4B4E5F]',
                        isSubmitted &&
                            showSolution === 'AFTER_PROBLEM' &&
                            'cursor-default'
                    )}
                    onClick={() => handleAnswerSelect(option.id)}>
                    <div className="flex-grow text-sm font-medium text-white">
                        <TiptapViewer content={option.answer} />
                    </div>
                    {(!isSingleAnswer ||
                        selectedAnswers.includes(option.id) ||
                        (isSubmitted && showSolution === 'AFTER_PROBLEM')) && (
                        <div
                            className={cn(
                                'flex justify-center items-center rounded-[4px] w-5 h-5',
                                isSubmitted && showSolution === 'AFTER_PROBLEM'
                                    ? option.is_correct
                                        ? 'bg-[#2AC27A]'
                                        : selectedAnswers.includes(option.id)
                                        ? 'bg-[#EC5D49]'
                                        : 'bg-[#898C9E]'
                                    : selectedAnswers.includes(option.id)
                                    ? 'bg-[#5F2BCE]'
                                    : 'bg-[#898C9E]'
                            )}>
                            {isSubmitted && showSolution === 'AFTER_PROBLEM' ? (
                                option.is_correct ? (
                                    <Check className="text-white" size={16} />
                                ) : selectedAnswers.includes(option.id) ? (
                                    <X className="text-white" size={16} />
                                ) : null
                            ) : (
                                selectedAnswers.includes(option.id) && (
                                    <Check className="text-white" size={16} />
                                )
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MultipleChoiceProblem;
