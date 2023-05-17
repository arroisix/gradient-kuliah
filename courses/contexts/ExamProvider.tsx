import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import {
    useFinishExamMutation,
    useGetExamListQuestionSequenceQuery,
    useGetExamQuestionQuery,
    useSubmitExamAnswerMutation
} from 'courses/redux/api/learningExperienceApi';
import { useRouter } from 'next/router';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { toast } from 'react-toastify';

interface ExamContextType {
    is_subscribed?: boolean;
    learning_progress_id?: string;
    problemQuestion?: ExamQuestion;
    questionId: string;
    worksheetId: string;
    answers: ExamAnswer[];
    pickAnswer: (answer: ExamAnswer) => void;
    isAnswerPicked: (answer_id: string) => boolean;
    submitAnswer: ({
        preventChangeRoute
    }: {
        preventChangeRoute?: boolean;
    }) => Promise<void>;
    questionSequences: string[];
    getCurrentQuestionNumber: (questionId?: string) => number;
    getNextQuestion: () => void;
    getPrevQuestion: () => void;
    goToQuestion: (questionId: string) => void;
    isQuestionHasAnswer: (questionId: string) => boolean;
    getColorQuestionTile: (questionId: string) => string;
    isCurrentAnswerSameWithSavedAnswer: () => boolean;
    isLoadingAnswer: boolean;
    finishExam: () => Promise<void>;
    expandTiles: boolean;
    isExamFinished: boolean;
    setExpandTiles: (status: boolean) => void;
    isCurrentQuestionLastQuestion: () => boolean;
    getAnswerChoiceColor: (answerId: string) => string;
}

const ExamContext = createContext<ExamContextType>({} as ExamContextType);

