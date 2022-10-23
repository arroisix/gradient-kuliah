import React from 'react';
import { VideoProvider } from './context/VideoPlayerProvider';
import Player from './components/player';

const VideoPlayer = <T,>({
    height,
    thumbnail,
    video,
    trackProgress,
    popupData,
    popupComponent
}: VideoPlayerProps<T>): JSX.Element => {
    return (
        <VideoProvider trackProgress={trackProgress}>
            <Player
                height={height}
                thumbnail={thumbnail}
                video={video}
                trackProgress={trackProgress}
                popupData={popupData}
                popupComponent={popupComponent}
            />
        </VideoProvider>
    );
};

export default VideoPlayer;
