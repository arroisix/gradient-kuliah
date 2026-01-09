import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/learningExperienceApi';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
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
import dynamic from 'next/dynamic';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetSubchapterDetailV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicSubchapterDetailV2Query } from 'courses/redux/api/publicCourseV2Api';

const BitmovinPlayer = dynamic(
    () => import('commons/components/elements/Video/BitmovinPlayer'),
    {
        ssr: false,
        loading: () => (
            <div className="relative w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <Spinner size="medium" />
            </div>
        )
    }
);

interface VideoPlayerContainerProps
    extends Pick<
        SubChapter,
        | 'video'
        | 'next_subchapter_slug'
        | 'subchapter_name'
        | 'next_chapter_slug'
    > {
    isLoadingData: boolean;
}

const VideoPlayerContainer = ({
    isLoadingData = true,
    subchapter_name: title,
    video,
    next_chapter_slug,
    next_subchapter_slug
}: VideoPlayerContainerProps): JSX.Element => {
    const router = useRouter();
    const slug = useMemo(() => {
        if (Object.hasOwn(router.query, 'id')) {
            return router.query.id as string;
        }
        if (Object.hasOwn(router.query, 'slug_subtest')) {
            return router.query.slug_subtest as string;
        }
        return '';
    }, [router.query]);
    const { profile } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const {
        learning_progress_id,
        isLoading: isLoadingSubscription,
        is_subscribed,
        subscribedFeatures
    } = useCourseSubscription(slug);
    const [track] = useTrackSubchapterProgressMutation();
    const [showRegisterwall, setIsShowRegisterwall] = useState(false);
    const isLoading = !video || isLoadingData || isLoadingSubscription;

    const isShowPaywall = useMemo((): boolean => {
        if (profile?.current_role === 'COLLEGE_STUDENT') {
            return !is_subscribed && !video?.is_free;
        }

        return (
            (!is_subscribed && !video?.is_free) ||
            (is_subscribed &&
                !video?.is_free &&
                !subscribedFeatures?.includes('material'))
        );
    }, [
        is_subscribed,
        profile?.current_role,
        subscribedFeatures,
        video?.is_free
    ]);

    const shouldUseBitmovinPlayer = video?.is_drm_protected;

    const videoSrc = shouldUseBitmovinPlayer
        ? video?.drm_video_url
        : isNotNullAndUndefined(video?.mux_playback_id)
        ? `${video?.mux_playback_id as string}?${queryParamBuilder({
              token: video?.token as string
          })}`
        : (video?.video_url as string);

    const privateSubchapterDetails = useGetSubchapterDetailV2Query(
        { course_slug: slug, subchapter_slug: next_subchapter_slug ?? '' },
        { skip: !slug || !next_subchapter_slug || !isAuthenticated }
    );

    const publicSubchapterDetails = useGetPublicSubchapterDetailV2Query(
        { course_slug: slug, subchapter_slug: next_subchapter_slug ?? '' },
        { skip: !slug || !next_subchapter_slug || isAuthenticated }
    );

    const { data: nextSubchapter } = isAuthenticated
        ? privateSubchapterDetails
        : publicSubchapterDetails;

    const nextSubchapterLink = useMemo(() => {
        if (Object.hasOwn(router.query, 'slug_subtest')) {
            return next_subchapter_slug
                ? `/utbk/materi/${slug}/${next_chapter_slug}/${next_subchapter_slug}`
                : '';
        }

        return next_subchapter_slug
            ? `/kelas/${slug}/${next_subchapter_slug}`
            : '';
    }, [next_chapter_slug, next_subchapter_slug, router.query, slug]);

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
            queryParams.set('redirect', router.asPath);
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
                <div className="absolute inset-0 grid place-items-center">
                    <Spinner size="medium" />
                </div>
            </div>
        );

    if (!isAuthenticated && video?.is_free) {
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
                        <YoutubeVideo
                            key={video?.video_url}
                            src={videoSrc || ''}
                        />
                    ) : shouldUseBitmovinPlayer ? (
                        <BitmovinPlayer
                            key={video?.drm_video_url}
                            src={videoSrc || ''}
                            drmToken={video?.drm_token as string}
                            trackProgress={trackProgress}
                            next_subchapter_link={nextSubchapterLink}
                            autoPlay={isAuthenticated}
                            next_subchapter_name={
                                nextSubchapter?.subchapter_name
                            }
                            next_subchapter_thumbnail={
                                nextSubchapter?.thumbnail
                            }
                        />
                    ) : (
                        <VideoJS
                            key={video?.video_url}
                            src={videoSrc || ''}
                            isMuxVideo={isNotNullAndUndefined(
                                video?.mux_playback_id
                            )}
                            trackProgress={trackProgress}
                            next_subchapter_link={nextSubchapterLink}
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
