import { ExerciseQuestion } from 'copilot/types/copilot';
import { useEffect, useRef, useState } from 'react';
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

function initUserQuestionAnswer() {
    return new Map<string, string>();
}

interface ExerciseQuestionListProps {
    isForModal?: boolean;
    currentSessionId: string;
    message_id: string;
    exercise_questions: ExerciseQuestion[];
}

function ExerciseQuestionList({
    isForModal = false,
    currentSessionId,
    message_id,
    exercise_questions
}: ExerciseQuestionListProps): JSX.Element {
    const exerciseStartRef = useRef<HTMLDivElement | null>(null);
    const exerciseEndRef = useRef<HTMLDivElement | null>(null);

    const [userQuestionAnswer, setUserQuestionAnswer] = useState<
        Map<string, string>
    >(initUserQuestionAnswer);
    const [isOpenExplanation, setIsOpenExplanation] = useState(false);
    const [selectedAnswerId, setSelectedAnswerId] = useState('');
    const [currentQuestionId, setCurrentQuestionId] = useState(
        exercise_questions[0].id
    );

    const currentQuestion = exercise_questions.find(
        (v) => v.id === currentQuestionId
    );
    const isSingleQuestion = exercise_questions.length === 1;
    const isFirstQuestion = exercise_questions[0].id === currentQuestion?.id;
    const isLastQuestion =
        exercise_questions[exercise_questions.length - 1].id ===
        currentQuestion?.id;
    const correctAnswer = currentQuestion?.options.find(
        (v) => v.id === currentQuestion.answer
    );

    const [submitAnswer, { isLoading }] = useUpdateExerciseAnswerMutation();

    // populate user question answer
    useEffect(() => {
        for (const v of exercise_questions) {
            setUserQuestionAnswer((value) => {
                value.set(v.id, v.user_answer ?? '');
                return new Map(value);
            });
        }
    }, [exercise_questions]);

    // scroll to bottom if explanation opened for better UX
    useEffect(() => {
        if (isOpenExplanation) {
            exerciseEndRef.current?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        } else {
            exerciseStartRef.current?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }, [isOpenExplanation]);

    // update selected answer id as question changed
    useEffect(() => {
        setSelectedAnswerId(
            userQuestionAnswer.get(currentQuestion?.id ?? '') ?? ''
        );
    }, [currentQuestion, userQuestionAnswer]);

    if (!currentQuestion) {
        return <></>;
    }

    const handleClickPrev = () => {
        const currentQuestionIdx = exercise_questions.indexOf(currentQuestion);
        const prevQuestion = exercise_questions[currentQuestionIdx - 1];
        setCurrentQuestionId(prevQuestion.id);
        setIsOpenExplanation(false);
    };

    const handleClickNext = () => {
        const currentQuestionIdx = exercise_questions.indexOf(currentQuestion);
        const nextQuestion = exercise_questions[currentQuestionIdx + 1];
        setCurrentQuestionId(nextQuestion.id);
        setIsOpenExplanation(false);
    };

    const handleSelectAnswer = async (answerId: string) => {
        try {
            await submitAnswer({
                session_id: currentSessionId,
                message_id,
                answer: answerId,
                question_id: currentQuestion.id
            });

            setUserQuestionAnswer((value) => {
                value.set(currentQuestion.id, answerId);
                return new Map(value);
            });
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
        <>
            <div ref={exerciseStartRef} />
            <div
                key={currentQuestion.id}
                className={cn(
                    'animate-fade animate-duration-500 bg-[#191920] p-6 rounded-2xl w-full',
                    isForModal ? '' : 'lg:max-w-[680px]'
                )}>
                {!isSingleQuestion ? (
                    <div
                        className={cn(
                            'flex flex-col-reverse mb-4 gap-1',
                            isForModal
                                ? ''
                                : 'lg:flex-row lg:justify-between lg:items-center'
                        )}>
                        <span></span>
                        <span className="text-[#999999] text-sm leading-[160%]">
                            {currentQuestion.no} dari{' '}
                            {exercise_questions.length}
                        </span>
                    </div>
                ) : (
                    <></>
                )}

                <ReactMarkdown
                    className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white text-sm"
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}>
                    {currentQuestion.question}
                </ReactMarkdown>

                <div
                    className={cn(
                        'grid gap-3 mt-4 mb-4',
                        isForModal ? '' : 'lg:grid-cols-2 lg:mb-8'
                    )}>
                    {currentQuestion.options.map((option) => (
                        <button
                            disabled={isLoading}
                            key={option.id}
                            onClick={() => handleSelectAnswer(option.id)}
                            type="button"
                            className={cn(
                                'text-white py-3 rounded-lg border border-[#7D89CC] text-center disabled:opacity-75 transition-colors',
                                isLoading ? 'bg-opacity-75' : '',
                                selectedAnswerId === option.id
                                    ? 'bg-[#7D89CC]'
                                    : 'bg-[#191920]'
                            )}>
                            {option.value}
                        </button>
                    ))}
                </div>

                <div
                    className={cn(
                        'flex flex-col-reverse gap-3',
                        isForModal
                            ? ''
                            : 'lg:flex-row lg:justify-between lg:items-center lg:gap-6'
                    )}>
                    <button
                        onClick={() => setIsOpenExplanation(!isOpenExplanation)}
                        disabled={isLoading}
                        type="button"
                        className="self-center text-[#B6A6F3] font-semibold text-sm leading-tight flex items-center gap-1 py-2">
                        Lihat Jawaban{' '}
                        <ChevronDownIcon
                            className={cn(
                                'shrink-0 w-4 h-4',
                                isOpenExplanation ? '-rotate-180' : ''
                            )}
                        />
                    </button>

                    <div
                        className={cn(
                            'flex justify-between items-center gap-3 w-full',
                            isForModal ? '' : 'lg:w-fit'
                        )}>
                        {!isSingleQuestion ? (
                            <Button
                                disabled={isFirstQuestion || isLoading}
                                onClick={handleClickPrev}
                                type="button"
                                variant="secondary"
                                className={cn(
                                    '!p-0 w-[46px] h-[46px] grid place-items-center',
                                    isForModal
                                        ? ''
                                        : 'lg:w-fit lg:h-fit lg:!px-4 lg:!py-2 lg:flex lg:items-center lg:gap-2'
                                )}>
                                <ChevronLeftIcon className="shrink-0 w-5 h-5" />
                                <span
                                    className={cn(
                                        'hidden',
                                        isForModal ? '' : 'lg:block'
                                    )}>
                                    Sebelumnya
                                </span>
                            </Button>
                        ) : (
                            <></>
                        )}

                        {!isLastQuestion && !isSingleQuestion ? (
                            <Button
                                disabled={!selectedAnswerId || isLoading}
                                onClick={handleClickNext}
                                type="button"
                                variant="primary"
                                className={cn(
                                    '!px-4 !py-2 flex items-center gap-2',
                                    isSingleQuestion
                                        ? 'w-full justify-center'
                                        : ''
                                )}>
                                {isSingleQuestion
                                    ? 'Jawab'
                                    : isLastQuestion
                                    ? 'Selesai'
                                    : 'Lanjut'}
                                <ChevronRightIcon className="shrink-0 w-5 h-5" />
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                {isOpenExplanation ? (
                    <div
                        className={cn(
                            'animate-fade animate-duration-500 mt-6',
                            isForModal ? '' : 'lg:mt-8'
                        )}>
                        <div className="flex flex-col justify-center items-center gap-3 p-3 rounded-lg border border-[#7D89CC] mb-4">
                            <span className="text-white text-sm flex items-center gap-2 leading-[160%]">
                                <FaCircleCheck className="text-[#00C8B3] shrink-0 w-4 h-4" />{' '}
                                Jawaban Benar
                            </span>

                            <span className="text-white font-semibold leading-[140%]">
                                {correctAnswer?.value}
                            </span>
                        </div>

                        <h3 className="text-white font-semibold leading-[140%] mb-4">
                            Pembahasan Detail
                        </h3>

                        <ReactMarkdown
                            className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white text-sm"
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}>
                            {currentQuestion.explanation}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div ref={exerciseEndRef} />
        </>
    );
}

export { ExerciseQuestionList };
