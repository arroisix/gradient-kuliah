import React, { useState } from 'react';
import { IoMdCheckmark as Check } from 'react-icons/io';
import { IoMdClose as X } from 'react-icons/io';
import Filter from 'commons/components/elements/Filter';
import { REVIEW_FILTER_OPTIONS } from '../constants';

const mockData = {
    problems: [
        {
            id: 'a31532b1-c8c3-4898-a995-41c9587cc1ae',
            question: {
                text: 'Di bawah ini yang termasuk ke dalam faktor-faktor yang mempengaruhi pergeseran arah kesetimbangan zat kimia adalah...',
                type: 'MULTIPLE_CHOICE',
                options: ['Konsentrasi', 'Suhu', 'Jenis Zat', 'Tekanan']
            },
            user_progress: {
                status: 'COMPLETED',
                is_correct: true,
                submitted_answer: ['Konsentrasi']
            },
            performance: {
                percentile: 0.0,
                message:
                    'Kamu menyelesaikan soal ini lebih cepat dari rata-rata user'
            }
        },
        {
            id: 'b31532b1-c8c3-4898-a995-41c9587cc1ae',
            question: {
                text: 'Jika rumus molekul cuka adalah CH3COOH, rumus empirisnya adalah?',
                type: 'MULTIPLE_CHOICE',
                options: ['CH₂O', 'CHO', 'CHO₂', 'C₂HO']
            },
            user_progress: {
                status: 'COMPLETED',
                is_correct: true,
                submitted_answer: ['CHO']
            },
            performance: {
                percentile: 50.0,
                message:
                    'Kamu menyelesaikan soal ini lebih cepat dari rata-rata user'
            }
        },
        {
            id: 'c31532b1-c8c3-4898-a995-41c9587cc1ae',
            question: {
                text: 'Pada reaksi kesetimbangan 2XY ⇌ X₂ + Y₂, sebanyak 4 mol XY dipanaskan sehingga terbentuk 1 mol X₂. Derajat disosiasi dari reaksi tersebut adalah...',
                type: 'SHORT_ANSWER',
                options: [],
                correct_answer: '0.5'
            },
            user_progress: {
                status: 'COMPLETED',
                is_correct: false,
                submitted_answer: '0.4'
            },
            performance: {
                percentile: 30.0,
                message: 'Jawaban kamu salah'
            }
        }
    ],
    current_page: 1,
    limit: 2,
    total_items: 2
};

const ReviewTab = () => {
    const [filter, setFilter] = useState('all');

    const handleFilterChange = (selectedValue: string) => {
        setFilter(selectedValue);
    };

    const filteredProblems = mockData.problems.filter((problem) => {
        if (filter === 'correct') return problem.user_progress.is_correct;
        if (filter === 'incorrect') return !problem.user_progress.is_correct;
        return true;
    });

    return (
        <div className="w-full flex flex-col gap-6 max-w-[640px]">
            <Filter options={REVIEW_FILTER_OPTIONS} defaultSelected={filter} />
            {filteredProblems.map((problem, index) => (
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
    const isTextBased = problem.question.options.length === 0;

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
                        {problem.user_progress.submitted_answer}
                    </div>
                    <p className="text-sm">
                        Jawaban Benar:{' '}
                        <span className="font-semibold">
                            {problem.question.correct_answer}
                        </span>
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {problem.question.options.map(
                        (option: string, idx: number) => (
                            <Option
                                key={idx}
                                option={option}
                                isCorrect={idx === 0}
                            />
                        )
                    )}
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
    isCorrect
}: {
    option: string;
    isCorrect: boolean;
}) => {
    return (
        <div
            className={`flex justify-between items-center p-3 my-1 rounded-md w-full max-w-[608px] h-[45px] ${
                isCorrect ? 'bg-[#2AC27A]' : 'bg-[#EC5D49]'
            } bg-opacity-50`}>
            <span className="text-sm font-medium">{option}</span>
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
        </div>
    );
};

export default ReviewTab;
