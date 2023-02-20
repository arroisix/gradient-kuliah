import MarkedTextContent from 'commons/components/elements/MarkedTextContent';
import { useExam } from 'courses/contexts/ExamProvider';

interface AnswerChoiceProps {
    answer: string;
    is_answer?: boolean | null;
    index: number;
    id: string;
    isPicked?: boolean;
    questionType?: QuestionType;
}

const AnswerChoice = ({
    id,
    answer,
    index,
    is_answer,
    questionType
}: AnswerChoiceProps): JSX.Element => {
    const { pickAnswer, isAnswerPicked, isExamFinished, getAnswerChoiceColor } =
        useExam();

    return (
        <button
            className="flex gap-2 items-center w-full !font-body cursor-pointer text-left"
            disabled={isExamFinished}
            onClick={() => pickAnswer({ id, answer, is_answer })}>
            {(questionType === 'multiple_choice' || isExamFinished) && (
                <span className="text-2xl">
                    {String.fromCharCode(index + 65)}
                </span>
            )}
            <div
                className={`p-5 rounded-lg ${getAnswerChoiceColor(id)} w-full`}>
                <MarkedTextContent
                    content={answer}
                    className={
                        isAnswerPicked(id) && !isExamFinished
                            ? '!text-black'
                            : '!text-white'
                    }
                />
            </div>
        </button>
    );
};

export default AnswerChoice;
