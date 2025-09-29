import React from 'react';
import { Check, X } from 'lucide-react';
import TiptapViewer from '../../../courses/components/Textbook/TiptapViewer';
import { cn } from 'commons/utils';
import { Option } from 'exercises/types/exercises';

interface MultipleChoiceProblemProps {
    options: Option[];
    selectedAnswers: string[];
    onAnswerSelect: (selectedAnswers: string[]) => void;
    isSubmitted: boolean;
    isSingleAnswer: boolean;
    showSolution: string;
    solution?: {
        options: Array<{
            id: string;
            is_correct: boolean;
        }>;
    };
}

const MultipleChoiceProblem: React.FC<MultipleChoiceProblemProps> = ({
    options,
    selectedAnswers,
    onAnswerSelect,
    isSubmitted,
    isSingleAnswer,
    showSolution,
    solution
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

    const isCorrect = (optionId: string) => {
        return (
            solution?.options.find((opt) => opt.id === optionId)?.is_correct ||
            false
        );
    };

    return (
        <div className="flex flex-col space-y-2">
            {options.map((option) => (
                <button
                    key={option.id}
                    className={cn(
                        'flex items-center justify-between p-3 rounded-lg w-full text-left',
                        isSubmitted &&
                            showSolution === 'AFTER_PROBLEM' &&
                            solution
                            ? isCorrect(option.id)
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
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={isSubmitted && showSolution !== 'AFTER_COMPLETE'}>
                    <div className="flex-grow text-sm font-medium text-white">
                        <TiptapViewer content={option.answer} />
                    </div>
                    {(!isSingleAnswer ||
                        selectedAnswers.includes(option.id) ||
                        (isSubmitted &&
                            showSolution === 'AFTER_PROBLEM' &&
                            solution)) && (
                        <div
                            className={cn(
                                'flex justify-center items-center rounded-[4px] w-5 h-5',
                                isSubmitted &&
                                    showSolution === 'AFTER_PROBLEM' &&
                                    solution
                                    ? isCorrect(option.id)
                                        ? 'bg-[#2AC27A]'
                                        : selectedAnswers.includes(option.id)
                                          ? 'bg-[#EC5D49]'
                                          : 'bg-[#898C9E]'
                                    : selectedAnswers.includes(option.id)
                                      ? 'bg-[#5F2BCE]'
                                      : 'bg-[#898C9E]'
                            )}>
                            {isSubmitted &&
                            showSolution === 'AFTER_PROBLEM' &&
                            solution ? (
                                isCorrect(option.id) ? (
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
                </button>
            ))}
        </div>
    );
};

export default MultipleChoiceProblem;
