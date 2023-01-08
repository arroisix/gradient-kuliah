import { useLearning } from '../contexts/LearningProvider';
import ListOfContent from './Content/ListOfContent';

interface LearnContentBoxProps {
    chapters: Chapter[];
    firstTab?: number;
    isSubscribed?: boolean;
    slug: string;
    extraCallback?: () => void;
}

const LearnContentBox = ({
    slug,
    chapters,
    firstTab,
    isSubscribed,
    extraCallback
}: LearnContentBoxProps): JSX.Element => {
    const { video } = useLearning();

    return (
        <div className="flex h-full">
            {chapters && (
                <ListOfContent
                    extraCallback={extraCallback}
                    slug={slug}
                    firstTab={firstTab}
                    chapters={chapters}
                    videoPicked={video as Video}
                    isSubscribed={isSubscribed}
                    isFullHeight
                />
            )}
        </div>
    );
};

export default LearnContentBox;
