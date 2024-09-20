import React, { useState } from 'react';
import { IoMdCheckmark as Check } from 'react-icons/io';
import { IoMdClose as X } from 'react-icons/io';
import Filter from 'commons/components/elements/Filter';
import { REVIEW_FILTER_OPTIONS } from '../constants';
import { useGetLatestExerciseReviewQuery } from '../../../redux/api/exercisesApi';
import Skeleton from 'commons/components/elements/Skeleton';

const ReviewTab = ({ exerciseSlug }: { exerciseSlug: string }) => {
    const [filter] = useState('all');
    const { data, isLoading, error } = useGetLatestExerciseReviewQuery({
        exercise_slug: exerciseSlug
    });

    if (isLoading) return <Skeleton className="w-full h-full" />;
    if (error) return <div>Error loading review data</div>;

    const filteredProblems = data?.problems.filter((problem) => {
        if (filter === 'correct') return problem.user_progress.is_correct;
        if (filter === 'incorrect') return !problem.user_progress.is_correct;
        return true;
    });

    return (
        <div className="w-full flex flex-col gap-6 max-w-[640px]">
            <Filter options={REVIEW_FILTER_OPTIONS} defaultSelected={filter} />
            {filteredProblems?.map((problem, index) => (
                <ProblemCard
                    key={problem.id}
                    problem={problem}
                    index={index + 1}
                />
            ))}
        </div>
    );
};

const ProblemCard = ({ problem, index }: { problem: any; index: number }) => {
    const isTextBased = problem.question.type !== 'MULTIPLE_CHOICE';

    return (
        <div
            className={`p-4 flex flex-col gap-3 bg-[#1B2129] rounded-md text-white border-t-2 ${
                problem.user_progress.is_correct
                    ? 'border-green-500'
                    : 'border-red-500'
            }`}>
            <div className="flex justify-between items-center w-full max-w-[608px] h-auto">
                <h3 className="text-sm text-[#999999]">Nomor {index}</h3>
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

            <p className="text-sm">{problem.question.text}</p>

            {isTextBased ? (
                <div className="">
                    <div className="text-white p-3 bg-[#EC5D49] bg-opacity-50 rounded-md border border-[#EA5D49]">
                        {problem.user_progress.submitted_answer.join('')}
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
                            isCorrect={problem.user_progress.submitted_answer.includes(
                                option.id
                            )}
                            isSelected={problem.user_progress.submitted_answer.includes(
                                option.id
                            )}
                        />
                    ))}
                </div>
            )}

            <div className="">
                <button className="bg-[#444444] hover:bg-[#666666] text-white text-sm py-2 px-4 rounded-full w-full">
                    Selengkapnya
                </button>
            </div>
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
                isSelected
                    ? isCorrect
                        ? 'bg-[#2AC27A]'
                        : 'bg-[#EC5D49]'
                    : 'bg-[#444444]'
            } bg-opacity-50`}>
            <span className="text-sm font-medium">{option.text}</span>
            {isSelected && (
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

export default ReviewTab;
