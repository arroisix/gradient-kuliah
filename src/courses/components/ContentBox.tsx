import { useState } from 'react';
import VideoPlayer from 'src/commons/components/elements/Video';
import NeedSubscribe from './NeedSubscribe';
import ListOfContent from './Content/ListOfContent';

interface ContentBoxProps {
    chapters: Chapter[];
    description?: string;
    trailer?: string;
    thumbnail?: string;
}

const ContentBox = ({
    chapters,
    trailer,
    thumbnail
}: ContentBoxProps): JSX.Element => {
    const [videoPicked, setVideoPicked] = useState<Video>({
        id: 'trailer',
        isFree: true,
        videoUrl: trailer as string,
        thumbnail: thumbnail as string,
        description:
            'Amet minim mollit non deserunt ullamco est sit aliqu dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
        duration: ''
    });
    return (
        <div className="flex h-full">
            <div className="w-2/3 h-full" id="video-section">
                <div
                    className="w-full bg-neutral-900 rounded min-h-[435px]"
                    id="video">
                    {videoPicked.isFree ? (
                        <VideoPlayer
                            video={videoPicked.videoUrl as string}
                            thumbnail={videoPicked.thumbnail as string}
                        />
                    ) : (
                        <NeedSubscribe thumbnail={thumbnail} />
                    )}
                </div>
                <div className="" id="description">
                    <p>{videoPicked.description}</p>
                </div>
            </div>
            <div className="w-[32px]" />
            <div className="w-1/3 h-3/4" id="content-section">
                <ListOfContent
                    chapters={chapters}
                    videoPicked={videoPicked}
                    setVideoPicked={setVideoPicked}
                    rounded
                    asThrowPage
                    trailerVideo={{
                        id: 'trailer',
                        isFree: true,
                        videoUrl: trailer as string,
                        thumbnail: thumbnail as string,
                        description:
                            'Amet minim mollit non deserunt ullamco est sit aliqu dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
                        duration: ''
                    }}
                />
            </div>
        </div>
    );
};

export default ContentBox;
