import React, { useState } from 'react';
import { ProblemReport } from '../../../../types/exercises';
import { IoMdCheckmark as Check, IoMdClose as X } from 'react-icons/io';

interface ProblemDetailContentProps {
    problem: ProblemReport;
}

const ProblemDetailContent: React.FC<ProblemDetailContentProps> = ({
    problem
}) => {
    const [showExplanation, setShowExplanation] = useState(false);
    const isTextBased = problem.question.type !== 'MULTIPLE_CHOICE';

    const toggleExplanation = () => {
        setShowExplanation(!showExplanation);
    };

    return (
        <div
            className={`p-4 flex flex-col gap-3 bg-[#1B2129] rounded-md text-white border-t-2 ${
                problem.user_progress.is_correct
                    ? 'border-green-500'
                    : 'border-red-500'
            }`}>
            <div className="flex justify-between items-center w-full max-w-[608px] h-auto">
                <h3 className="text-sm text-[#999999]">Nomor {problem.id}</h3>
                <div
                    className={`flex items-center justify-center gap-1 text-xs font-medium rounded-md px-2 py-1 ${
                        problem.user_progress.is_correct
                            ? 'bg-[#2AC27A40] text-[#2AC27A]'
                            : 'bg-[#EA5D4940] text-[#EA5D49]'
                    }`}>
                    {problem.user_progress.is_correct
                        ? 'Jawaban Benar'
                        : 'Jawaban Salah'}
                </div>
            </div>

            {!showExplanation ? (
                <>
                    <p className="text-sm">{problem.question.text}</p>

                    {isTextBased ? (
                        <div className="">
                            <div
                                className={`text-white p-3 bg-opacity-50 rounded-md border ${
                                    problem.user_progress.is_correct
                                        ? 'border-green-500'
                                        : 'border-red-500'
                                } ${
                                    problem.user_progress.is_correct
                                        ? 'bg-[#2AC27A40] text-[#2AC27A]'
                                        : 'bg-[#EA5D4940] text-[#EA5D49]'
                                }`}>
                                {problem.user_progress.submitted_answer.join(
                                    ''
                                )}
                            </div>
                            <p className="text-sm mt-2">
                                Jawaban Benar:{' '}
                                <span className="font-semibold">
                                    {problem.solution}
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {problem.question.options.map((option: any) => (
                                <Option
                                    key={option.id}
                                    option={option}
                                    isCorrect={
                                        option.id === problem.solution_id
                                    }
                                    isSelected={problem.user_progress.submitted_answer.includes(
                                        option.id
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col gap-3">
                    <h3 className="text-white text-sm font-normal mb-2">
                        Pembahasan
                    </h3>
                    <p className="text-white font-semibold text-base">
                        {problem.solution}
                    </p>
                </div>
            )}

            <button
                onClick={toggleExplanation}
                className="bg-[#444444] hover:bg-[#666666] text-white text-sm py-2 px-4 rounded-full w-full">
                {showExplanation ? 'Lihat Soal' : 'Lihat Pembahasan'}
            </button>
        </div>
    );
};

const Option = ({
    option,
    isCorrect,
    isSelected
}: {
    option: any;
    isCorrect: boolean;
    isSelected: boolean;
}) => {
    return (
        <div
            className={`flex justify-between items-center p-3 my-1 rounded-md w-full max-w-[608px] h-[45px] ${
                isSelected || isCorrect
                    ? isCorrect
                        ? 'bg-[#2AC27A]'
                        : 'bg-[#EC5D49]'
                    : 'bg-[#444444]'
            } bg-opacity-50`}>
            <span className="text-sm font-medium">{option.text}</span>
            {(isSelected || isCorrect) && (
                <div
                    className={`flex justify-center items-center rounded-md w-[20px] h-[20px] ${
                        isCorrect ? 'bg-[#2AC27A]' : 'bg-[#EC5D49]'
                    }`}>
                    {isCorrect ? (
                        <Check className="text-white" size={16} />
                    ) : (
                        <X className="text-white" size={16} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProblemDetailContent;
