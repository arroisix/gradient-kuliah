import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/learningExperienceApi';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import VideoPaywall from './VideoPaywall';
import VideoJS from 'commons/components/elements/Video/VideoJS';
import Image from 'next/image';
import { isNotNullAndUndefined, queryParamBuilder } from 'commons/utils';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Spinner from 'commons/components/elements/Spinner';
import YoutubeVideo from 'commons/components/elements/Video/YoutubeVideo';
import VideoRegisterwall from './VideoRegisterWall';
import { FaPlay } from 'react-icons/fa';

interface VideoPlayerContainerProps
    extends Pick<
        SubChapter,
        'video' | 'next_subchapter_slug' | 'subchapter_name'
    > {
    isLoadingData: boolean;
}

const VideoPlayerContainer = ({
    isLoadingData = true,
    subchapter_name: title,
    video,
    next_subchapter_slug
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
    const [showRegisterwall, setIsShowRegisterwall] = useState(false);
    const isLoading = !video || isLoadingData || isLoadingSubscription;

    const isShowPaywall = !is_subscribed && !video?.is_free;
    const videoSrc = isNotNullAndUndefined(video?.mux_playback_id)
        ? `${video?.mux_playback_id as string}?${queryParamBuilder({
              token: video?.token as string
          })}`
        : (video?.video_url as string);

    const nextSubchapter = next_subchapter_slug
        ? `/kelas/${id}/${next_subchapter_slug}`
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

    const setIsShowRegisterWallHandler = async (): Promise<void> => {
        if (typeof window !== 'undefined') {
            const queryParams = new URLSearchParams(window.location.search);

            // Set new or modify existing page value
            queryParams.set('redirect', router.asPath);

            // Replace current querystring with the new one
            history.replaceState(null, '', '?' + queryParams.toString());
        }
        setIsShowRegisterwall((data) => !data);
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

    if (!isAuthenticated && video.is_free) {
        return (
            <>
                <VideoRegisterwall
                    showRegisterwall={showRegisterwall}
                    setIsShowRegisterwall={setIsShowRegisterWallHandler}
                />
                <div
                    className="relative w-full md:rounded-lg aspect-video"
                    onClick={setIsShowRegisterWallHandler}
                    aria-hidden>
                    <Image
                        src={video?.thumbnail ?? ''}
                        alt={title}
                        width={1920}
                        height={1080}
                    />
                    <div className="absolute inset-0 z-10 grid place-items-center">
                        <FaPlay className="text-4xl cursor-pointer" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <div>
            {!isShowPaywall ? (
                <div className="md:rounded-lg md:overflow-hidden">
                    {video?.is_embed_youtube ? (
                        <YoutubeVideo key={video?.video_url} src={videoSrc} />
                    ) : (
                        <VideoJS
                            key={video?.video_url}
                            src={videoSrc}
                            isMuxVideo={isNotNullAndUndefined(
                                video?.mux_playback_id
                            )}
                            trackProgress={trackProgress}
                            next_subchapter_link={nextSubchapter}
                            autoPlay={isAuthenticated}
                        />
                    )}
                </div>
            ) : (
                <VideoPaywall />
            )}
        </div>
    );
};

export default VideoPlayerContainer;
