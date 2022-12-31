import { useLearning } from '../contexts/LearningProvider';
import ListOfContent from './Content/ListOfContent';

interface LearnContentBoxProps {
    chapters: Chapter[];
    firstTab?: number;
    isSubscribed?: boolean;
    slug: string;
}

const LearnContentBox = ({
    slug,
    chapters,
    firstTab,
    isSubscribed
}: LearnContentBoxProps): JSX.Element => {
    const { video } = useLearning();

    return (
        <div className="flex h-full">
            {chapters && (
                <ListOfContent
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
