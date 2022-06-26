import { useState } from 'react';
import VideoPlayer from 'commons/components/elements/Video';
import NeedSubscribe from './NeedSubscribe';
import ListOfContent from './Content/ListOfContent';
import useWindowSize from 'commons/hooks/useWindowSize';

interface ContentBoxProps {
    chapters: Chapter[];
    description?: string;
    trailer?: Video;
    thumbnail?: string;
    isSubscribed?: boolean;
}

const ContentBox = ({
    chapters,
    trailer,
    thumbnail,
    isSubscribed
}: ContentBoxProps): JSX.Element => {
    const [videoPicked, setVideoPicked] = useState<Video>(trailer as Video);
    const [notebookPicked, setNotebookPicked] = useState<Notebook>(
        {} as Notebook
    );
    const { width } = useWindowSize();
    return (
        <div className="flex h-full flex-col lg:flex-row">
            <div className="w-full lg:w-2/3 h-full" id="video-section">
                {videoPicked.is_free || isSubscribed ? (
                    <div className="w-full bg-neutral-900 rounded" id="video">
                        <VideoPlayer
                            height={width <= 768 ? '28vh' : undefined}
                            video={videoPicked.video_url as string}
                            thumbnail={videoPicked.thumbnail as string}
                            key={videoPicked.video_url as string}
                        />
                    </div>
                ) : (
                    <NeedSubscribe thumbnail={thumbnail} />
                )}
                <div className="my-4" id="description">
                    <p>{videoPicked.description}</p>
                </div>
            </div>
            <div className="w-[32px]" />
            <div className="w-full lg:w-1/3 h-3/4" id="content-section">
                <ListOfContent
                    chapters={chapters}
                    videoPicked={videoPicked}
                    setVideoPicked={setVideoPicked}
                    notebookPicked={notebookPicked}
                    setNotebookPicked={setNotebookPicked}
                    rounded
                    trailerVideo={trailer}
                    isSubscribed={isSubscribed}
                />
            </div>
        </div>
    );
};

export default ContentBox;
