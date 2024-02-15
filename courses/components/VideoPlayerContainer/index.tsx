import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/learningExperienceApi';
import { useRouter } from 'next/router';
import React from 'react';
import VideoPaywall from './VideoPaywall';
import VideoJS from 'commons/components/elements/Video/VideoJS';
import Image from 'next/image';
import { isNotNullAndUndefined, queryParamBuilder } from 'commons/utils';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Spinner from 'commons/components/elements/Spinner';

interface VideoPlayerContainerProps
    extends Pick<SubChapter, 'video' | 'next_subchapter' | 'subchapter_name'> {
    isLoadingData: boolean;
}

const VideoPlayerContainer = ({
    isLoadingData = true,
    subchapter_name: title,
    video,
    next_subchapter
}: VideoPlayerContainerProps): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const {
        learning_progress_id,
        isLoading: isLoadingSubscription,
        is_subscribed
    } = useCourseSubscription(id as string);
    const [track] = useTrackSubchapterProgressMutation();
    const isLoading = !video || isLoadingData || isLoadingSubscription;

    const isShowPaywall = !is_subscribed && !video?.is_free;
    const videoSrc = isNotNullAndUndefined(video?.mux_playback_id)
        ? `${video?.mux_playback_id as string}?${queryParamBuilder({
              token: video?.token as string
          })}`
        : (video?.video_url as string);

    const nextSubchapter =
        next_subchapter?.chapter_id && next_subchapter.id
            ? `/kelas/${id}/belajar/video/${next_subchapter?.chapter_id}/${next_subchapter?.id}`
            : '';

    const trackProgress = async (
        last_duration: string,
        isFinished?: boolean
    ): Promise<void> => {
        if (!isAuthenticated) return;

        track({
            learning_progress_id: learning_progress_id as string,
            video_progress: {
                video_id: video?.id as string,
                last_duration: last_duration as unknown as string,
                is_finished: isFinished ?? false
            }
        });
    };

    if (isLoading)
        return (
            <div className="relative w-full md:rounded-lg aspect-video">
                <Image
                    src={video?.thumbnail ?? ''}
                    alt={title}
                    width={1920}
                    height={1080}
                />
                <div className="absolute inset-0 z-10 grid place-items-center">
                    <Spinner size="medium" />
                </div>
            </div>
        );

    return (
        <div>
            {!isShowPaywall ? (
                <div className="md:rounded-lg md:overflow-hidden">
                    <VideoJS
                        key={video?.video_url}
                        src={videoSrc}
                        isMuxVideo={isNotNullAndUndefined(
                            video?.mux_playback_id
                        )}
                        trackProgress={trackProgress}
                        next_subchapter_link={nextSubchapter}
                    />
                </div>
            ) : (
                <VideoPaywall />
            )}
        </div>
    );
};

export default VideoPlayerContainer;
