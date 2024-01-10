import { useEffect, useState } from 'react';
import VideoPlayer from 'commons/components/elements/Video';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/learningExperienceApi';
import { getAllVideoChapter, isContentChapterExist } from 'courses/utils';
import ListOfContent from 'courses/components/Content/ListOfContent';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import { useGetLandingCourseListContentQuery } from 'courses/redux/api/publicCourseApi';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import SubscribeButton from './SubscribeButton';
import useWindowSize from 'commons/hooks/useWindowSize';
import VideoPaywall from 'courses/components/VideoPaywall';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

interface VideoSectionProps {
    slug: string;
}

const VideoSection = ({ slug }: VideoSectionProps): JSX.Element => {
    const { data: content, isLoading: isLoadingContent } =
        useGetLandingCourseListContentQuery(slug);
    const { is_subscribed, learning_progress_id, isLoading } =
        useCourseSubscription(slug);
    const [videoPicked, setVideoPicked] = useState<Video>({} as Video);
    const isVideoContentExist = isContentChapterExist(
        content?.data ?? [],
        'video'
    );
    const [track] = useTrackSubchapterProgressMutation();
    const { width } = useWindowSize();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
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
                <div className="w-full rounded-lg lg:w-2/3 h-1/2 lg:h-full bg-neutral-600 animate-pulse" />
                <div className="w-full h-full rounded-lg lg:w-1/3 bg-neutral-600 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="w-screen py-16 flex-col px-4 md:px-[7.5rem] mb-16">
            <h2 className="mb-4 text-2xl font-bold text-center md:text-center md:text-4xl">
                Coba Gratis Video Belajar
            </h2>
            <div
                className={`flex flex-col lg:flex-row lg:h-[425px] 2xl:h-[600px] ${
                    !isVideoContentExist && 'justify-center'
                }`}>
                {isVideoContentExist && (
                    <div
                        className="flex items-center w-full h-full overflow-hidden lg:w-2/3 lg:rounded-l-xl"
                        id="video-section">
                        {videoPicked && videoPicked?.is_free ? (
                            <VideoPlayer
                                height={
                                    width >= 1536
                                        ? '600px'
                                        : width >= 1024
                                        ? '425px'
                                        : ''
                                }
                                video={videoPicked.video_url as string}
                                thumbnail={videoPicked.thumbnail as string}
                                key={videoPicked.video_url as string}
                                trackProgress={
                                    videoPicked.id !== 'trailer' &&
                                    is_subscribed &&
                                    learning_progress_id
                                        ? async (last_duration, isFinished) =>
                                              track({
                                                  learning_progress_id,
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
                        ) : isLandingPageRevampOn ? (
                            <VideoPaywall />
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
                            rounded
                            isSubscribed={is_subscribed}
                        />
                    )}
                </div>
            </div>
            <div className="flex items-center justify-center w-full pt-8">
                <SubscribeButton slug={slug} label="Akses Semua Video" />
            </div>
        </div>
    );
};

export default VideoSection;
