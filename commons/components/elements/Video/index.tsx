import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { VideoSeekSlider } from './progress';

const VideoPlayer = ({ video }: VideoPlayerProps): JSX.Element => {
    const videoRef = useRef({} as HTMLVideoElement);
    const [, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [downloadedTime, setDownloadedTime] = useState(0);
    const [isPlay, setIsPlay] = useState(false);
    const screen = useFullScreenHandle();

    // useEffect(() => {
    //     if (video) {
    //         videoRef.current = {} as HTMLVideoElement;
    //         setCurrentTime(0);
    //         setDownloadedTime(0);
    //         setIsPlay(false);
    //     }
    // }, [video]);

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
                setDownloadedTime(buffered?.end(buffered?.length - 1));
            },
            false
        );
    }, []);

    return (
        <FullScreen handle={screen}>
            <div
                className="relative flex flex-col items-center justify-center bg-black h-full"
                id="video-container">
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
                        onFullScreen={
                            screen.active ? screen.exit : screen.enter
                        }
                        isFullScreen={screen.active}
                    />
                </div>
            </div>
        </FullScreen>
    );
};

export default VideoPlayer;
