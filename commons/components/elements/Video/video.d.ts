type VideoPlayerProps<T> = {
    video: string;
    thumbnail: string;
    height?: string;
    trackProgress?: (
        last_duration: number,
        isFinished?: boolean
    ) => Promise<any>;
    popupData?: T[];
    popupComponent?: JSX.Element;
    autoPlay?: boolean;
    isMuxVideo?: boolean;
    token?: string;
};

interface VideoJsProps {
    src: string;
    isMuxVideo: boolean;
    trackProgress?: (
        last_duration: string,
        isFinished?: boolean
    ) => Promise<any>;
    next_subchapter_link?: string;
}