export function ExamProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const router = useRouter();
    const { id, exercise, worksheet, question } = router.query;
    const { is_subscribed, learning_progress_id } = useCourseSubscription(
        id as string
    );
    const [submitAnswerMutation, { isLoading: isLoadingAnswer }] =
        useSubmitExamAnswerMutation();
    const [finishExamMutation] = useFinishExamMutation();
    const { data } = useGetExamQuestionQuery(
        {
            worksheet_id: worksheet as string,
            question_id: question as string,
            exercise_id: exercise as string
        },
        {
            skip:
                question === undefined ||
                question === null ||
                exercise === undefined ||
                exercise === null ||
                worksheet === undefined ||
                worksheet === null,
            refetchOnMountOrArgChange: true
        }
    );
    const { data: questionSequence } = useGetExamListQuestionSequenceQuery(
        { exerciseId: exercise as string, worksheetId: worksheet as string },
        {
            skip:
                worksheet === undefined ||
                worksheet === null ||
                exercise === undefined ||
                exercise === null
        }
    );
    const problemQuestion = data?.question;
    const questionSequences =
        questionSequence?.questions.map(
            (question: ExamQuestionSequence) => question.id
        ) ?? [];
    const isExamFinished = questionSequence?.is_finished ?? false;
    const [answers, setAnswer] = useState<ExamAnswer[]>([]);
    const [expandTiles, setExpandTiles] = useState(false);

    useEffect(() => {
        if (data?.user_answer !== null && data?.user_answer !== undefined) {
            setAnswer(data?.user_answer.answers as ExamAnswer[]);
        } else {
            setAnswer([]);
        }
    }, [data]);

    const isAnswerPicked = (answerId: string): boolean => {
        return (
            answers?.filter(
                (userAnswer: ExamAnswer) => answerId === userAnswer.id
            ).length > 0
        );
    };

    const isCurrentAnswerSameWithSavedAnswer = (): boolean => {
        return (
            JSON.stringify(answers) ===
            JSON.stringify(data?.user_answer?.answers)
        );
    };

    const isCurrentQuestionLastQuestion = (): boolean => {
        const currentNumber = getCurrentQuestionNumber();

        return currentNumber === questionSequences.length;
    };

    const getNextQuestion = async (): Promise<void> => {
        if (answers.length > 0 && !isCurrentAnswerSameWithSavedAnswer()) {
            await submitAnswerMutation({
                worksheet_id: worksheet as string,
                question_id: question as string,
                answers: answers.map((answer: ExamAnswer) => answer.id)
            });
        }
        const questionIndex = questionSequences?.indexOf(question as string);

        if (questionIndex + 1 >= questionSequences.length) {
            return undefined;
        }

        router.push(
            `/kelas/${id}/belajar/latihan/${exercise}/${worksheet as string}/${
                questionSequences[questionIndex + 1]
            }`
        );
    };

    const getPrevQuestion = async (): Promise<void> => {
        if (answers.length > 0 && !isCurrentAnswerSameWithSavedAnswer()) {
            await submitAnswerMutation({
                worksheet_id: worksheet as string,
                question_id: question as string,
                answers: answers.map((answer: ExamAnswer) => answer.id)
            });
        }
        const questionIndex = questionSequences?.indexOf(question as string);

        if (questionIndex - 1 < 0) {
            return undefined;
        }

        router.push(
            `/kelas/${id}/belajar/latihan/${exercise}/${worksheet as string}/${
                questionSequences[questionIndex - 1]
            }`
        );
    };

    const goToQuestion = async (questionId: string): Promise<void> => {
        if (answers.length > 0 && !isCurrentAnswerSameWithSavedAnswer()) {
            await submitAnswerMutation({
                worksheet_id: worksheet as string,
                question_id: question as string,
                answers: answers.map((answer: ExamAnswer) => answer.id)
            });
        }
        router.push(
            `/kelas/${id}/belajar/latihan/${exercise}/${
                worksheet as string
            }/${questionId}`
        );
    };

    const isQuestionHasAnswer = (questionId: string): boolean => {
        const questionSeq =
            questionSequence?.questions.filter(
                (question: ExamQuestionSequence) => question.id === questionId
            ) ?? [];

        if (questionSeq?.length > 0) {
            return questionSeq[0].is_answered;
        }

        return false;
    };

    const getColorQuestionTile = (questionId: string): string => {
        const questionSeq =
            questionSequence?.questions.filter(
                (question: ExamQuestionSequence) => question.id === questionId
            ) ?? [];

        const question = questionSeq[0];

        if (question.is_correct !== null) {
            if (question.is_correct) {
                return 'bg-green-500 hover:bg-green-400 text-white';
            }

            return 'bg-red-500 hover:bg-red-400 text-white';
        }

        return 'bg-white text-black';
    };

    const pickAnswer = (answer: ExamAnswer): void => {
        if (isAnswerPicked(answer.id)) {
            setAnswer(
                answers.filter(
                    (current: ExamAnswer) => current.id !== answer.id
                )
            );
        } else {
            if (problemQuestion?.type_name === 'multiple_answer') {
                setAnswer([...answers, answer]);
            } else {
                setAnswer([answer]);
            }
        }
    };

    const submitAnswer = async ({
        preventChangeRoute = false
    }: {
        preventChangeRoute?: boolean;
    }): Promise<void> => {
        if (answers.length > 0) {
            await submitAnswerMutation({
                worksheet_id: worksheet as string,
                question_id: question as string,
                answers: answers.map((answer: ExamAnswer) => answer.id)
            });
        }

        if (!preventChangeRoute) {
            const questionIndex = questionSequences?.indexOf(
                question as string
            );

            if (questionIndex + 1 >= questionSequences.length) {
                return undefined;
            }

            router.push(
                `/kelas/${id}/belajar/latihan/${exercise}/${
                    worksheet as string
                }/${questionSequences[questionIndex + 1]}`
            );
        }
    };

    const finishExam = async (): Promise<void> => {
        const res = await finishExamMutation(worksheet as string);

        if (res) {
            router.push(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                `/kelas/${id}/belajar/latihan/${exercise}/hasil/${res?.data?.learning_progress_id}/${res?.data?.packet_id}`
            );
        } else {
            toast.error('Gagal Menyelesaikan Tes');
        }
    };

    const getCurrentQuestionNumber = (questionId?: string): number => {
        if (questionId) {
            return questionSequences?.indexOf(questionId) + 1;
        }

        return questionSequences?.indexOf(question as string) + 1;
    };

    const getAnswerChoiceColor = (answerId: string): string => {
        const userAnswerFilter =
            problemQuestion?.answers.filter(
                (answer: ExamAnswer) => answer.id === answerId
            ) ?? [];

        if (userAnswerFilter?.length > 0) {
            const userAnswer = userAnswerFilter[0];

            if (userAnswer.is_answer !== null) {
                if (userAnswer.is_answer) {
                    return 'bg-green-500';
                }

                if (isAnswerPicked(answerId)) {
                    return 'bg-red-500';
                }
            }
        }

        if (isAnswerPicked(answerId)) {
            return 'bg-white';
        }

        if (isExamFinished) {
            return '';
        }

        return 'bg-[#1D1D1D] hover:bg-[#323232]';
    };

    const memoedValue = useMemo(
        () => ({
            is_subscribed,
            learning_progress_id,
            problemQuestion,
            answers,
            questionSequences,
            pickAnswer,
            isAnswerPicked,
            submitAnswer,
            getCurrentQuestionNumber,
            getNextQuestion,
            getPrevQuestion,
            goToQuestion,
            isQuestionHasAnswer,
            isCurrentAnswerSameWithSavedAnswer,
            isLoadingAnswer,
            finishExam,
            expandTiles,
            setExpandTiles,
            isCurrentQuestionLastQuestion,
            getColorQuestionTile,
            isExamFinished,
            getAnswerChoiceColor
        }),
        [
            is_subscribed,
            learning_progress_id,
            problemQuestion,
            answers,
            questionSequences,
            isLoadingAnswer,
            expandTiles,
            isExamFinished
        ]
    );

    return (
        <ExamContext.Provider
            value={{
                ...memoedValue,
                worksheetId: worksheet as string,
                questionId: question as string
            }}>
            {children}
        </ExamContext.Provider>
    );
}

export const useExam = (): ExamContextType => {
    return useContext(ExamContext);
};

export default ExamContext;
