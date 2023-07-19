import React from 'react';
import { VideoProvider } from './context/VideoPlayerProvider';
import Player from './components/player';

const VideoPlayer = <T,>({
    height,
    thumbnail,
    video,
    trackProgress,
    popupData,
    popupComponent,
    autoPlay,
    isMuxVideo,
    token
}: VideoPlayerProps<T>): JSX.Element => {
    return (
        <VideoProvider trackProgress={trackProgress} autoPlay={autoPlay}>
            <Player
                token={token}
                autoPlay={autoPlay}
                height={height}
                thumbnail={thumbnail}
                video={video}
                isMuxVideo={isMuxVideo}
                trackProgress={trackProgress}
                popupData={popupData}
                popupComponent={popupComponent}
            />
        </VideoProvider>
    );
};

export default VideoPlayer;
