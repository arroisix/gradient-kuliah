import React, { cloneElement, useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import Spinner from '../../Spinner';
import HlsPlayer from './hls';
import { VideoSeekSlider } from './control';
import { useVideoPlayer } from '../context/VideoPlayerProvider';
import Settings from './settings';

const POPUP_BUFFER = 0.5;

const Player = <T,>({
    video,
    popupData,
    popupComponent,
    height,
    autoPlay
}: VideoPlayerProps<T>): JSX.Element => {
    const {
        videoRef,
        setCurrentTime,
        currentTime,
        setIsPlay,
        isPlay,
        onPlayClick,
        isShowControl,
        isShowSettings,
        setShowControl,
        setShowSettings,
        isBuffering,
        downloadedTime,
        isVideoLoaded
    } = useVideoPlayer();
    const [isPopup, setIsPopup] = useState(false);
    const [popupArea, setPopupArea] = useState<number[]>([]);
    const [currentPopupIndex, setCurrentPopupIndex] = useState<number>(0);
    const [nextPopup, setNextPopup] = useState<T>();
    const [hashMapPopupArea, setHashMapPopupArea] = useState<{
        [key: number]: T;
    }>({});

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

    const submitPopup = (): void => {
        setIsPopup(false);
        videoRef.current.play();
        setIsPlay(true);
    };

    return (
        <>
            <div
                onMouseEnter={() => setShowControl(true)}
                onMouseLeave={() => setShowControl(false)}
                onTouchStart={() => setShowControl(true)}
                onTouchEnd={() => setShowControl(false)}
                style={{
                    height,
                    width: '100%'
                }}
                className="relative flex flex-col items-center justify-center bg-black border border-neutral-900 overflow-hidden"
                id="video-container">
                {(isBuffering || !isPlay) && (
                    <>
                        <div className="absolute bg-black opacity-50 w-full h-[110%] left-0 top-0" />
                        <div
                            className="absolute w-full h-full left-0 top-0 z-[9] flex justify-center items-center p-8"
                            onClick={isPopup ? undefined : onPlayClick}
                            aria-hidden>
                            {(isBuffering || !isVideoLoaded) && (
                                <Spinner size="medium" />
                            )}
                            {isVideoLoaded &&
                                !isBuffering &&
                                !isPlay &&
                                !isPopup && <FaPlay className="text-4xl" />}
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
                {isShowSettings && (
                    <>
                        <div
                            className="absolute w-full h-full left-0 top-0 z-[9]"
                            onClick={() => setShowSettings(false)}
                            aria-hidden
                        />
                        <Settings isSupportHLS={video.includes('.m3u8')} />
                    </>
                )}
                {video?.includes('.m3u8') ? (
                    <HlsPlayer
                        onClick={isPopup ? undefined : onPlayClick}
                        width={'100%'}
                        height={'100%'}
                        key={video}
                        src={video}
                        autoPlay={autoPlay}
                    />
                ) : (
                    <video
                        onClick={isPopup ? undefined : onPlayClick}
                        width={'100%'}
                        height={'100%'}
                        className="object-cover"
                        ref={videoRef}
                        key={video}
                        autoPlay={autoPlay}>
                        <track kind="captions" />
                        <source src={video} />
                    </video>
                )}
                <div
                    className={`transition-opacity w-full absolute bottom-0 left-0 z-[9] ${
                        isShowControl || !isPlay ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <VideoSeekSlider
                        key={video}
                        popupArea={popupArea}
                        max={videoRef.current.duration}
                        onChange={(time) => {
                            videoRef.current.currentTime = time;
                            setCurrentTime(time);
                            checkNextPopupWhenSeekSlider(time);
                        }}
                        progress={downloadedTime}
                        offset={0}
                        secondsPrefix="00:00:"
                        minutesPrefix="00:"
                        hideHoverTime={false}
                    />
                </div>
            </div>
        </>
    );
};

export default Player;
