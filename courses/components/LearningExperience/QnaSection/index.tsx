import ListQuestion from './ListQuestion';
import QuestionTextArea from './QuestionTextArea';

const QnaSection = (): JSX.Element => {
    return (
        <div className="w-full py-4 px-4 md:px-0">
            <QuestionTextArea />
            <ListQuestion />
        </div>
    );
};

export default QnaSection;
