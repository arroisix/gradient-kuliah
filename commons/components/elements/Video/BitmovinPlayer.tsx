import React, { useEffect, useRef, useState } from 'react';
import { Player } from 'bitmovin-player';
import { FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';
import { useLearning } from 'courses/contexts/LearningProvider';
import { useDebounceCallback } from 'usehooks-ts';

interface BitmovinPlayerProps {
    src: string;
    drmToken: string;
    autoPlay?: boolean;
    trackProgress?: (
        last_duration: string,
        isFinished?: boolean
    ) => Promise<any>;
    next_subchapter_link?: string;
}

const BitmovinPlayer = ({
    src,
    drmToken,
    autoPlay = false,
    trackProgress,
    next_subchapter_link
}: BitmovinPlayerProps): JSX.Element => {
    const tracker = useTracker();
    const { subchapter } = useLearning();
    const router = useRouter();
    const playerRef = useRef<any | null>(null); // Changed from Player to any
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isPlay, setIsPlay] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    let trackInterval: NodeJS.Timeout | undefined;

    const debouncedHandleTrackProgress = useDebounceCallback(
        async (isFinished?: boolean) => {
            if (trackProgress && playerRef.current) {
                const currentTime = await playerRef.current.getCurrentTime();
                await trackProgress(
                    currentTime.toString(),
                    isFinished ?? false
                );
            }
        },
        2000
    );

    const handleNextVideo = (): void => {
        if (next_subchapter_link) router.push(next_subchapter_link);
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const playerKey = process.env.NEXT_PUBLIC_BITMOVIN_PLAYER_KEY;
        if (!playerKey) {
            console.error('NEXT_PUBLIC_BITMOVIN_PLAYER_KEY is not defined');
            setIsLoading(false);
            return;
        }

        const config = {
            key: playerKey,
            source: {
                hls: src,
                drm: {
                    widevine: {
                        LA_URL: 'https://drm-widevine-licensing.axprod.net/AcquireLicense',
                        headers: {
                            Authorization: `Bearer ${drmToken}`
                        }
                    },
                    playready: {
                        LA_URL: 'https://drm-playready-licensing.axprod.net/AcquireLicense',
                        headers: {
                            Authorization: `Bearer ${drmToken}`
                        }
                    },
                    fairplay: {
                        LA_URL: 'https://drm-fairplay-licensing.axprod.net/AcquireLicense',
                        headers: {
                            Authorization: `Bearer ${drmToken}`
                        }
                    }
                }
            },
            ui: {
                playbackSpeedSelectionEnabled: true,
                customization: {
                    seekbar: {
                        smoothSeeking: true
                    }
                }
            },
            playback: {
                autoplay: autoPlay
            }
        };

        try {
            const player = new Player(containerRef.current, config);
            playerRef.current = player;

            player.on('ready' as any, () => {
                setIsLoading(false);
                console.log('Bitmovin Player ready');
            });

            player.on('play' as any, () => {
                tracker?.genericTrack('Play Video', {
                    'Course Slug': router.query.id,
                    'Video Title': subchapter?.subchapter_name,
                    'Player Type': 'Bitmovin'
                });
                setIsPlay(true);
                setIsBuffering(false);
                debouncedHandleTrackProgress();

                trackInterval = setInterval(() => {
                    debouncedHandleTrackProgress();
                }, 30000);
            });

            player.on('paused' as any, () => {
                tracker?.genericTrack('Pause Video', {
                    'Course Slug': router.query.id,
                    'Video Title': subchapter?.subchapter_name,
                    'Player Type': 'Bitmovin'
                });
                setIsPlay(false);
                debouncedHandleTrackProgress();
                clearInterval(trackInterval);
            });

            player.on('playbackfinished' as any, () => {
                setIsPlay(false);
                debouncedHandleTrackProgress(true);
                handleNextVideo();
                clearInterval(trackInterval);
            });

            player.on('stallstarted' as any, () => {
                setIsBuffering(true);
            });

            player.on('stallended' as any, () => {
                setIsBuffering(false);
            });

            player.on('error' as any, (event: any) => {
                console.error('Bitmovin Player Error:', event);
                setIsLoading(false);
            });
        } catch (error) {
            console.error('Failed to initialize Bitmovin Player:', error);
            setIsLoading(false);
        }

        return () => {
            debouncedHandleTrackProgress();
            clearInterval(trackInterval);
            if (
                playerRef.current &&
                typeof playerRef.current.destroy === 'function'
            ) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [src, drmToken]);

    if (isLoading) {
        return (
            <div className="relative w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-white">Loading Player...</div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div ref={containerRef} className="w-full aspect-video" />
            {!isPlay && (
                <>
                    <div className="absolute bg-black opacity-50 w-full h-full left-0 top-0 pointer-events-none" />
                    <div className="absolute w-full h-full left-0 top-0 z-[9] flex justify-center items-center p-8 pointer-events-none">
                        {!isBuffering && (
                            <FaPlay className="text-4xl pointer-events-none" />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default BitmovinPlayer;
