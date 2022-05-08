import React, { useEffect, useRef, useState } from 'react';
import { VideoSeekSlider } from './progress';

interface FullScreenDocumentElement extends HTMLElement {
    msRequestFullScreen?: () => void;
    mozRequestFullScreen?: () => void;
    webkitRequestFullscreen?: () => void;
}

const VideoPlayer = ({ video }: VideoPlayerProps): JSX.Element => {
    const videoRef = useRef({} as HTMLVideoElement);
    const [, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [downloadedTime, setDownloadedTime] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [isPlay, setIsPlay] = useState(false);

    const onPlayClick = (): void => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlay(true);
        } else {
            videoRef.current.pause();
            setIsPlay(false);
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
                const buffered = videoRef?.current?.buffered;
                setCurrentTime(calculatedCurrentTime);
                setDownloadedTime(buffered.end(buffered.length - 1));
            },
            false
        );
    }, []);

    const onFullScreen = () => {
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
            className="relative flex flex-col items-center justify-center"
            id="video-container">
            <video onClick={onPlayClick} width={'100%'} ref={videoRef}>
                <track kind="captions" />
                <source src={video} />
            </video>
            <div className="w-full absolute bottom-0 left-0">
                <VideoSeekSlider
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
                    hideHoverTime
                    onPlay={onPlayClick}
                    onFullScreen={onFullScreen}
                    isFullScreen={fullscreen}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
