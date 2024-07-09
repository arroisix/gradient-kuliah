import { cn } from 'commons/utils';
import React from 'react';
import { CorrectAnswerBadge } from './CorrectAnswerBadge';
import TiptapViewer from './TiptapViewer';
import Skeleton from 'commons/components/elements/Skeleton';

export const ShortAnswerSection = ({
    problem,
    isEmpty,
    isLoading
}: Partial<Pick<TextbookSolution, 'problem'>> & {
    isEmpty?: boolean;
    isLoading?: boolean;
}): JSX.Element => {
    const isMultiselect =
        problem?.question.answers.reduce(
            (trueCount, choice) => trueCount + (choice.is_answer ? 1 : 0),
            0
        ) !== 1;

    const renderAnswer = (): JSX.Element => {
        if (isEmpty) return <div className="h-8"></div>;

        if (problem?.question.type == 'open_ended')
            return (
                <>
                    {problem?.question.answers.map((answer) => (
                        <TiptapViewer key={answer.id} content={answer.answer} />
                    ))}
                </>
            );
        if (problem?.question.type == 'multiple_choice') {
            return (
                <div className="flex flex-col gap-2">
                    {problem?.question.answers.map((answer, idx) => (
                        <div
                            key={answer.id}
                            className={cn(
                                'border flex gap-4 p-2 rounded-md border-neutral-700',
                                answer.is_answer && 'bg-[#0F460F]'
                            )}>
                            <span className="font-bold">
                                {String.fromCharCode(65 + idx)}.
                            </span>
                            <div className="grow">
                                <TiptapViewer content={answer.answer} />
                            </div>
                            <CorrectAnswerBadge
                                isMulti={isMultiselect}
                                isCorrect={answer.is_answer}
                            />
                        </div>
                    ))}
                </div>
            );
        }
        return <></>;
    };

    if (
        !isEmpty &&
        problem?.question.answers.every(
            (answer) => JSON.stringify(answer.answer) == '{}'
        )
    )
        return <></>;

    return (
        <div className="p-4 mt-2 space-y-4 border rounded-lg border-state-success/50 bg-state-success/25">
            <p className="text-sm font-bold">Jawaban</p>
            {isLoading ? (
                <Skeleton isCustomSize repeat={3} className="w-full h-4 mb-3" />
            ) : (
                renderAnswer()
            )}
        </div>
    );
};
