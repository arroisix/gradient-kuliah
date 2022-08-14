import { useLearning } from '../contexts/LearningProvider';
import ListOfContent from './Content/ListOfContent';

interface LearnContentBoxProps {
    chapters: Chapter[];
    firstTab?: number;
    isSubscribed?: boolean;
}

const LearnContentBox = ({
    chapters,
    firstTab,
    isSubscribed
}: LearnContentBoxProps): JSX.Element => {
    const {
        setSubchapter,
        setVideoPicked,
        setNotebookPicked,
        videoPicked,
        notebookPicked
    } = useLearning();
    return (
        <div className="flex h-full">
            <ListOfContent
                firstTab={firstTab}
                setSubchapter={setSubchapter}
                setNotebookPicked={setNotebookPicked}
                notebookPicked={notebookPicked}
                chapters={chapters}
                setVideoPicked={setVideoPicked}
                videoPicked={videoPicked}
                isSubscribed={isSubscribed}
                isFullHeight
            />
        </div>
    );
};

export default LearnContentBox;
