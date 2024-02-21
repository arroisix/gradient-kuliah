import { useEffect, useState } from 'react';
import VideoPlayer from 'commons/components/elements/Video';
import NeedSubscribe from './NeedSubscribe';
import ListOfContent from './Content/ListOfContent';
import useWindowSize from 'commons/hooks/useWindowSize';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/learningExperienceApi';
import { getAllVideoChapter, isContentChapterExist } from 'courses/utils';
import VideoPaywall from './VideoPlayerContainer/VideoPaywall';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

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
    const isVideoContentExist = isContentChapterExist(chapters, 'video');
    const { width } = useWindowSize();
    const [track] = useTrackSubchapterProgressMutation();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

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
                <div className="w-full h-full lg:w-2/3" id="video-section">
                    {videoPicked?.is_free || isSubscribed ? (
                        <div
                            className="w-full rounded bg-neutral-900"
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
                                                  learning_progress_id:
                                                      learningProgress?.id as string,
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
                    ) : isLandingPageRevampOn ? (
                        <VideoPaywall />
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
                    rounded
                    isSubscribed={isSubscribed}
                />
            </div>
        </div>
    );
};

export default ContentBox;
