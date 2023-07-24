import { useEffect, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import videojs from '@mux/videojs-kit';

const VideoJS = ({
    src,
    isMuxVideo
}: {
    src: string;
    isMuxVideo: boolean;
}): JSX.Element => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const player = videojs(videoRef.current, {
            plugins: {
                mux: {
                    debug: false,
                    data: {
                        env_key: 'ENV_KEY',
                        video_title: 'Example Title'
                    }
                },
                httpSourceSelector: {
                    default: 'auto'
                }
            }
        });

        player.httpSourceSelector();

        player.src({
            src: src,
            type: isMuxVideo ? 'video/mux' : ''
        });
    }, [isMuxVideo, src]);

    return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
            id="my-player"
            ref={(ref) => (videoRef.current = ref)}
            className="video-js vjs-16-9"
            controls
            preload="auto"
            width="100%"
        />
    );
};

export default VideoJS;
