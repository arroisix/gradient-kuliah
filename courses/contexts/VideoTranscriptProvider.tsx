import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState
} from 'react';

interface VideoTranscriptContextType {
    videoTimestamp: number;
    isPlaying: boolean;
    setVideoTimestamp: Dispatch<SetStateAction<number>>;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

const VideoTranscriptContext = createContext<VideoTranscriptContextType | null>(
    null
);

function VideoTranscriptProvider({ children }: PropsWithChildren): JSX.Element {
    const [videoTimestamp, setVideoTimestamp] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const value = useMemo((): VideoTranscriptContextType => {
        return { videoTimestamp, isPlaying, setVideoTimestamp, setIsPlaying };
    }, [isPlaying, videoTimestamp]);

    return (
        <VideoTranscriptContext.Provider value={value}>
            {children}
        </VideoTranscriptContext.Provider>
    );
}

function useVideoTranscriptContext(): VideoTranscriptContextType {
    const context = useContext(VideoTranscriptContext);
    if (!context) {
        throw new Error(
            'useVideoTranscriptContext must be used within a VideoTranscriptContext.Provider'
        );
    }
    return context;
}

export { VideoTranscriptProvider, useVideoTranscriptContext };
