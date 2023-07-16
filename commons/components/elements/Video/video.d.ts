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
};
