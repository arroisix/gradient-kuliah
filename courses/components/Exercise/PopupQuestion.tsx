import Button from 'commons/components/elements/Button';

interface PopupProps<T> {
    onSubmit?: () => void;
    data?: T;
}

const PopupQuestionContent = ({
    onSubmit,
    data
}: PopupProps<PopupQuestion>): JSX.Element => {
    return (
        <div className="w-full h-full bg-neutral-800 z-100 rounded-2xl px-12 py-8 flex flex-col justify-between">
            <p className="text-base leading-6 font-[500]">
                {data?.question?.question}
            </p>
            <div className="flex w-full gap-2 flex-col h-1/2 overflow-auto">
                {data?.question.answers.map(
                    (answer: ExerciseAnswer, index: number) => (
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            key={answer.id}>
                            <p>{String.fromCharCode(64 + 1 + index)}</p>
                            <div className="bg-neutral-900 w-full px-4 py-2 rounded-lg">
                                {answer.answer}
                            </div>
                        </div>
                    )
                )}
            </div>
            <div className="w-full flex items-end justify-end">
                <Button variant="primary" onClick={onSubmit}>
                    Kirim jawaban
                </Button>
            </div>
        </div>
    );
};

export default PopupQuestionContent;
