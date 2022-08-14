import Button from 'commons/components/elements/Button';
import {
    PopupQuizProvider,
    usePopupQuiz
} from 'courses/contexts/PopupQuizProvider';
import { useEffect, useState } from 'react';

interface PopupProps<T> {
    onSubmit?: () => void;
    data?: T;
}

const AnswerChoice = ({
    answer,
    index
}: {
    answer: ExerciseAnswer;
    index: number;
}): JSX.Element => {
    const { isPickedAnswer, clickAnswerChoice, solution, correctAnswer } =
        usePopupQuiz();

    useEffect(() => {
        console.log(solution);
    }, [solution]);

    console.log(correctAnswer);

    const computeBgColor = (id: string): string => {
        if (solution) {
            if (isPickedAnswer(id) && !correctAnswer?.includes(id)) {
                return 'bg-state-error text-white';
            }

            if (correctAnswer?.includes(id)) {
                return 'bg-state-success text-white';
            }
        }

        if (isPickedAnswer(id)) {
            return 'bg-white text-neutral-900';
        }

        return 'bg-neutral-900 text-white';
    };

    return (
        <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={solution ? undefined : () => clickAnswerChoice(answer.id)}
            aria-hidden>
            <p>{String.fromCharCode(64 + 1 + index)}</p>
            <div
                className={`w-full px-4 py-2 rounded-lg ${computeBgColor(
                    answer.id
                )}`}>
                {answer.answer}
            </div>
        </div>
    );
};

const SaveAnswer = ({
    onSubmit,
    setShowSolution,
    isShowSolution
}: {
    onSubmit?: () => void;
    setShowSolution: () => void;
    isShowSolution: boolean;
}): JSX.Element => {
    const { submitAnswer, solution } = usePopupQuiz();

    const onClick = async (): Promise<void> => {
        await submitAnswer();

        // if (onSubmit) {
        //     onSubmit();
        // }
    };

    return (
        <div className="w-full flex items-end justify-end">
            <Button
                variant="primary"
                onClick={
                    solution
                        ? isShowSolution
                            ? () => onSubmit && onSubmit()
                            : () => setShowSolution()
                        : () => onClick()
                }>
                {solution
                    ? isShowSolution
                        ? 'Kembali ke Video'
                        : 'Lihat Pembahasan'
                    : 'Kirim jawaban'}
            </Button>
        </div>
    );
};

const PopupQuestionSolution = (): JSX.Element => {
    const { solution } = usePopupQuiz();
    return (
        <div className="w-full bg-neutral-900 p-4 rounded-lg">
            <p className="font-bold">Pembahasan</p>
            <div className="h-px bg-neutral-600 w-full my-2" />
            <p className="text-xs">{solution}</p>
        </div>
    );
};

const PopupQuestionBody = ({
    data,
    isShowSolution
}: {
    data?: PopupQuestion;
    isShowSolution: boolean;
}): JSX.Element => {
    if (isShowSolution) {
        return <PopupQuestionSolution />;
    }

    return (
        <div className="flex w-full gap-2 flex-col h-1/2 overflow-auto">
            {data?.question.answers.map(
                (answer: ExerciseAnswer, index: number) => (
                    <AnswerChoice
                        answer={answer}
                        index={index}
                        key={answer.id}
                    />
                )
            )}
        </div>
    );
};

const PopupQuestionContent = ({
    onSubmit,
    data
}: PopupProps<PopupQuestion>): JSX.Element => {
    const [isShowSolution, setShowSolution] = useState(false);

    return (
        <PopupQuizProvider popupQuestion={data}>
            <div className="w-full h-full bg-neutral-800 z-100 rounded-2xl px-12 py-8 flex flex-col justify-between">
                <p className="text-base leading-6 font-[500]">
                    {data?.question?.question}
                </p>
                <PopupQuestionBody
                    data={data}
                    isShowSolution={isShowSolution}
                />
                <SaveAnswer
                    onSubmit={onSubmit}
                    isShowSolution={isShowSolution}
                    setShowSolution={() => setShowSolution(true)}
                />
            </div>
        </PopupQuizProvider>
    );
};

export default PopupQuestionContent;
