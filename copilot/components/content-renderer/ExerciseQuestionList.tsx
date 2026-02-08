import { ExerciseQuestion } from 'copilot/types/copilot';
import { MouseEvent, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { cn } from 'commons/utils';
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from 'lucide-react';
import Button from 'commons/components/elements/Button';
import { FaCircleCheck } from 'react-icons/fa6';
import { useUpdateExerciseAnswerMutation } from 'copilot/redux/api/copilotApi';
import { toast } from 'react-toastify';

const PREV_QUESTION_BTN_ID = 'prev_question';
const NEXT_QUESTION_BTN_ID = 'next_question';

interface ExerciseQuestionListProps {
    currentSessionId: string;
    message_id: string;
    exercise_questions: ExerciseQuestion[];
    scrollToBottom: () => void;
}

function ExerciseQuestionList({
    currentSessionId,
    message_id,
    exercise_questions,
    scrollToBottom
}: ExerciseQuestionListProps): JSX.Element {
    const [isOpenExplanation, setIsOpenExplanation] = useState(false);
    const [selectedAnswerId, setSelectedAnswerId] = useState('');
    const [currentQuestionId, setCurrentQuestionId] = useState(
        exercise_questions[0].id
    );

    const currentQuestion = exercise_questions.find(
        (v) => v.id === currentQuestionId
    );
    const isFirstQuestion = exercise_questions[0].id === currentQuestion?.id;
    const isLastQuestion =
        exercise_questions[exercise_questions.length - 1].id ===
        currentQuestion?.id;
    const correctAnswer = currentQuestion?.options.find(
        (v) => v.value === currentQuestion.answer
    );

    const [submitAnswer, { isLoading }] = useUpdateExerciseAnswerMutation();

    // scroll to bottom if explanation opened for better UX
    useEffect(() => {
        scrollToBottom();
    }, [isOpenExplanation, scrollToBottom]);

    // update selected answer id as question changed
    useEffect(() => {
        setSelectedAnswerId(currentQuestion?.user_answer ?? '');
    }, [currentQuestion]);

    if (!currentQuestion) {
        return <></>;
    }

    const handleSetPrevQuestion = () => {
        const currentQuestionIdx = exercise_questions.indexOf(currentQuestion);
        const prevQuestion = exercise_questions[currentQuestionIdx - 1];
        setCurrentQuestionId(prevQuestion.id);
    };

    const handleSetNextQuestion = () => {
        const currentQuestionIdx = exercise_questions.indexOf(currentQuestion);
        const nextQuestion = exercise_questions[currentQuestionIdx + 1];
        setCurrentQuestionId(nextQuestion.id);
    };

    const handleSubmitAnswer = async (event: MouseEvent<HTMLButtonElement>) => {
        const btnEl = event.currentTarget;
        // skip submit answer if the answer didn't changed
        if (selectedAnswerId === currentQuestion.user_answer) {
            if (btnEl.id === PREV_QUESTION_BTN_ID) {
                handleSetPrevQuestion();
            } else if (btnEl.id === NEXT_QUESTION_BTN_ID && !isLastQuestion) {
                handleSetNextQuestion();
            }
            return;
        }

        try {
            await submitAnswer({
                session_id: currentSessionId,
                message_id,
                answer: selectedAnswerId,
                question_id: currentQuestion.id
            });

            if (btnEl.id === PREV_QUESTION_BTN_ID) {
                handleSetPrevQuestion();
            } else if (btnEl.id === NEXT_QUESTION_BTN_ID && !isLastQuestion) {
                handleSetNextQuestion();
            }
        } catch (error) {
            console.error(
                new Error('failed to submit user answer', { cause: error })
            );
            toast.error(
                'Terjadi kesalahan saat menyimpan jawaban, mohon coba kembali',
                {
                    position: 'top-center',
                    theme: 'colored',
                    hideProgressBar: true
                }
            );
        }
    };

    return (
        <div className="bg-[#191920] p-6 rounded-2xl w-[680px]">
            <div className="flex justify-between items-center mb-1">
                <span></span>
                <span className="text-[#999999] text-sm leading-[160%]">
                    {currentQuestionId} of {exercise_questions.length}
                </span>
            </div>

            <ReactMarkdown
                className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white text-sm"
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}>
                {currentQuestion.question}
            </ReactMarkdown>

            <div className="grid grid-cols-2 gap-3 mt-4 mb-8">
                {currentQuestion.options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setSelectedAnswerId(option.id)}
                        type="button"
                        className={cn(
                            'py-3 rounded-lg border border-[#7D89CC] text-center disabled:opacity-75 transition-colors',
                            selectedAnswerId === option.id
                                ? 'bg-[#7D89CC]'
                                : 'bg-[#191920]'
                        )}>
                        {option.value}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <button
                    onClick={() => setIsOpenExplanation(!isOpenExplanation)}
                    disabled={isLoading}
                    type="button"
                    className="text-[#B6A6F3] font-semibold text-sm leading-tight flex items-center gap-1">
                    Lihat Jawaban{' '}
                    <ChevronDownIcon
                        className={cn(
                            'shrink-0 w-4 h-4',
                            isOpenExplanation ? '-rotate-180' : ''
                        )}
                    />
                </button>

                <div className="flex items-center gap-3">
                    <Button
                        id={PREV_QUESTION_BTN_ID}
                        disabled={
                            isFirstQuestion || !selectedAnswerId || isLoading
                        }
                        onClick={handleSubmitAnswer}
                        type="button"
                        variant="secondary"
                        className="!px-4 !py-3 flex items-center gap-2">
                        <ChevronLeftIcon className="shrink-0 w-5 h-5" />
                        Sebelumnya
                    </Button>

                    <Button
                        id={NEXT_QUESTION_BTN_ID}
                        disabled={!selectedAnswerId || isLoading}
                        onClick={handleSubmitAnswer}
                        type="button"
                        variant="primary"
                        className="!px-4 !py-3 flex items-center gap-2">
                        {isLastQuestion ? 'Jawab dan Selesai' : 'Lanjut'}
                        <ChevronRightIcon className="shrink-0 w-5 h-5" />
                    </Button>
                </div>
            </div>

            {isOpenExplanation ? (
                <div className="mt-8">
                    <div className="flex flex-col justify-center items-center gap-3 p-3 rounded-lg border border-[#7D89CC] mb-4">
                        <span className="flex items-center gap-2 leading-[160%]">
                            <FaCircleCheck className="text-[#00C8B3] shrink-0 w-4 h-4" />{' '}
                            Jawaban Benar
                        </span>

                        <span>{correctAnswer?.value}</span>
                    </div>

                    <h3 className="text-white font-semibold leading-[140%] mb-4">
                        Pembahasan Detail
                    </h3>

                    <ReactMarkdown
                        className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white text-sm"
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}>
                        {currentQuestion.question}
                    </ReactMarkdown>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

export { ExerciseQuestionList };
