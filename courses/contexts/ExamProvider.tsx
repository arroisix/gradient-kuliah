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

interface ExamContextType {
    is_subscribed?: boolean;
    learning_progress_id?: string;
    problemQuestion?: ExamQuestion;
    questionId: string;
    worksheetId: string;
    answers: ExamAnswer[];
    pickAnswer: (answer: ExamAnswer) => void;
    isAnswerPicked: (answer_id: string) => boolean;
    submitAnswer: () => Promise<void>;
    questionSequences: string[];
    getCurrentQuestionNumber: (questionId?: string) => number;
    getNextQuestion: () => void;
    getPrevQuestion: () => void;
    goToQuestion: (questionId: string) => void;
    isQuestionHasAnswer: (questionId: string) => boolean;
    isCurrentAnswerSameWithSavedAnswer: () => boolean;
    isLoadingAnswer: boolean;
    finishExam: () => Promise<void>;
    expandTiles: boolean;
    setExpandTiles: (status: boolean) => void;
}

const ExamContext = createContext<ExamContextType>({} as ExamContextType);

export function ExamProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const router = useRouter();
    const { id, worksheet, question } = router.query;
    const { is_subscribed, learning_progress_id } = useCourseSubscription(
        id as string
    );
    const [submitAnswerMutation, { isLoading: isLoadingAnswer }] =
        useSubmitExamAnswerMutation();
    const [finishExamMutation] = useFinishExamMutation();
    const { data } = useGetExamQuestionQuery(
        {
            worksheet_id: worksheet as string,
            question_id: question as string
        },
        {
            skip:
                question === undefined ||
                question === null ||
                worksheet === undefined ||
                worksheet === null,
            refetchOnMountOrArgChange: true
        }
    );
    const { data: questionSequence } = useGetExamListQuestionSequenceQuery(
        worksheet as string,
        {
            skip: worksheet === undefined || worksheet === null
        }
    );
    const problemQuestion = data?.question;
    const questionSequences =
        questionSequence?.questions.map(
            (question: ExamQuestionSequence) => question.id
        ) ?? [];
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
            `/kelas/${id}/belajar/latihan/${worksheet as string}/${
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
            `/kelas/${id}/belajar/latihan/${worksheet as string}/${
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
            `/kelas/${id}/belajar/latihan/${worksheet as string}/${questionId}`
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

    const submitAnswer = async (): Promise<void> => {
        await submitAnswerMutation({
            worksheet_id: worksheet as string,
            question_id: question as string,
            answers: answers.map((answer: ExamAnswer) => answer.id)
        });

        const questionIndex = questionSequences?.indexOf(question as string);

        if (questionIndex + 1 >= questionSequences.length) {
            return undefined;
        }

        router.push(
            `/kelas/${id}/belajar/latihan/${worksheet as string}/${
                questionSequences[questionIndex + 1]
            }`
        );
    };

    const finishExam = async (): Promise<void> => {
        const res = await finishExamMutation(worksheet as string);

        console.log(res);

        router.push(`/kelas/${id}`);
    };

    const getCurrentQuestionNumber = (questionId?: string): number => {
        if (questionId) {
            return questionSequences?.indexOf(questionId) + 1;
        }

        return questionSequences?.indexOf(question as string) + 1;
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
            setExpandTiles
        }),
        [
            is_subscribed,
            learning_progress_id,
            problemQuestion,
            answers,
            questionSequences,
            isLoadingAnswer,
            expandTiles
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
