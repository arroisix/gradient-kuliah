import MarkedTextContent from 'commons/components/elements/MarkedTextContent';
import { useExam } from 'courses/contexts/ExamProvider';

interface AnswerChoiceProps {
    answer: string;
    is_answer?: boolean | null;
    index: number;
    id: string;
    isPicked?: boolean;
}

const AnswerChoice = ({
    id,
    answer,
    index,
    is_answer
}: AnswerChoiceProps): JSX.Element => {
    const { pickAnswer, isAnswerPicked } = useExam();

    return (
        <button
            className="flex gap-2 items-center w-full !font-body cursor-pointer text-left"
            onClick={() => pickAnswer({ id, answer, is_answer })}>
            <span className="text-2xl">{String.fromCharCode(index + 65)}</span>
            <div
                className={`p-5 rounded-lg ${
                    isAnswerPicked(id)
                        ? 'bg-white'
                        : 'bg-[#1D1D1D] hover:bg-[#323232]'
                } w-full`}>
                <MarkedTextContent
                    content={answer}
                    className={
                        isAnswerPicked(id) ? '!text-black' : '!text-white'
                    }
                />
            </div>
        </button>
    );
};

export default AnswerChoice;
