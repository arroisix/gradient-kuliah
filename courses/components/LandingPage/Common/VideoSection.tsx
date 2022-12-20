import { useEffect, useState } from 'react';
import VideoPlayer from 'commons/components/elements/Video';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/privateCourseApi';
import { getAllVideoChapter, isContentChapterExist } from 'courses/utils';
import ListOfContent from 'courses/components/Content/ListOfContent';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import { useGetLandingCourseListContentQuery } from 'courses/redux/api/publicCourseApi';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import SubscribeButton from './SubscribeButton';
import useWindowSize from 'commons/hooks/useWindowSize';

interface VideoSectionProps {
    slug: string;
}

const VideoSection = ({ slug }: VideoSectionProps): JSX.Element => {
    const { data: content, isLoading: isLoadingContent } =
        useGetLandingCourseListContentQuery(slug);
    const { is_subscribed, learning_progress_id, isLoading } =
        useCourseSubscription(slug);
    const [videoPicked, setVideoPicked] = useState<Video>({} as Video);
    const [notebookPicked, setNotebookPicked] = useState<Notebook>(
        {} as Notebook
    );
    const isVideoContentExist = isContentChapterExist(
        content?.data ?? [],
        'video'
    );
    const [track] = useTrackSubchapterProgressMutation();
    const { width } = useWindowSize();

    useEffect(() => {
        if (content?.data) {
            const videoChapters = getAllVideoChapter(content?.data);
            if (
                videoChapters.length > 0 &&
                videoChapters[0].subchapters.length > 0
            ) {
                setVideoPicked(videoChapters[0].subchapters[0].video as Video);
            }
        }
    }, [content?.data]);

    if (isLoading || isLoadingContent) {
        return (
            <div className="w-screen py-16 flex-col px-4 md:px-[7.5rem] mb-16 h-[70vh] flex lg:flex-row gap-4">
                <div className="w-full lg:w-2/3 h-1/2 lg:h-full bg-neutral-600 animate-pulse rounded-lg" />
                <div className="w-full lg:w-1/3 h-full bg-neutral-600 animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className="w-screen py-16 flex-col px-4 md:px-[7.5rem] mb-16">
            <h1 className="md:text-center text-2xl md:text-4xl font-bold text-center mb-4">
                Coba Gratis Video Belajar
            </h1>
            <div
                className={`flex flex-col lg:flex-row lg:max-h-[50vh] ${
                    !isVideoContentExist && 'justify-center'
                }`}>
                {isVideoContentExist && (
                    <div
                        className="w-full lg:w-2/3 h-full flex items-center lg:rounded-l-xl overflow-hidden"
                        id="video-section">
                        {videoPicked && videoPicked?.is_free ? (
                            <VideoPlayer
                                height={width >= 1024 ? '50vh' : ''}
                                video={videoPicked.video_url as string}
                                thumbnail={videoPicked.thumbnail as string}
                                key={videoPicked.video_url as string}
                                trackProgress={
                                    videoPicked.id !== 'trailer' &&
                                    is_subscribed &&
                                    learning_progress_id
                                        ? async (last_duration, isFinished) =>
                                              track({
                                                  subchapter_id:
                                                      videoPicked.subchapter_id as string,
                                                  learning_progress_id,
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
                        ) : (
                            <NeedSubscribe thumbnail={'https://google.com'} />
                        )}
                    </div>
                )}
                <div className="w-full lg:w-1/3" id="content-section">
                    {content?.data && (
                        <ListOfContent
                            slug={slug}
                            chapters={content?.data}
                            videoPicked={videoPicked}
                            setVideoPicked={setVideoPicked}
                            notebookPicked={notebookPicked}
                            setNotebookPicked={setNotebookPicked}
                            rounded
                            isSubscribed={is_subscribed}
                            asThrowPage
                        />
                    )}
                </div>
            </div>
            <div className="w-full flex justify-center items-center pt-8">
                <SubscribeButton slug={slug} label="Akses Semua Video" />
            </div>
        </div>
    );
};

export default VideoSection;
