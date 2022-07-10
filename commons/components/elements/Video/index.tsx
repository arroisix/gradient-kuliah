import React, { useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import Spinner from '../Spinner';
import { VideoSeekSlider } from './progress';

interface FullScreenDocumentElement extends HTMLElement {
    msRequestFullScreen?: () => void;
    mozRequestFullScreen?: () => void;
    webkitRequestFullscreen?: () => void;
}

const VideoPlayer = ({
    video,
    trackProgress
}: VideoPlayerProps): JSX.Element => {
    const videoRef = useRef({} as HTMLVideoElement);
    const [, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [downloadedTime, setDownloadedTime] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

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
        return () => {
            if (trackProgress) {
                console.log(globalCurrentTime);
            }
        };
    }, [trackProgress]);

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

    return (
        <div
            className="relative flex flex-col items-center justify-center bg-black"
            id="video-container">
            {(isBuffering || !isPlay) && (
                <>
                    <div className="absolute bg-black opacity-50 w-full h-full left-0 top-0 z-[5]" />
                    <div
                        className="absolute w-full h-full left-0 top-0 z-[5] flex justify-center items-center"
                        onClick={onPlayClick}
                        aria-hidden>
                        {isBuffering && <Spinner size="large" />}
                        {!isPlay && <FaPlay className="text-4xl" />}
                    </div>
                </>
            )}
            <video
                onClick={onPlayClick}
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
                    max={videoRef.current.duration}
                    onChange={(time) => {
                        videoRef.current.currentTime = time;
                        setCurrentTime(time);
                    }}
                    progress={downloadedTime}
                    offset={0}
                    isPlay={isPlay}
                    secondsPrefix="00:00:"
                    minutesPrefix="00:"
                    hideHoverTime={false}
                    onPlay={onPlayClick}
                    onFullScreen={onFullScreen}
                    isFullScreen={fullscreen}
                    isBuffering={isBuffering}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
