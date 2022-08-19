import React, { cloneElement, useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import Spinner from '../Spinner';
import { VideoSeekSlider } from './progress';

interface FullScreenDocumentElement extends HTMLElement {
    msRequestFullScreen?: () => void;
    mozRequestFullScreen?: () => void;
    webkitRequestFullscreen?: () => void;
}

const POPUP_BUFFER = 0.5;

const VideoPlayer = <T,>({
    video,
    trackProgress,
    popupData,
    popupComponent
}: VideoPlayerProps<T>): JSX.Element => {
    const videoRef = useRef({} as HTMLVideoElement);
    const [, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [downloadedTime, setDownloadedTime] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [isMute, setIsMute] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isPopup, setIsPopup] = useState(false);
    const [popupArea, setPopupArea] = useState<number[]>([]);
    const [currentPopupIndex, setCurrentPopupIndex] = useState<number>(0);
    const [nextPopup, setNextPopup] = useState<T>();
    const [hashMapPopupArea, setHashMapPopupArea] = useState<{
        [key: number]: T;
    }>({});

    let globalCurrentTime = currentTime;

    const onPlayClick = (): void => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlay(true);
        } else {
            videoRef.current.pause();
            setIsPlay(false);
            if (trackProgress) {
                trackProgress(videoRef.current.currentTime);
            }
        }
    };

    const onMuteClick = (): void => {
        if (videoRef.current.muted) {
            videoRef.current.muted = false;
            setIsMute(false);
        } else {
            videoRef.current.muted = true;
            setIsMute(true);
        }
    };

    const onChangeVolume = (wantedVolume: number): void => {
        videoRef.current.volume = wantedVolume / 100;
        setVolume(wantedVolume);

        if (wantedVolume > 0 && isMute) {
            videoRef.current.muted = false;
            setIsMute(false);
        }

        if (wantedVolume <= 0) {
            videoRef.current.muted = true;
            setIsMute(true);
        }
    };

    const checkNextPopupWhenSeekSlider = (time: number): void => {
        let nextCurrentIndex = 0;

        if (time - POPUP_BUFFER < popupArea[currentPopupIndex] + POPUP_BUFFER) {
            for (let i = 0; i <= currentPopupIndex && i; i += 1) {
                if (time - POPUP_BUFFER <= popupArea[i] + POPUP_BUFFER) {
                    nextCurrentIndex = i;
                } else {
                    break;
                }
            }
        }

        if (time - POPUP_BUFFER > popupArea[currentPopupIndex] + POPUP_BUFFER) {
            for (let i = currentPopupIndex; i < popupArea.length; i += 1) {
                if (time - POPUP_BUFFER <= popupArea[i] + POPUP_BUFFER) {
                    nextCurrentIndex = i;
                    break;
                }
            }
        }

        if (nextCurrentIndex >= 0) {
            setCurrentPopupIndex(nextCurrentIndex);
            setNextPopup(hashMapPopupArea[popupArea[nextCurrentIndex]]);
        }
    };

    useEffect(() => {
        videoRef.current.addEventListener(
            'canplay',
            () => {
                setDuration(videoRef?.current?.duration / 60);
            },
            false
        );

        videoRef.current.addEventListener(
            'timeupdate',
            function () {
                const calculatedCurrentTime = videoRef?.current?.currentTime;
                // eslint-disable-next-line react-hooks/exhaustive-deps
                globalCurrentTime = calculatedCurrentTime;
                const buffered = videoRef?.current?.buffered;
                setCurrentTime(calculatedCurrentTime);
                setDownloadedTime(buffered?.end(buffered?.length - 1));
            },
            false
        );

        videoRef.current.addEventListener('waiting', () => {
            setIsBuffering(true);
        });

        videoRef.current.addEventListener('playing', () => {
            setIsBuffering(false);
        });

        videoRef.current.addEventListener('ended', () => {
            if (trackProgress) {
                trackProgress(videoRef.current.currentTime, true);
            }
        });
    }, []);

    useEffect(() => {
        if (popupData) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore

            const sortedTimingPopup = popupData
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                .map((data: T) => data.popup_timing)
                .sort((a: number, b: number) => a - b) as number[];

            setPopupArea(sortedTimingPopup);

            const hashMapPopDataByTiming: { [key: number]: T } = {};

            popupData.forEach(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                (data: T) => (hashMapPopDataByTiming[data.popup_timing] = data)
            );

            setHashMapPopupArea(hashMapPopDataByTiming);

            setNextPopup(hashMapPopDataByTiming[sortedTimingPopup[0]]);
        }
    }, [popupData]);

    useEffect(() => {
        return () => {
            if (trackProgress) {
                console.log(globalCurrentTime);
            }
        };
    }, [trackProgress]);

    useEffect(() => {
        if (popupData) {
            if (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                currentTime >= nextPopup?.popup_timing &&
                currentTime <=
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    nextPopup?.popup_timing + POPUP_BUFFER * 3 &&
                popupArea[currentPopupIndex] < currentTime
            ) {
                videoRef.current.pause();
                setIsPopup(true);
                setIsPlay(false);

                setCurrentPopupIndex(currentPopupIndex + 1);
                setNextPopup(
                    hashMapPopupArea[popupArea[currentPopupIndex + 1]]
                );
            }
        }
    }, [currentTime]);

    const onFullScreen = (): void => {
        const div = document.getElementById(
            'video-container'
        ) as FullScreenDocumentElement;

        setFullscreen(!fullscreen);
        if (!document.fullscreenElement) {
            if (div?.requestFullscreen) {
                div?.requestFullscreen();
            } else if (div?.webkitRequestFullscreen) {
                div?.webkitRequestFullscreen();
            } else if (div?.msRequestFullScreen) {
                div?.msRequestFullScreen();
            }
        } else {
            document.exitFullscreen();
        }
    };

    const submitPopup = (): void => {
        setIsPopup(false);
        videoRef.current.play();
        setIsPlay(true);
    };

    return (
        <div
            className="relative flex flex-col items-center justify-center bg-black"
            id="video-container">
            {(isBuffering || !isPlay) && (
                <>
                    <div className="absolute bg-black opacity-50 w-full h-full left-0 top-0 z-[8]" />
                    <div
                        className="absolute w-full h-full left-0 top-0 z-[9] flex justify-center items-center p-8"
                        onClick={isPopup ? undefined : onPlayClick}
                        aria-hidden>
                        {isBuffering && isPlay && <Spinner size="large" />}
                        {!isPlay && !isPopup && <FaPlay className="text-4xl" />}
                        {popupComponent &&
                            !isPlay &&
                            isPopup &&
                            cloneElement(popupComponent, {
                                onSubmit: submitPopup,
                                data: hashMapPopupArea[
                                    popupArea[currentPopupIndex - 1]
                                ]
                            })}
                    </div>
                </>
            )}
            <video
                onClick={isPopup ? undefined : onPlayClick}
                width={'100%'}
                height={'100%'}
                ref={videoRef}
                key={video}>
                <track kind="captions" />
                <source src={video} />
            </video>
            <div className="w-full absolute bottom-0 left-0">
                <VideoSeekSlider
                    key={video}
                    currentTime={currentTime}
                    popupArea={popupArea}
                    max={videoRef.current.duration}
                    onChange={(time) => {
                        videoRef.current.currentTime = time;
                        setCurrentTime(time);
                        checkNextPopupWhenSeekSlider(time);
                    }}
                    progress={downloadedTime}
                    offset={0}
                    isPlay={isPlay}
                    isMute={isMute}
                    volume={volume}
                    setVolume={onChangeVolume}
                    secondsPrefix="00:00:"
                    minutesPrefix="00:"
                    hideHoverTime={false}
                    onPlay={onPlayClick}
                    onMute={onMuteClick}
                    onFullScreen={onFullScreen}
                    isFullScreen={fullscreen}
                    isBuffering={isBuffering}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
