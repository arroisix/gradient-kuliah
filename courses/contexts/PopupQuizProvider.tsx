import { useSubmitPopupQuizAnswerMutation } from 'courses/redux/api/privateCourseApi';
import React, {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState
} from 'react';

interface PopupQuizContextType {
    clickAnswerChoice: (id: string) => void;
    isPickedAnswer: (id: string) => boolean;
    submitAnswer: () => Promise<void>;
    solution?: string;
    correctAnswer?: string[];
    isSubmitLoading: boolean;
}

const PopupQuizContext = createContext<PopupQuizContextType>(
    {} as PopupQuizContextType
);

export function PopupQuizProvider({
    children,
    popupQuestion
}: {
    children: ReactNode;
    popupQuestion?: PopupQuestion;
}): JSX.Element {
    const [pickedAnswer, setPickedAnswer] = useState<string[]>([]);
    const [solution, setSolution] = useState<string>();
    const [correctAnswer, setCorrectAnswer] = useState<string[]>([]);
    const [save, { isLoading: isSubmitLoading }] =
        useSubmitPopupQuizAnswerMutation();

    const clickAnswerChoice = (id: string): void => {
        if (popupQuestion?.question.type_name === 'multiple_answer') {
            if (pickedAnswer.includes(id)) {
                setPickedAnswer((oldPickedAnswer) =>
                    oldPickedAnswer.filter((answer: string) => answer !== id)
                );
            } else {
                setPickedAnswer((oldPickedAnswer) => [...oldPickedAnswer, id]);
            }
        }

        if (popupQuestion?.question?.type_name === 'multiple_choice') {
            if (pickedAnswer.includes(id)) {
                setPickedAnswer((oldPickedAnswer) =>
                    oldPickedAnswer.filter((answer: string) => answer !== id)
                );
            } else {
                setPickedAnswer([id]);
            }
        }
    };

    const isPickedAnswer = (id: string): boolean => {
        return pickedAnswer.includes(id);
    };

    const submitAnswer = async (): Promise<void> => {
        const res = (await save({
            popup_question_id: popupQuestion?.id as string,
            popup_answer_id: pickedAnswer
        })) as unknown as SingleResponseData<PopupQuestionAnswerResponseData>;

        if (res.data) {
            setSolution(res.data.popup_question.question.solution);
            setCorrectAnswer(
                res.data.popup_question.question.answers
                    .filter((answer: ExerciseAnswer) => answer.is_answer)
                    .map((answer: ExerciseAnswer) => answer.id)
            );
        }
    };

    const memoedValue = useMemo(
        () => ({
            clickAnswerChoice,
            isPickedAnswer,
            submitAnswer,
            isSubmitLoading,
            solution,
            correctAnswer
        }),
        [pickedAnswer, isSubmitLoading, solution, correctAnswer]
    );

    return (
        <PopupQuizContext.Provider value={memoedValue}>
            {children}
        </PopupQuizContext.Provider>
    );
}

export const usePopupQuiz = (): PopupQuizContextType => {
    return useContext(PopupQuizContext);
};

export default PopupQuizContext;
