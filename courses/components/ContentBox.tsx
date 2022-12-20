import { useEffect, useState } from 'react';
import VideoPlayer from 'commons/components/elements/Video';
import NeedSubscribe from './NeedSubscribe';
import ListOfContent from './Content/ListOfContent';
import useWindowSize from 'commons/hooks/useWindowSize';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/privateCourseApi';
import { getAllVideoChapter, isContentChapterExist } from 'courses/utils';

interface ContentBoxProps {
    slug: string;
    chapters: Chapter[];
    description?: string;
    trailer?: Video;
    thumbnail?: string;
    isSubscribed?: boolean;
    learningProgress?: LearningProgress;
}

const ContentBox = ({
    slug,
    chapters,
    trailer,
    thumbnail,
    isSubscribed,
    learningProgress
}: ContentBoxProps): JSX.Element => {
    const [videoPicked, setVideoPicked] = useState<Video>(trailer as Video);
    const [notebookPicked, setNotebookPicked] = useState<Notebook>(
        {} as Notebook
    );
    const isVideoContentExist = isContentChapterExist(chapters, 'video');
    const { width } = useWindowSize();
    const [track] = useTrackSubchapterProgressMutation();

    useEffect(() => {
        if (chapters) {
            const videoChapters = getAllVideoChapter(chapters);
            if (
                videoChapters.length > 0 &&
                videoChapters[0].subchapters.length > 0
            ) {
                setVideoPicked(videoChapters[0].subchapters[0].video as Video);
            }
        }
    }, [chapters]);

    return (
        <div
            className={`flex h-full flex-col lg:flex-row ${
                !isVideoContentExist && 'justify-center'
            }`}>
            {isVideoContentExist && (
                <div className="w-full lg:w-2/3 h-full" id="video-section">
                    {videoPicked?.is_free || isSubscribed ? (
                        <div
                            className="w-full bg-neutral-900 rounded"
                            id="video">
                            <VideoPlayer
                                height={width <= 768 ? '28vh' : undefined}
                                video={videoPicked.video_url as string}
                                thumbnail={videoPicked.thumbnail as string}
                                key={videoPicked.video_url as string}
                                trackProgress={
                                    videoPicked.id !== 'trailer' && isSubscribed
                                        ? async (last_duration, isFinished) =>
                                              track({
                                                  subchapter_id:
                                                      videoPicked.subchapter_id as string,
                                                  learning_progress_id:
                                                      learningProgress?.id as string,
                                                  progress_type: 'VIDEO',
                                                  video_progress: {
                                                      video_id: videoPicked.id,
                                                      last_duration:
                                                          last_duration as unknown as string,
                                                      is_finished:
                                                          isFinished ?? false
                                                  }
                                              })
                                        : undefined
                                }
                            />
                        </div>
                    ) : (
                        <NeedSubscribe thumbnail={thumbnail} />
                    )}
                    <div className="my-4" id="description">
                        <p>{videoPicked?.description}</p>
                    </div>
                </div>
            )}
            {isVideoContentExist && <div className="w-[32px]" />}
            <div className="w-full lg:w-1/3 h-3/4" id="content-section">
                <ListOfContent
                    slug={slug}
                    chapters={chapters}
                    videoPicked={videoPicked}
                    setVideoPicked={setVideoPicked}
                    notebookPicked={notebookPicked}
                    setNotebookPicked={setNotebookPicked}
                    rounded
                    trailerVideo={trailer}
                    isSubscribed={isSubscribed}
                    asThrowPage
                />
            </div>
        </div>
    );
};

export default ContentBox;
