import { useExam } from 'courses/contexts/ExamProvider';

const QuestionTile = ({ question }: { question: string }): JSX.Element => {
    const {
        goToQuestion,
        getCurrentQuestionNumber,
        questionId,
        isQuestionHasAnswer,
        getColorQuestionTile
    } = useExam();
    return (
        <button
            className={`h-20 w-20 ${
                isQuestionHasAnswer(question)
                    ? getColorQuestionTile(question)
                    : 'bg-[#2C2C2C] hover:bg-[#373737]'
            } rounded-lg ${
                questionId === question
                    ? isQuestionHasAnswer(question)
                        ? 'border-4 border-neutral-600'
                        : 'border-4 border-white'
                    : ''
            }`}
            key={question}
            onClick={() => goToQuestion(question)}>
            <span className="text-4xl font-bold">
                {getCurrentQuestionNumber(question)}
            </span>
        </button>
    );
};

export default QuestionTile;
