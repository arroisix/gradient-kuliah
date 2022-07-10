type VideoPlayerProps = {
    video: string;
    thumbnail: string;
    height?: string;
    trackProgress?: (
        last_duration: number,
        isFinished?: boolean
    ) => Promise<any>;
};
