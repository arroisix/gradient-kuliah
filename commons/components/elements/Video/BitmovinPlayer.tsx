import {
    Player,
    PlayerAPI,
    PlayerConfig,
    PlayerEvent,
    PlayerEventBase,
    SourceConfig
} from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player-ui';
import 'bitmovin-player-ui/dist/css/bitmovinplayer-ui.css';
import { useLearning } from 'courses/contexts/LearningProvider';
import { router } from 'next/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTracker } from 'tracker/tracker';
import { useDebounceCallback } from 'usehooks-ts';
import dynamic from 'next/dynamic';

const NextVideoAutoplay = dynamic(() => import('./NextVideoAutoplay'));

interface BitmovinPlayerProps {
    src?: string;
    drmToken?: string;
    autoPlay?: boolean;
    trackProgress?: (
        last_duration: string,
        isFinished?: boolean
    ) => Promise<any>;
    next_subchapter_link?: string;
    next_subchapter_name?: string;
    next_subchapter_thumbnail?: string;
}

interface PlayerEventData extends PlayerEventBase {
    time?: number;
}

export default function BitmovinPlayer({
    src,
    drmToken,
    autoPlay = false,
    trackProgress,
    next_subchapter_link,
    next_subchapter_name,
    next_subchapter_thumbnail
}: BitmovinPlayerProps): JSX.Element {
    const tracker = useTracker();
    const { subchapter } = useLearning();
    const [player, setPlayer] = useState<PlayerAPI | null>(null);
    const playerDiv = useRef<HTMLDivElement>(null);
    const [isNextVideoOpen, setIsNextVideoOpen] = useState(false);

    async function handleTrackProgress(
        currentTime: number,
        isFinished?: boolean
    ): Promise<void> {
        if (trackProgress) {
            console.log('Tracking progress:', {
                currentTime: currentTime,
                isFinished: isFinished ?? false
            });
            await trackProgress(currentTime.toString(), isFinished ?? false);
        }
    }

    const debouncedHandleTrackProgress = useDebounceCallback(
        handleTrackProgress,
        2000
    );

    const setupPlayer = useCallback((): void => {
        if (!playerDiv.current) {
            return;
        }

        const playerKey = process.env.NEXT_PUBLIC_BITMOVIN_PLAYER_KEY;
        if (!playerKey) {
            return;
        }

        const playerConfig: PlayerConfig = {
            key: playerKey,
            tweaks: {
                max_retries: Infinity,
                retry_delay: 1000,
                max_mpd_retries: Infinity,
                chunked_cmaf_streaming: true,
                XHR_TIMEOUT: 20
            },
            adaptation: {
                desktop: {
                    bitrates: {
                        minSelectableAudioBitrate: '128kbps',
                        maxSelectableAudioBitrate: '320kbps',
                        minSelectableVideoBitrate: '900kbps',
                        maxSelectableVideoBitrate: Infinity
                    }
                },
                mobile: {
                    bitrates: {
                        minSelectableAudioBitrate: 0,
                        maxSelectableAudioBitrate: '256000bps',
                        minSelectableVideoBitrate: 0,
                        maxSelectableVideoBitrate: '2.5mbps'
                    }
                }
            },
            playback: {
                autoplay: autoPlay
            },
            ui: {
                playbackSpeedSelectionEnabled: true,
                hideFirstFrame: false,
                seekbar: {
                    seekPreviewThumbnails: true
                },
                playbackSpeedSelection: {
                    enabled: true,
                    speeds: [0.5, 0.75, 1, 1.25, 1.5, 2]
                }
            },
            events: {
                [PlayerEvent.Playing]: (data: PlayerEventData) => {
                    if (data.time) {
                        debouncedHandleTrackProgress(data.time, false);
                    }
                    tracker?.genericTrack('Play Video', {
                        'Course Slug': router.query.id,
                        'Video Title': subchapter?.subchapter_name
                    });
                },
                [PlayerEvent.Paused]: (data: PlayerEventData) => {
                    if (data.time) {
                        debouncedHandleTrackProgress(data.time, false);
                    }
                    tracker?.genericTrack('Pause Video', {
                        'Course Slug': router.query.id,
                        'Video Title': subchapter?.subchapter_name
                    });
                },
                [PlayerEvent.PlaybackFinished]: async (
                    data: PlayerEventData
                ) => {
                    if (data.time) {
                        debouncedHandleTrackProgress(data.time, false);
                    }
                    tracker?.genericTrack('Finished Video', {
                        'Course Slug': router.query.id,
                        'Video Title': subchapter?.subchapter_name
                    });

                    if (next_subchapter_link) {
                        setIsNextVideoOpen(true);
                    }
                },
                [PlayerEvent.Seeked]: (data: PlayerEventData) => {
                    if (data.time) {
                        debouncedHandleTrackProgress(data.time, false);
                    }
                    tracker?.genericTrack('Seek Video', {
                        'Course Slug': router.query.id,
                        'Video Title': subchapter?.subchapter_name
                    });
                },
                [PlayerEvent.TimeChanged]: (data: PlayerEventData) => {
                    if (data.time && Math.round(data.time) % 5 === 0) {
                        debouncedHandleTrackProgress(data.time, false);
                    }
                },
                [PlayerEvent.Destroy]: () => {
                    router.reload();
                }
            }
        };

        const sourceConfig: SourceConfig = {
            hls: src,
            drm: {
                widevine: {
                    LA_URL: process.env.NEXT_PUBLIC_WIDEVINE_DRM_LICENSE_URL,
                    headers: {
                        'X-AxDRM-Message': drmToken as string
                    }
                },
                fairplay: {
                    LA_URL: process.env.NEXT_PUBLIC_FAIRPLAY_DRM_LICENSE_URL,
                    certificateURL:
                        'https://assets.gradient.academy/drm/fairplay.cer',
                    headers: {
                        'X-AxDRM-Message': drmToken as string
                    },
                    certificateHeaders: {
                        'Access-Control-Request-Method': 'GET'
                    },
                    prepareContentId: (uri) => {
                        return uri.substring(uri.indexOf('skd'));
                    },
                    prepareLicenseAsync: (ckc) => {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.addEventListener('loadend', () =>
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                resolve(new Uint8Array(reader.result))
                            );
                            reader.addEventListener('error', () =>
                                reject(reader.error)
                            );
                            reader.readAsArrayBuffer(ckc);
                        });
                    },
                    prepareMessage: (event) =>
                        new Blob([event.message], {
                            type: 'application/octet-binary'
                        }),
                    useUint16InitData: true,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    licenseResponseType: 'blob'
                }
            }
        };

        try {
            const playerInstance = new Player(
                playerDiv.current as HTMLDivElement,
                playerConfig
            );

            const container = playerInstance.getContainer();

            if (container) {
                container.focus();
                container.addEventListener(
                    'keydown',
                    (event: KeyboardEvent) => {
                        if (
                            event.key === 'ArrowLeft' ||
                            event.key === 'ArrowRight'
                        ) {
                            const seekSeconds =
                                event.key === 'ArrowLeft' ? -10 : 10;
                            playerInstance.seek(
                                playerInstance.getCurrentTime() + seekSeconds
                            );
                        }
                    }
                );
            }

            UIFactory.buildModernUI(playerInstance);

            playerInstance.load(sourceConfig).then(() => {
                setPlayer(playerInstance);
            });
        } catch (error) {}
    }, [autoPlay]);

    useEffect(() => {
        setupPlayer();

        return () => {
            function destroyPlayer(): void {
                if (player != null) {
                    player.destroy();
                    setPlayer(null);
                }
            }

            destroyPlayer();
        };
    }, [setupPlayer]);

    return (
        <div className="relative rounded-md">
            <div
                id="player"
                className="rounded-lg overflow-clip"
                ref={playerDiv}
            />

            {isNextVideoOpen ? (
                <NextVideoAutoplay
                    timeout={5}
                    next_subchapter_link={next_subchapter_link}
                    next_subchapter_name={next_subchapter_name}
                    next_subchapter_thumbnail={next_subchapter_thumbnail}
                    setIsNextVideoOpen={setIsNextVideoOpen}
                />
            ) : (
                <></>
            )}
        </div>
    );
}
