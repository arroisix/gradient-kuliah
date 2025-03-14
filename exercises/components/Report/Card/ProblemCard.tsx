import { useTracker } from '../../../../tracker/tracker';
import { useRouter } from 'next/router';
import TiptapViewer from '../../../../courses/components/Textbook/TiptapViewer';
import { Option } from '../Problem/Option';
import Link from 'next/link';
import React from 'react';

export const ProblemCard = ({
    problem,
    index
}: {
    problem: any;
    index: number;
}) => {
    const isTextBased =
        problem.question.type !== 'MULTIPLE_CHOICE' &&
        problem.question.type !== 'MULTIPLE_ANSWER';
    const tracker = useTracker();
    const router = useRouter();
    const { slug, exerciseProgressId } = router.query;

    const handleClickDetail = () => {
        tracker?.genericTrack('Click Problem Detail', {
            EXERCISE_SLUG: slug as string,
            PROGRESS_ID: exerciseProgressId as string,
            PROBLEM_ID: problem.id
        });
    };

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

            <p className="text-sm">
                <TiptapViewer content={problem.question.text} />
            </p>

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
                        }\`}>`}>
                        {problem.user_progress.submitted_answer.join('')}
                    </div>
                    <p className="text-sm mt-2">
                        Jawaban Benar:{' '}
                        <span className="font-semibold">
                            <TiptapViewer content={problem.solution} />
                        </span>
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {problem.question.options.map((option: any) => (
                        <Option
                            key={option.id}
                            option={option}
                            isCorrect={option.is_correct}
                            isSelected={problem.user_progress.submitted_answer.includes(
                                option.id
                            )}
                        />
                    ))}
                </div>
            )}

            <Link
                href={`/exercises/${slug}/report/${exerciseProgressId}/${problem.id}`}
                passHref>
                <button
                    className="bg-[#444444] hover:bg-[#666666] text-white text-sm py-2 px-4 rounded-full w-full"
                    onClick={handleClickDetail}>
                    Selengkapnya
                </button>
            </Link>
        </div>
    );
};
