import React from 'react';
import { IoMdCheckmark as Check, IoMdClose as X } from 'react-icons/io';
import { ProblemReport } from '../../../types/exercises';

interface ProblemHistoryTabProps {
    data: ProblemReport;
}

const ProblemHistoryTab: React.FC<ProblemHistoryTabProps> = ({ data }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    const reversedAttempts = [...data.attempt_history].reverse();
    const isMultipleChoice =
        data.question.type === 'MULTIPLE_CHOICE' ||
        data.question.type === 'MULTIPLE_ANSWER';

    const calculateScoreChange = (currentIndex: number) => {
        if (currentIndex === reversedAttempts.length - 1) return null;
        const currentScore = reversedAttempts[currentIndex].score;
        const previousScore = reversedAttempts[currentIndex + 1].score;
        const change = (currentScore - previousScore) * 100;
        return change !== 0 ? change : null;
    };

    return (
        <div className="w-full h-full flex flex-col space-y-4">
            {reversedAttempts.map((attempt, index) => {
                const scoreChange = calculateScoreChange(index);
                return (
                    <div
                        key={index}
                        className={`bg-[#252A31] rounded-lg p-4 ${
                            index === 0 ? 'border-l-2 border-[#5F2BCE]' : ''
                        }`}>
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-white font-semibold">
                                    Percobaan #{attempt.attempt}
                                </h3>
                                <p className="text-[#BBBBBB] text-sm">
                                    {index === 0
                                        ? 'Saat ini'
                                        : formatDate(attempt.date)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-semibold">
                                    {attempt.score * 100}
                                </p>
                                {scoreChange !== null && (
                                    <p
                                        className={`text-sm ${
                                            scoreChange > 0
                                                ? 'text-[#2AC179]'
                                                : 'text-[#EB5D49]'
                                        }`}>
                                        {scoreChange > 0 ? '+' : ''}
                                        {scoreChange.toFixed(0)} poin
                                    </p>
                                )}
                            </div>
                        </div>
                        {isMultipleChoice ? (
                            <div className="grid grid-cols-4 gap-2">
                                {data.question.options.map(
                                    (option, optionIndex) => {
                                        const isSelected =
                                            attempt.submitted_answer.includes(
                                                option.id
                                            );
                                        const isCorrect = option.is_correct;
                                        return (
                                            <div
                                                key={optionIndex}
                                                className={`h-12 rounded-md flex items-center justify-between px-3 ${
                                                    isSelected
                                                        ? isCorrect
                                                            ? 'bg-[#2AC179]/50'
                                                            : 'bg-[#EB5D49]/50'
                                                        : 'bg-[#4B4E5F]'
                                                }`}>
                                                <span className="text-white font-semibold">
                                                    {String.fromCharCode(
                                                        65 + optionIndex
                                                    )}
                                                </span>
                                                {isSelected && (
                                                    <div
                                                        className={`flex justify-center items-center rounded-md w-[20px] h-[20px] ${
                                                            isCorrect
                                                                ? 'bg-[#2AC27A]'
                                                                : 'bg-[#EC5D49]'
                                                        }`}>
                                                        {isCorrect ? (
                                                            <Check
                                                                className="text-white"
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <X
                                                                className="text-white"
                                                                size={16}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <div
                                className={`text-white p-3 bg-opacity-50 rounded-md border ${
                                    attempt.score === 1
                                        ? 'border-green-500 bg-[#2AC27A40] text-[#2AC27A]'
                                        : 'border-red-500 bg-[#EA5D4940] text-[#EA5D49]'
                                }`}>
                                {attempt.submitted_answer.join('')}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProblemHistoryTab;
