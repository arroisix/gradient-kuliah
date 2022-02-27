import { BsChevronBarLeft } from 'react-icons/bs';
import { useLearning } from '../contexts/LearningProvider';
import ListOfContent from './Content/ListOfContent';

interface LearnContentBoxProps {
    chapters: Chapter[];
    setHide: (status: boolean) => void;
    hide: boolean;
    firstTab?: number;
}

const LearnContentBox = ({
    chapters,
    setHide,
    hide,
    firstTab
}: LearnContentBoxProps): JSX.Element => {
    const {
        setSubchapterName,
        setVideoPicked,
        setNotebookPicked,
        videoPicked,
        notebookPicked
    } = useLearning();
    return (
        <div className={`flex h-full relative`}>
            <div
                className={`absolute top-0 ${
                    hide ? 'right-0' : '-left-12'
                } bg-neutral-800 h-12 w-12 flex justify-center items-center`}
                onClick={() => setHide(!hide)}
                aria-hidden>
                <BsChevronBarLeft className="text-neutral-100" />
            </div>
            {!hide && (
                <ListOfContent
                    firstTab={firstTab}
                    setSubchapterName={setSubchapterName}
                    setNotebookPicked={setNotebookPicked}
                    notebookPicked={notebookPicked}
                    chapters={chapters}
                    setVideoPicked={setVideoPicked}
                    videoPicked={videoPicked}
                />
            )}
        </div>
    );
};

export default LearnContentBox;
