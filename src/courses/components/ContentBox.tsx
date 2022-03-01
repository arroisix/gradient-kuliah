import { useState } from 'react';
import VideoPlayer from 'src/commons/components/elements/Video';
import NeedSubscribe from './NeedSubscribe';
import ListOfContent from './Content/ListOfContent';
import useWindowSize from 'src/commons/hooks/useWindowSize';

interface ContentBoxProps {
    chapters: Chapter[];
    description?: string;
    trailer?: Video;
    thumbnail?: string;
}

const ContentBox = ({
    chapters,
    trailer,
    thumbnail
}: ContentBoxProps): JSX.Element => {
    const [videoPicked, setVideoPicked] = useState<Video>(trailer as Video);
    const { width } = useWindowSize();
    return (
        <div className="flex h-full flex-col lg:flex-row">
            <div className="w-full lg:w-2/3 h-full" id="video-section">
                <div className="w-full bg-neutral-900 rounded" id="video">
                    {videoPicked.isFree ? (
                        <VideoPlayer
                            height={width <= 768 ? '28vh' : undefined}
                            video={videoPicked.videoUrl as string}
                            thumbnail={videoPicked.thumbnail as string}
                        />
                    ) : (
                        <NeedSubscribe thumbnail={thumbnail} />
                    )}
                </div>
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
                    rounded
                    asThrowPage
                    trailerVideo={trailer}
                />
            </div>
        </div>
    );
};

export default ContentBox;
