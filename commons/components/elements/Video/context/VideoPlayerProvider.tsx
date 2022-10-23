import useIdleDetector from 'commons/hooks/useIdleDetector';
import React, {
    createContext,
    MutableRefObject,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

interface FullScreenDocumentElement extends HTMLElement {
    msRequestFullScreen?: () => void;
    mozRequestFullScreen?: () => void;
    webkitRequestFullscreen?: () => void;
}

interface VideoContextType {
    videoRef: MutableRefObject<HTMLVideoElement>;
    duration: number;
    setDuration: (duration: number) => void;
    currentTime: number;
    setCurrentTime: (currentTime: number) => void;
    downloadedTime: number;
    setDownloadedTime: (downloadedTime: number) => void;
    fullscreen: boolean;
    setFullscreen: (fullscreen: boolean) => void;
    isShowControl: boolean;
    setShowControl: (isShowControl: boolean) => void;
    isPlay: boolean;
    setIsPlay: (isPlay: boolean) => void;
    isMute: boolean;
    setIsMute: (isMute: boolean) => void;
    volume: number;
    setVolume: (volume: number) => void;
    playback: number;
    setPlayback: (playback: number) => void;
    isShowSettings: boolean;
    setShowSettings: (setting: boolean) => void;
    isBuffering: boolean;
    setIsBuffering: (isBuffering: boolean) => void;
    quality: number;
    setQuality: (quality: number) => void;
    onPlayClick: () => void;
    onMuteClick: () => void;
    onChangeVolume: (wantedVolume: number) => void;
    onFullScreen: () => void;
    isVideoLoaded: boolean;
}

const VideoContext = createContext<VideoContextType>({} as VideoContextType);

export function VideoProvider({
    children,
    trackProgress
}: {
    children: ReactNode;
    trackProgress?: (
        last_duration: number,
        isFinished?: boolean
    ) => Promise<any>;
}): JSX.Element {
    const videoRef = useRef({} as HTMLVideoElement);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [downloadedTime, setDownloadedTime] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [isShowControl, setShowControl] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [isMute, setIsMute] = useState(false);
    const [volume, setVolume] = useState(50);
    const [playback, setPlayback] = useState(1);
    const [isShowSettings, setShowSettings] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [quality, setQuality] = useState(-1);
    useIdleDetector({
        activityEvents: [
            'click',
            'keydown',
            'DOMMouseScroll',
            'mousewheel',
            'mousedown',
            'touchstart',
            'touchmove',
            'focus',
            'mousemove'
        ],
        onIdle: () => setShowControl(false),
        onActive: () => setShowControl(true),
        enabled: true,
        timeout: 3000
    });
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

    useEffect(() => {
        videoRef.current.addEventListener(
            'canplay',
            () => {
                setDuration(videoRef?.current?.duration / 60);
                setIsVideoLoaded(true);
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
                try {
                    setDownloadedTime(buffered?.end(buffered?.length - 1));
                } catch {
                    console.info('Quality Video Changed Manually');
                }
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
        videoRef.current.playbackRate = playback;
    }, [playback]);

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

    const memoedValue = useMemo(
        () => ({
            videoRef,
            setDuration,
            duration,
            setCurrentTime,
            currentTime,
            setDownloadedTime,
            downloadedTime,
            setFullscreen,
            fullscreen,
            setIsBuffering,
            isBuffering,
            setIsMute,
            isMute,
            setIsPlay,
            isPlay,
            setPlayback,
            playback,
            setQuality,
            quality,
            setShowControl,
            isShowControl,
            setShowSettings,
            isShowSettings,
            setVolume,
            volume,
            onPlayClick,
            onChangeVolume,
            onFullScreen,
            onMuteClick,
            isVideoLoaded
        }),
        [
            videoRef,
            duration,
            currentTime,
            downloadedTime,
            fullscreen,
            isBuffering,
            isMute,
            isPlay,
            playback,
            quality,
            isShowControl,
            isShowSettings,
            volume,
            isVideoLoaded
        ]
    );

    return (
        <VideoContext.Provider value={memoedValue}>
            {children}
        </VideoContext.Provider>
    );
}

export const useVideoPlayer = (): VideoContextType => {
    return useContext(VideoContext);
};

export default VideoContext;
