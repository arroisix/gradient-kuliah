import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import videojs from '@mux/videojs-kit';
import { FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';
import { useLearning } from 'courses/contexts/LearningProvider';
import { useDebounceCallback } from 'usehooks-ts';

// const buildSettingComponent = (element: HTMLDivElement): void => {
//     element.innerHTML = '';
//     element.className += '';
// };

const VideoJS = ({
    src,
    isMuxVideo,
    trackProgress,
    next_subchapter_link,
    autoPlay
}: {
    src: string;
    isMuxVideo: boolean;
    autoPlay?: boolean;
    trackProgress?: (
        last_duration: string,
        isFinished?: boolean
    ) => Promise<any>;
    next_subchapter_link?: string;
}): JSX.Element => {
    const tracker = useTracker();
    const { subchapter } = useLearning();
    const router = useRouter();
    const playerRef = useRef<any | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoContainerRef = useRef<HTMLDivElement | null>(null);
    const [isRendered, setIsRendered] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    let trackInterval: NodeJS.Timeout | undefined;

    function handleForward(): void {
        if (videoRef.current?.currentTime) {
            videoRef.current.currentTime += 10;
        }
    }

    function handleBackward(): void {
        if (videoRef.current?.currentTime) {
            videoRef.current.currentTime -= 10;
        }
    }

    function handleNextVideo(): void {
        if (next_subchapter_link) router.push(next_subchapter_link);
    }

    async function handleTrackProgress(isFinished?: boolean): Promise<void> {
        if (trackProgress && videoRef.current?.currentTime) {
            console.log(
                `Tracking progress: ${videoRef.current.currentTime} seconds`
            );
            await trackProgress(
                videoRef.current?.currentTime as unknown as string,
                isFinished ?? false
            );
        }
    }
    const debouncedHandleTrackProgress = useDebounceCallback(
        handleTrackProgress,
        2000
    );

    useLayoutEffect(() => {
        function handlePauseEvent(): void {
            tracker?.genericTrack('Pause Video', {
                'Course Slug': router.query.id,
                'Video Title': subchapter?.subchapter_name
            });
            setIsPlay(false);
            debouncedHandleTrackProgress();
            clearInterval(trackInterval);
        }

        function handleEndedEvent(): void {
            setIsPlay(false);
            debouncedHandleTrackProgress(true);
            handleNextVideo();
            clearInterval(trackInterval);
        }

        function handlePlayingEvent(): void {
            tracker?.genericTrack('Play Video', {
                'Course Slug': router.query.id,
                'Video Title': subchapter?.subchapter_name
            });
            debouncedHandleTrackProgress();
            setIsPlay(true);
            setIsBuffering(false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            trackInterval = setInterval(() => {
                debouncedHandleTrackProgress();
            }, 30000);
        }

        function handleWaitingEvent(): void {
            setIsBuffering(true);
        }

        function handleCanPlayEvent(): void {
            setIsPlay(false);
        }

        function handleFullscreenEvent(): void {
            if (document.fullscreenElement) {
                tracker?.genericTrack('Click Fullscreen', {
                    'Course Slug': router.query.id,
                    'Video Title': subchapter?.subchapter_name
                });
            }
        }

        if (!isRendered) {
            setIsRendered(true);
        }

        const videoContainerEl = videoContainerRef.current;
        videoContainerEl?.addEventListener(
            'fullscreenchange',
            handleFullscreenEvent
        );

        const videoEl = videoRef.current;
        videoEl?.addEventListener('playing', handlePlayingEvent);

        videoEl?.addEventListener('waiting', handleWaitingEvent);

        videoEl?.addEventListener('canplay', handleCanPlayEvent);

        videoEl?.addEventListener('pause', handlePauseEvent);

        videoEl?.addEventListener('ended', handleEndedEvent);

        return () => {
            debouncedHandleTrackProgress();

            videoContainerEl?.removeEventListener(
                'fullscreenchange',
                handleFullscreenEvent
            );

            videoEl?.removeEventListener('pause', handlePauseEvent);

            videoEl?.removeEventListener('ended', handleEndedEvent);

            videoEl?.removeEventListener('playing', handlePlayingEvent);

            videoEl?.removeEventListener('waiting', handleWaitingEvent);

            videoEl?.removeEventListener('canplay', handleCanPlayEvent);

            clearInterval(trackInterval);
        };
    }, [next_subchapter_link]);

    useEffect(() => {
        let player = playerRef.current;

        if (!player) {
            player = playerRef.current = videojs(videoRef.current, {
                userActions: {
                    hotkeys: function (event: any) {
                        // eslint-disable-next-line @typescript-eslint/no-this-alias
                        const thisPlayer: any = this;

                        // `f` key = toggle fullscreen
                        if (event.which === 70) {
                            if (thisPlayer.isFullscreen()) {
                                thisPlayer.exitFullscreen();
                            } else {
                                thisPlayer.requestFullscreen();
                            }
                        }
                        // `i` key = PIP
                        if (event.which === 73) {
                            thisPlayer.requestPictureInPicture();
                        }
                        // `m` key = mute
                        if (event.which === 77) {
                            if (videoRef.current) {
                                if (videoRef.current?.muted) {
                                    videoRef.current.muted = false;
                                } else {
                                    videoRef.current.muted = true;
                                }
                            }
                        }
                        // `space` key = toggle play/pause
                        if (event.which === 32) {
                            if (videoRef.current?.paused) {
                                videoRef.current?.play();
                                setIsPlay(true);
                            } else {
                                videoRef.current?.pause();
                                setIsPlay(false);
                            }
                        }
                        // `right arrow` key = forward
                        if (event.which === 39) {
                            handleForward();
                        }
                        // `left arrow` key = backward
                        if (event.which === 37) {
                            handleBackward();
                        }
                    }
                },
                playbackRates: [0.5, 0.75, 1, 1.5, 2],
                controlBar: {
                    remainingTimeDisplay: false
                },
                plugins: {
                    mux: {
                        data: {
                            env_key: 'ENV_KEY',
                            video_title: 'Example Title'
                        }
                    },
                    httpSourceSelector: {
                        default: 'auto'
                    }
                }
            });
        }

        if (!isRendered) {
            player?.controlBar.addChild(
                'button',
                {
                    clickHandler: handleForward,
                    className: 'button-forward material-symbols-outlined'
                },
                1
            );
            player?.controlBar.addChild(
                'button',
                {
                    clickHandler: handleBackward,
                    className: 'button-backward material-symbols-outlined'
                },
                1
            );
            // const buttonSetting = player.controlBar.addChild(
            //     'menu',
            //     {
            //         className: 'button-settings material-symbols-rounded'
            //     },
            //     15
            // );
            player?.controlBar.addChild(
                'menu',
                {
                    className: 'control-spacer'
                },
                10
            );

            // const element = document.createElement('div');
            // buildSettingComponent(element);
            // buttonSetting.el_.appendChild(element);
        }

        player?.httpSourceSelector();

        player?.src({
            src: src,
            type: isMuxVideo ? 'video/mux' : ''
        });

        window.onkeydown = function (e) {
            if (e.keyCode === 32 && e.target === videoRef.current) {
                e.preventDefault();
                return false;
            }
            return;
        };
    }, [isMuxVideo, src]);

    return (
        <div className="relative" ref={videoContainerRef}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
                id="my-player"
                ref={(ref) => (videoRef.current = ref)}
                className="video-js vjs-16-9 vjs-big-play-centered"
                controls
                preload="auto"
                width="100%"
                autoPlay={autoPlay}
            />
            {!isPlay && (
                <>
                    <div className="absolute bg-black opacity-50 w-full h-full left-0 top-0 pointer-events-none" />
                    <div
                        className="absolute w-full h-full left-0 top-0 z-[9] flex justify-center items-center p-8 pointer-events-none"
                        aria-hidden>
                        {!isBuffering && (
                            <FaPlay className="text-4xl pointer-events-none" />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoJS;
