import ListQuestion from './ListQuestion';
import QuestionTextArea from './QuestionTextArea';

const QnaSection = (): JSX.Element => {
    return (
        <div className="w-full py-4 px-4 md:px-0">
            <QuestionTextArea key="question" />
            <ListQuestion key="list-question" />
        </div>
    );
};

export default QnaSection;
