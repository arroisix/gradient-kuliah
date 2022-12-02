import React, { useEffect, useState } from 'react';
import Hls from 'hls.js';
import { useVideoPlayer } from '../context/VideoPlayerProvider';

export interface HlsPlayerProps
    extends React.VideoHTMLAttributes<HTMLVideoElement> {
    src: string;
}

function HlsPlayer({ src, autoPlay, ...props }: HlsPlayerProps) {
    const { videoRef, quality } = useVideoPlayer();
    const [hls, setHls] = useState<Hls>();

    useEffect(() => {
        if (hls) {
            hls.currentLevel = quality;
        }
    }, [quality]);

    useEffect(() => {
        function _initPlayer() {
            if (hls != null) {
                hls.destroy();
            }

            const newHls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            if (videoRef.current != null) {
                newHls.attachMedia(videoRef.current);
            }

            newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
                newHls.loadSource(src);

                newHls.on(Hls.Events.MANIFEST_PARSED, () => {
                    newHls.currentLevel = quality ?? -1;
                    if (autoPlay) {
                        videoRef?.current
                            ?.play()
                            .catch(() =>
                                console.log(
                                    'Unable to autoplay prior to user interaction with the dom.'
                                )
                            );
                    }
                });
            });

            newHls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            newHls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            newHls.recoverMediaError();
                            break;
                        default:
                            _initPlayer();
                            break;
                    }
                }
            });

            setHls(newHls);
        }

        // Check for Media Source support
        if (Hls.isSupported()) {
            _initPlayer();
        }

        return () => {
            if (hls != null) {
                hls.destroy();
            }
        };
    }, [autoPlay, videoRef, src]);

    // If Media Source is supported, use HLS.js to play video
    // eslint-disable-next-line jsx-a11y/media-has-caption
    if (Hls.isSupported()) return <video ref={videoRef} {...props} />;

    // Fallback to using a regular video player if HLS is supported by default in the user's browser
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <video ref={videoRef} src={src} autoPlay={autoPlay} {...props} />;
}

export default HlsPlayer;
