import Button from 'commons/components/elements/Button';
import {
    PopupQuizProvider,
    usePopupQuiz
} from 'courses/contexts/PopupQuizProvider';
import { useState } from 'react';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';

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
    const { submitAnswer, solution, pickedAnswer } = usePopupQuiz();

    const onClick = async (): Promise<void> => {
        await submitAnswer();
    };

    return (
        <div className="w-full flex items-end justify-end">
            <Button
                disabled={pickedAnswer.length === 0}
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
        <div className="w-full bg-neutral-900 p-4 rounded-lg h-1/2 min-h-[200px] lg:min-h-[130px] my-2">
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
        <div className="flex w-full gap-2 flex-col h-1/2 overflow-auto my-2 min-h-[200px] lg:min-h-[130px]">
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
            <div className="w-full h-full bg-neutral-800 z-100 rounded-2xl px-12 py-8 flex flex-col justify-between overflow-y-auto lg:overflow-y-hidden relative">
                <MdClose
                    className="absolute top-4 right-4 text-2xl cursor-pointer text-neutral-600"
                    onClick={onSubmit ? () => onSubmit() : undefined}
                />
                <div className="flex gap-2 flex-wrap overflow-y-auto">
                    {data?.question.question_image_url && (
                        <Image
                            src={data?.question.question_image_url as string}
                            height={150}
                            width={300}
                            layout="fixed"
                            className="object-cover"
                        />
                    )}
                    <div className="w-full">
                        <p className="text-base leading-6 font-[500]">
                            {data?.question?.question}
                        </p>
                    </div>
                </div>
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
