/* eslint-disable jsx-a11y/media-has-caption */
import { useRef, useState } from 'react';
import useVideoPlayer from './useVideoPlayer';
import { MdOutlinePlayCircleFilled, MdPauseCircleFilled } from 'react-icons/md';

const VideoPlayer = ({
    video,
    thumbnail
}: {
    video: string;
    thumbnail: string;
}): JSX.Element => {
    const element = useRef(null);
    const {
        playerState,
        togglePlay,
        handleOnTimeUpdate,
        handleVideoProgress
        // handleVideoSpeed,
        // toggleMute
    } = useVideoPlayer(element);
    const [showPause, setShowPuase] = useState(false);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[435px]">
            <video
                className=""
                src={video}
                ref={element}
                onTimeUpdate={handleOnTimeUpdate}
                poster={thumbnail}
            />
            {/* {!playerState.isPlaying && (
                <div className="w-full h-full bg-black absolute top-0 flex justify-center items-center opacity-40" />
            )} */}
            <div
                className="w-full absolute top-0 flex justify-center items-center cursor-pointer"
                onClick={togglePlay}
                onMouseEnter={() => setShowPuase(true)}
                onMouseLeave={() => setShowPuase(false)}
                aria-hidden>
                <button>
                    {!playerState.isPlaying && (
                        <MdOutlinePlayCircleFilled className="text-7xl" />
                    )}
                </button>
                <button>
                    {playerState.isPlaying && showPause && (
                        <MdPauseCircleFilled className="text-7xl" />
                    )}
                </button>
            </div>

            <div className="controls bg-red-50">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={playerState.progress}
                    onChange={(e) => handleVideoProgress(e)}
                />
                {/* <select
                        className="velocity"
                        value={playerState.speed}
                        onChange={(e) => handleVideoSpeed(e)}>
                        <option value="0.50">0.50x</option>
                        <option value="1">1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="2">2x</option>
                    </select> */}
                {/* <button className="mute-btn" onClick={toggleMute}>
                        {!playerState.isMuted ? (
                            <i className="bx bxs-volume-full">Y</i>
                        ) : (
                            <i className="bx bxs-volume-mute">N</i>
                        )}
                    </button> */}
            </div>
        </div>
    );
};

export default VideoPlayer;
