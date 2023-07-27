import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import videojs from '@mux/videojs-kit';
import { FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/router';

// const buildSettingComponent = (element: HTMLDivElement): void => {
//     element.innerHTML = '';
//     element.className += '';
// };

const VideoJS = ({
    src,
    isMuxVideo,
    trackProgress,
    next_subchapter_link
}: {
    src: string;
    isMuxVideo: boolean;
    trackProgress?: (
        last_duration: string,
        isFinished?: boolean
    ) => Promise<any>;
    next_subchapter_link?: string;
}): JSX.Element => {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isRendered, setIsRendered] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

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
        setIsPlay(false);
        if (trackProgress) {
            await trackProgress(
                videoRef.current?.currentTime as unknown as string,
                isFinished ?? false
            );
        }
    }

    function handlePauseEvent(): void {
        handleTrackProgress();
    }

    function handleEndedEvent(): void {
        handleTrackProgress(true);
        handleNextVideo();
    }

    useEffect(() => {
        if (!isRendered) {
            setIsRendered(true);
        }

        videoRef.current?.addEventListener('playing', () => {
            setIsPlay(true);
            setIsBuffering(false);
        });

        videoRef.current?.addEventListener('waiting', () => {
            setIsBuffering(true);
        });

        videoRef.current?.addEventListener('canplay', () => setIsPlay(false));

        videoRef.current?.addEventListener('pause', handlePauseEvent);

        videoRef.current?.addEventListener('ended', handleEndedEvent);

        return function cleanUpListener() {
            videoRef.current?.removeEventListener('pause', handlePauseEvent);

            videoRef.current?.removeEventListener('ended', handleEndedEvent);

            videoRef.current?.removeEventListener('playing', () => {
                setIsPlay(true);
                setIsBuffering(false);
            });

            videoRef.current?.removeEventListener('waiting', () => {
                setIsBuffering(true);
            });

            videoRef.current?.removeEventListener('canplay', () =>
                setIsPlay(false)
            );
        };
    }, [next_subchapter_link]);

    // useEffect(() => {
    //     videoRef.current?.addEventListener('pause', () =>
    //         handleTrackProgress()
    //     );

    //     videoRef.current?.addEventListener('ended', () => {
    //         handleTrackProgress(true);
    //         handleNextVideo();
    //     });

    //     return () => {
    //         videoRef.current?.removeEventListener('pause', () =>
    //             handleTrackProgress()
    //         );

    //         videoRef.current?.removeEventListener('ended', () => {
    //             handleTrackProgress(true);
    //             handleNextVideo();
    //         });
    //     };
    // }, [next_subchapter_link]);

    useEffect(() => {
        const player = videojs(videoRef.current, {
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

        if (!isRendered) {
            player.controlBar.addChild(
                'button',
                {
                    clickHandler: handleForward,
                    className: 'button-forward material-symbols-outlined'
                },
                1
            );
            player.controlBar.addChild(
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
            player.controlBar.addChild(
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

        player.httpSourceSelector();

        player.src({
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
        <div className="relative">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
                id="my-player"
                ref={(ref) => (videoRef.current = ref)}
                className="video-js vjs-16-9 vjs-big-play-centered"
                controls
                preload="auto"
                width="100%"
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
