import { cn } from 'commons/utils';
import React, { useEffect, useState } from 'react';
import { CorrectAnswerBadge } from '../Textbook/CorrectAnswerBadge';
import TiptapViewer from '../Textbook/TiptapViewer';

export const ShortAnswerSection = ({
    problem,
    isLoading
}: Partial<Pick<BankSoal, 'problem'>> & {
    isLoading?: boolean;
}): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const isMultiselect =
        problem?.question.answers.reduce(
            (trueCount, choice) => trueCount + (choice.is_answer ? 1 : 0),
            0
        ) !== 1;

    useEffect(() => {
        if (isOpen) setIsOpen(false);
    }, [problem]);

    const renderAnswer = (): JSX.Element => {
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
        problem?.question.answers.every(
            (answer) => JSON.stringify(answer.answer) == '{}'
        )
    )
        return <></>;

    return (
        <label
            className={cn(
                'mb-6 rounded-lg collapse collapse-arrow border border-state-success/50 bg-state-success/25 transition',
                isLoading && '*:opacity-0 animate-pulse'
            )}>
            <input
                type="checkbox"
                disabled={isLoading}
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
                name="answer"
                className="!min-h-0"
            />
            <div className="font-bold collapse-title collapse-arrow">
                Jawaban
            </div>
            <div className="collapse-content">{renderAnswer()}</div>
        </label>
    );
};
