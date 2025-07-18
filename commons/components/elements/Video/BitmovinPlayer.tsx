import {
    Player,
    PlayerAPI,
    PlayerConfig,
    PlayerEvent,
    PlayerEventBase,
    PlayerEventCallback,
    SourceConfig,
    TimeMode
} from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player-ui';
import 'bitmovin-player-ui/dist/css/bitmovinplayer-ui.css';
import { router } from 'next/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

interface BitmovinPlayerProps {
    src?: string;
    drmToken?: string;
    autoPlay?: boolean;
    trackProgress?: (
        last_duration: string,
        isFinished?: boolean
    ) => Promise<any>;
    next_subchapter_link?: string;
}

interface PlayerEventData extends PlayerEventBase {
    time?: number;
}

export default function BitmovinPlayer({
    src,
    drmToken,
    autoPlay = false,
    trackProgress,
    next_subchapter_link
}: BitmovinPlayerProps): JSX.Element {
    const [player, setPlayer] = useState<PlayerAPI | null>(null);
    const playerDiv = useRef<HTMLDivElement>(null);

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
        console.log('Props received (ignored for test):', {
            src,
            drmToken: drmToken ? 'TOKEN_PROVIDED' : 'NO_TOKEN',
            autoPlay,
            trackProgress: trackProgress ? 'FUNCTION_PROVIDED' : 'NO_FUNCTION',
            next_subchapter_link
        });

        if (!playerDiv.current) {
            return;
        }

        const playerKey = process.env.NEXT_PUBLIC_BITMOVIN_PLAYER_KEY;
        if (!playerKey) {
            return;
        }

        const playerConfig: PlayerConfig = {
            key: playerKey,
            playback: {
                autoplay: autoPlay
            },
            ui: {
                watermark: false,
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
                },
                [PlayerEvent.Paused]: (data: PlayerEventData) => {
                    if (data.time) {
                        debouncedHandleTrackProgress(data.time, false);
                    }
                },
                [PlayerEvent.PlaybackFinished]: (data: PlayerEventData) => {
                    if (data.time) {
                        debouncedHandleTrackProgress(data.time, false);
                    }
                },
                [PlayerEvent.Seeked]: (data: PlayerEventData) => {
                    if (data.time) {
                        debouncedHandleTrackProgress(data.time, false);
                    }
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
            // hls: 'https://streams.bitmovin.com/cv95fqu1pf7itg7cfei0/manifest.m3u8'
            hls: src,
            drm: {
                widevine: {
                    LA_URL: 'https://72c8bb0b.drm-widevine-licensing.axprod.net/AcquireLicense',
                    headers: {
                        'X-AxDRM-Message': drmToken as string
                    }
                },
                fairplay: {
                    LA_URL: 'https://72c8bb0b.drm-fairplay-licensing.axprod.net/AcquireLicense',
                    certificateURL:
                        'https://vtb.axinom.com/FPScert/fairplay.cer',
                    headers: {
                        'X-AxDRM-Message': drmToken as string
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

            UIFactory.buildModernUI(playerInstance);

            // setTimeout(() => {
            //     const playerContainer = playerInstance.getContainer();
            //     // const controlBar = playerContainer?.querySelector(
            //     //     '.bmpui-ui-controlbar'
            //     // );

            //     //     const playButton = controlBar.querySelector(
            //     //         '.bmpui-ui-playbacktogglebutton'
            //     //     );

            //     //     if (playButton && playButton.parentElement) {
            //     //         const backwardBtn = document.createElement('div');
            //     //         backwardBtn.className =
            //     //             'bmpui-ui-button custom-skip-backward';
            //     //         backwardBtn.innerHTML = `
            //     //             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            //     //                 <path fill="currentColor" d="M11.99 5V1l-5 5l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6s-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8s-3.58-8-8-8m-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57s-.28.26-.45.33s-.37.1-.59.1s-.41-.03-.59-.1s-.33-.18-.46-.33s-.23-.34-.3-.57s-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57s.28-.26.45-.33s.37-.1.59-.1s.41.03.59.1s.33.18.46.33s.23.34.3.57s.11.5.11.82zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31s-.11-.14-.19-.17s-.16-.05-.25-.05s-.18.02-.25.05s-.14.09-.19.17s-.09.18-.12.31s-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32s.11.14.19.17s.16.05.25.05s.18-.02.25-.05s.14-.09.19-.17s.09-.19.11-.32s.04-.29.04-.48v-.97z"/>
            //     //             </svg>
            //     //         `;
            //     //         backwardBtn.style.cssText = `
            //     //             display: flex !important;
            //     //             align-items: center !important;
            //     //             justify-content: center !important;
            //     //             cursor: pointer !important;
            //     //             user-select: none !important;
            //     //             background: transparent !important;
            //     //             border: none !important;
            //     //             color: white !important;
            //     //             margin: 0 !important;
            //     //             opacity: 0.8 !important;
            //     //         `;

            //     //         backwardBtn.addEventListener('click', () => {
            //     //             const currentTime = playerInstance.getCurrentTime();
            //     //             playerInstance.seek(Math.max(0, currentTime - 10));
            //     //         });

            //     //         const forwardBtn = document.createElement('div');
            //     //         forwardBtn.className =
            //     //             'bmpui-ui-button custom-skip-forward';
            //     //         forwardBtn.innerHTML = `
            //     //             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            //     //                 <path fill="currentColor" d="M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6s2.69-6 6-6v4l5-5l-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8s8-3.58 8-8z"/>
            //     //                 <path fill="currentColor" d="M10.9 16v-4.27h-.09l-1.77.63v.69l1.01-.31V16zm3.42-4.22c-.18-.07-.37-.1-.59-.1s-.41.03-.59.1s-.33.18-.45.33s-.23.34-.29.57s-.1.5-.1.82v.74c0 .32.04.6.11.82s.17.42.3.57s.28.26.46.33s.37.1.59.1s.41-.03.59-.1s.33-.18.45-.33s.22-.34.29-.57s.1-.5.1-.82v-.74c0-.32-.04-.6-.11-.82s-.17-.42-.3-.57s-.29-.26-.46-.33m.01 2.57c0 .19-.01.35-.04.48s-.06.24-.11.32s-.11.14-.19.17s-.16.05-.25.05s-.18-.02-.25-.05s-.14-.09-.19-.17s-.09-.19-.12-.32s-.04-.29-.04-.48v-.97c0-.19.01.35.04-.48s.06-.23.12-.31s.11-.14.19-.17s.16-.05.25-.05s.18.02.25.05s.14.09.19.17s.09.18.12.31s.04.29.04.48v.97z"/>
            //     //             </svg>
            //     //         `;
            //     //         forwardBtn.style.cssText = `
            //     //             display: flex !important;
            //     //             align-items: center !important;
            //     //             justify-content: center !important;
            //     //             cursor: pointer !important;
            //     //             user-select: none !important;
            //     //             background: transparent !important;
            //     //             border: none !important;
            //     //             color: white !important;
            //     //             margin: 0 !important;
            //     //             opacity: 0.8 !important;
            //     //         `;

            //     //         forwardBtn.addEventListener('click', () => {
            //     //             const currentTime = playerInstance.getCurrentTime();
            //     //             const duration = playerInstance.getDuration();
            //     //             playerInstance.seek(
            //     //                 Math.min(duration, currentTime + 10)
            //     //             );
            //     //         });

            //     //         const volumeBtn = document.createElement('div');
            //     //         volumeBtn.className =
            //     //             'bmpui-ui-button custom-volume-button';
            //     //         let currentVolume = playerInstance.getVolume() / 100;
            //     //         let volumeSliderVisible = false;
            //     //         let isMuted = playerInstance.isMuted();

            //     //         const getVolumeIcon = (
            //     //             volume: number,
            //     //             muted: boolean
            //     //         ) => {
            //     //             if (muted || volume === 0) {
            //     //                 return `
            //     //                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            //     //                         <path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63m2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71M4.27 3L3 4.27L7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21L21 19.73l-9-9zM12 4L9.91 6.09L12 8.18z"/>
            //     //                     </svg>
            //     //                 `;
            //     //             } else if (volume < 0.3) {
            //     //                 return `
            //     //                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            //     //                         <path fill="currentColor" d="M7 9v6h4l5 5V4l-5 5H7z"/>
            //     //                     </svg>
            //     //                 `;
            //     //             } else if (volume < 0.7) {
            //     //                 return `
            //     //                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            //     //                         <path fill="currentColor" d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02M5 9v6h4l5 5V4L9 9H5z"/>
            //     //                     </svg>
            //     //                 `;
            //     //             } else {
            //     //                 return `
            //     //                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            //     //                         <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            //     //                     </svg>
            //     //                 `;
            //     //             }
            //     //         };

            //     //         volumeBtn.innerHTML = getVolumeIcon(
            //     //             currentVolume,
            //     //             isMuted
            //     //         );
            //     //         volumeBtn.style.cssText = `
            //     //             display: flex !important;
            //     //             align-items: center !important;
            //     //             justify-content: center !important;
            //     //             cursor: pointer !important;
            //     //             user-select: none !important;
            //     //             background: transparent !important;
            //     //             border: none !important;
            //     //             color: white !important;
            //     //             margin: 0 !important;
            //     //             opacity: 0.8 !important;
            //     //             position: relative !important;
            //     //         `;

            //     //         const volumeSlider = document.createElement('div');
            //     //         volumeSlider.className = 'custom-volume-slider';
            //     //         volumeSlider.style.cssText = `
            //     //             position: absolute !important;
            //     //             bottom: 100% !important;
            //     //             left: 50% !important;
            //     //             transform: translateX(-50%) !important;
            //     //             background: rgba(0, 0, 0, 0.9) !important;
            //     //             border-radius: 6px !important;
            //     //             margin-bottom: 8px !important;
            //     //             display: none !important;
            //     //             flex-direction: column !important;
            //     //             align-items: center !important;
            //     //             padding: 12px 8px !important;
            //     //             z-index: 1000 !important;
            //     //             backdrop-filter: blur(10px) !important;
            //     //             border: 1px solid rgba(255, 255, 255, 0.1) !important;
            //     //             height: 120px !important;
            //     //             width: 40px !important;
            //     //         `;

            //     //         const volumeTrack = document.createElement('div');
            //     //         volumeTrack.style.cssText = `
            //     //             width: 4px !important;
            //     //             height: 80px !important;
            //     //             background: rgba(255, 255, 255, 0.3) !important;
            //     //             border-radius: 2px !important;
            //     //             position: relative !important;
            //     //             cursor: pointer !important;
            //     //         `;

            //     //         const volumeFill = document.createElement('div');
            //     //         volumeFill.style.cssText = `
            //     //             width: 100% !important;
            //     //             background: #5F2BCE !important;
            //     //             border-radius: 2px !important;
            //     //             position: absolute !important;
            //     //             bottom: 0 !important;
            //     //             height: ${
            //     //                 isMuted ? 0 : Math.min(100, currentVolume * 100)
            //     //             }% !important;
            //     //             transition: height 0.1s ease !important;
            //     //         `;

            //     //         const volumeThumb = document.createElement('div');
            //     //         volumeThumb.style.cssText = `
            //     //             width: 12px !important;
            //     //             height: 12px !important;
            //     //             background: #5F2BCE !important;
            //     //             border-radius: 50% !important;
            //     //             position: absolute !important;
            //     //             left: 50% !important;
            //     //             transform: translateX(-50%) translateY(50%) !important;
            //     //             top: ${
            //     //                 isMuted
            //     //                     ? 100
            //     //                     : Math.max(
            //     //                           0,
            //     //                           (1 - Math.min(1, currentVolume)) * 100
            //     //                       )
            //     //             }% !important;
            //     //             cursor: pointer !important;
            //     //             transition: top 0.1s ease !important;
            //     //         `;

            //     //         const volumeLabel = document.createElement('div');
            //     //         volumeLabel.style.cssText = `
            //     //             color: white !important;
            //     //             font-size: 10px !important;
            //     //             margin-top: 8px !important;
            //     //             text-align: center !important;
            //     //         `;
            //     //         volumeLabel.textContent = isMuted
            //     //             ? '0%'
            //     //             : `${Math.round(
            //     //                   Math.min(100, currentVolume * 100)
            //     //               )}%`;

            //     //         volumeTrack.appendChild(volumeFill);
            //     //         volumeTrack.appendChild(volumeThumb);
            //     //         volumeSlider.appendChild(volumeTrack);
            //     //         volumeSlider.appendChild(volumeLabel);
            //     //         volumeBtn.appendChild(volumeSlider);

            //     //         const updateVolumeDisplay = (
            //     //             volume: number,
            //     //             muted: boolean
            //     //         ) => {
            //     //             currentVolume = volume;
            //     //             isMuted = muted;

            //     //             const svgElement = volumeBtn.querySelector('svg');
            //     //             if (svgElement) {
            //     //                 volumeBtn.innerHTML = getVolumeIcon(
            //     //                     volume,
            //     //                     muted
            //     //                 );
            //     //                 volumeBtn.appendChild(volumeSlider);
            //     //             }

            //     //             const displayVolume = muted ? 0 : volume;
            //     //             volumeFill.style.height = `${displayVolume * 100}%`;
            //     //             volumeThumb.style.top = `${
            //     //                 (1 - displayVolume) * 100
            //     //             }%`;
            //     //             volumeLabel.textContent = `${Math.round(
            //     //                 displayVolume * 100
            //     //             )}%`;
            //     //         };

            //     //         const handleVolumeSliderInteraction = (
            //     //             e: MouseEvent
            //     //         ) => {
            //     //             e.preventDefault();
            //     //             e.stopPropagation();

            //     //             const rect = volumeTrack.getBoundingClientRect();
            //     //             const y = e.clientY - rect.top;
            //     //             const height = rect.height;
            //     //             const normalizedVolume = Math.max(
            //     //                 0,
            //     //                 Math.min(1, (height - y) / height)
            //     //             );

            //     //             const playerVolume = normalizedVolume * 100;

            //     //             playerInstance.setVolume(playerVolume);

            //     //             if (normalizedVolume > 0 && isMuted) {
            //     //                 playerInstance.unmute();
            //     //             }

            //     //             updateVolumeDisplay(
            //     //                 normalizedVolume,
            //     //                 normalizedVolume === 0
            //     //             );
            //     //         };

            //     //         let isDragging = false;

            //     //         volumeTrack.addEventListener('mousedown', (e) => {
            //     //             isDragging = true;
            //     //             handleVolumeSliderInteraction(e);
            //     //         });

            //     //         document.addEventListener('mousemove', (e) => {
            //     //             if (isDragging) {
            //     //                 handleVolumeSliderInteraction(e);
            //     //             }
            //     //         });

            //     //         document.addEventListener('mouseup', () => {
            //     //             isDragging = false;
            //     //         });

            //     //         volumeBtn.addEventListener('click', (e) => {
            //     //             e.preventDefault();
            //     //             e.stopPropagation();

            //     //             const target = e.target as Element;

            //     //             if (
            //     //                 volumeSlider.contains(target) ||
            //     //                 volumeTrack.contains(target) ||
            //     //                 target === volumeFill ||
            //     //                 target === volumeThumb
            //     //             ) {
            //     //                 return;
            //     //             }

            //     //             if (volumeSliderVisible) {
            //     //                 if (isMuted) {
            //     //                     playerInstance.unmute();
            //     //                     updateVolumeDisplay(currentVolume, false);
            //     //                 } else {
            //     //                     playerInstance.mute();
            //     //                     updateVolumeDisplay(currentVolume, true);
            //     //                 }
            //     //             } else {
            //     //                 volumeSliderVisible = true;
            //     //                 volumeSlider.style.display = 'flex';
            //     //             }
            //     //         });

            //     //         const hideVolumeSlider = (e: Event) => {
            //     //             if (
            //     //                 volumeSliderVisible &&
            //     //                 !volumeBtn.contains(e.target as Node)
            //     //             ) {
            //     //                 volumeSlider.style.display = 'none';
            //     //                 volumeSliderVisible = false;
            //     //             }
            //     //         };

            //     //         document.addEventListener('click', hideVolumeSlider);

            //     //         playerInstance.on(
            //     //             'volumeChanged' as any,
            //     //             (event: any) => {
            //     //                 updateVolumeDisplay(
            //     //                     event.volume,
            //     //                     playerInstance.isMuted()
            //     //                 );
            //     //             }
            //     //         );

            //     //         playerInstance.on('muted' as any, () => {
            //     //             updateVolumeDisplay(currentVolume, true);
            //     //         });

            //     //         playerInstance.on('unmuted' as any, () => {
            //     //             updateVolumeDisplay(currentVolume, false);
            //     //         });

            //     //         const ccBtn = document.createElement('div');
            //     //         ccBtn.className = 'bmpui-ui-button custom-cc-button';
            //     //         let ccEnabled = false;

            //     //         ccBtn.innerHTML = `
            //     //             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            //     //                 <path fill="currentColor" d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1z"/>
            //     //             </svg>
            //     //         `;
            //     //         ccBtn.style.cssText = `
            //     //             display: flex !important;
            //     //             align-items: center !important;
            //     //             justify-content: center !important;
            //     //             cursor: pointer !important;
            //     //             user-select: none !important;
            //     //             background: transparent !important;
            //     //             border: none !important;
            //     //             color: white !important;
            //     //             margin: 0 !important;
            //     //             opacity: 0.8 !important;
            //     //         `;

            //     //         const updateCCButtonState = (enabled: boolean) => {
            //     //             ccBtn.style.opacity = enabled ? '1' : '0.8';
            //     //             ccBtn.style.backgroundColor = enabled
            //     //                 ? 'rgba(95, 43, 206, 0.3)'
            //     //                 : 'transparent';
            //     //         };

            //     //         ccBtn.addEventListener('click', () => {
            //     //             try {
            //     //                 const subtitleTracks =
            //     //                     playerInstance.subtitles.list();

            //     //                 if (subtitleTracks.length === 0) {
            //     //                     return;
            //     //                 }

            //     //                 if (!ccEnabled) {
            //     //                     const firstTrack = subtitleTracks[0];
            //     //                     playerInstance.subtitles.enable(
            //     //                         firstTrack.id
            //     //                     );
            //     //                     ccEnabled = true;
            //     //                 } else {
            //     //                     (playerInstance.subtitles.disable as any)();
            //     //                     ccEnabled = false;
            //     //                 }

            //     //                 updateCCButtonState(ccEnabled);
            //     //             } catch (error) {
            //     //                 // Silently handle error
            //     //             }
            //     //         });

            //     //         const speedBtn = document.createElement('div');
            //     //         speedBtn.className =
            //     //             'bmpui-ui-button custom-speed-button';
            //     //         let currentSpeed = 1;
            //     //         const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
            //     //         let speedMenuVisible = false;

            //     //         speedBtn.innerHTML = `
            //     //             <span style="font-size: 12px; font-weight: 500;">1x</span>
            //     //         `;
            //     //         speedBtn.style.cssText = `
            //     //             display: flex !important;
            //     //             align-items: center !important;
            //     //             justify-content: center !important;
            //     //             cursor: pointer !important;
            //     //             user-select: none !important;
            //     //             background: transparent !important;
            //     //             border: none !important;
            //     //             color: white !important;
            //     //             margin: 0 !important;
            //     //             opacity: 0.8 !important;
            //     //             position: relative !important;
            //     //         `;

            //     //         const speedMenu = document.createElement('div');
            //     //         speedMenu.className = 'custom-speed-menu';
            //     //         speedMenu.style.cssText = `
            //     //             position: absolute !important;
            //     //             bottom: 100% !important;
            //     //             left: 50% !important;
            //     //             transform: translateX(-50%) !important;
            //     //             background: rgba(0, 0, 0, 0.9) !important;
            //     //             border-radius: 6px !important;
            //     //             margin-bottom: 8px !important;
            //     //             display: none !important;
            //     //             flex-direction: column !important;
            //     //             min-width: 60px !important;
            //     //             z-index: 1000 !important;
            //     //             backdrop-filter: blur(10px) !important;
            //     //             border: 1px solid rgba(255, 255, 255, 0.1) !important;
            //     //         `;

            //     //         speeds.forEach((speed) => {
            //     //             const speedOption = document.createElement('div');
            //     //             speedOption.className = 'speed-option';
            //     //             speedOption.textContent = `${speed}x`;
            //     //             speedOption.style.cssText = `
            //     //                 padding: 8px 16px !important;
            //     //                 color: white !important;
            //     //                 cursor: pointer !important;
            //     //                 font-size: 12px !important;
            //     //                 text-align: center !important;
            //     //                 transition: background-color 0.2s ease !important;
            //     //                 ${
            //     //                     speed === currentSpeed
            //     //                         ? 'background-color: rgba(95, 43, 206, 0.3) !important;'
            //     //                         : ''
            //     //                 }
            //     //             `;

            //     //             speedOption.addEventListener('mouseenter', () => {
            //     //                 if (speed !== currentSpeed) {
            //     //                     (
            //     //                         speedOption as HTMLElement
            //     //                     ).style.backgroundColor =
            //     //                         'rgba(255, 255, 255, 0.1)';
            //     //                 }
            //     //             });

            //     //             speedOption.addEventListener('mouseleave', () => {
            //     //                 if (speed !== currentSpeed) {
            //     //                     (
            //     //                         speedOption as HTMLElement
            //     //                     ).style.backgroundColor = 'transparent';
            //     //                 }
            //     //             });

            //     //             speedOption.addEventListener('click', (e) => {
            //     //                 e.preventDefault();
            //     //                 e.stopPropagation();
            //     //                 currentSpeed = speed;
            //     //                 playerInstance.setPlaybackSpeed(speed);
            //     //                 const spanElement =
            //     //                     speedBtn.querySelector('span');
            //     //                 if (spanElement) {
            //     //                     spanElement.textContent = `${speed}x`;
            //     //                 }

            //     //                 speedMenu
            //     //                     .querySelectorAll('.speed-option')
            //     //                     .forEach((option) => {
            //     //                         if (
            //     //                             option.textContent === `${speed}x`
            //     //                         ) {
            //     //                             (
            //     //                                 option as HTMLElement
            //     //                             ).style.backgroundColor =
            //     //                                 'rgba(95, 43, 206, 0.3)';
            //     //                         } else {
            //     //                             (
            //     //                                 option as HTMLElement
            //     //                             ).style.backgroundColor =
            //     //                                 'transparent';
            //     //                         }
            //     //                     });

            //     //                 speedMenu.style.display = 'none';
            //     //                 speedMenuVisible = false;
            //     //             });

            //     //             speedMenu.appendChild(speedOption);
            //     //         });

            //     //         speedBtn.appendChild(speedMenu);

            //     //         speedBtn.addEventListener('click', (e) => {
            //     //             e.preventDefault();
            //     //             e.stopPropagation();
            //     //             speedMenuVisible = !speedMenuVisible;
            //     //             speedMenu.style.display = speedMenuVisible
            //     //                 ? 'flex'
            //     //                 : 'none';
            //     //         });

            //     //         const hideSpeedMenu = (e: Event) => {
            //     //             if (
            //     //                 speedMenuVisible &&
            //     //                 !speedBtn.contains(e.target as Node)
            //     //             ) {
            //     //                 speedMenu.style.display = 'none';
            //     //                 speedMenuVisible = false;
            //     //             }
            //     //         };

            //     //         document.addEventListener('click', hideSpeedMenu);

            //     //         const timeDisplay = document.createElement('div');
            //     //         timeDisplay.className =
            //     //             'bmpui-ui-label custom-time-display';
            //     //         timeDisplay.style.cssText = `
            //     //             color: white !important;
            //     //             font-size: 12px !important;
            //     //             font-family: inherit !important;
            //     //             display: flex !important;
            //     //             align-items: center !important;
            //     //             white-space: nowrap !important;
            //     //             user-select: none !important;
            //     //         `;

            //     //         const formatTime = (seconds: number): string => {
            //     //             const mins = Math.floor(seconds / 60);
            //     //             const secs = Math.floor(seconds % 60);
            //     //             return `${mins.toString().padStart(2, '0')}:${secs
            //     //                 .toString()
            //     //                 .padStart(2, '0')}`;
            //     //         };

            //     //         const updateTimeDisplay = () => {
            //     //             const currentTime = playerInstance.getCurrentTime();
            //     //             const duration = playerInstance.getDuration();
            //     //             timeDisplay.textContent = `${formatTime(
            //     //                 currentTime
            //     //             )}/${formatTime(duration)}`;
            //     //         };

            //     //         const nextElement = playButton.nextElementSibling;
            //     //         playButton.parentElement.insertBefore(
            //     //             backwardBtn,
            //     //             nextElement
            //     //         );
            //     //         playButton.parentElement.insertBefore(
            //     //             forwardBtn,
            //     //             nextElement
            //     //         );

            //     //         playButton.parentElement.insertBefore(
            //     //             volumeBtn,
            //     //             nextElement
            //     //         );

            //     //         playButton.parentElement.insertBefore(
            //     //             timeDisplay,
            //     //             nextElement
            //     //         );

            //     //         const pipButton = controlBar.querySelector(
            //     //             '.bmpui-ui-piptogglebutton'
            //     //         );
            //     //         const fullscreenButton = controlBar.querySelector(
            //     //             '.bmpui-ui-fullscreentogglebutton'
            //     //         );
            //     //         const settingsButton = controlBar.querySelector(
            //     //             '.bmpui-ui-settingstogglebutton'
            //     //         );

            //     //         const rightSideButton =
            //     //             pipButton || fullscreenButton || settingsButton;

            //     //         if (rightSideButton && rightSideButton.parentElement) {
            //     //             rightSideButton.parentElement.insertBefore(
            //     //                 ccBtn,
            //     //                 rightSideButton
            //     //             );
            //     //             rightSideButton.parentElement.insertBefore(
            //     //                 speedBtn,
            //     //                 ccBtn
            //     //             );
            //     //         } else {
            //     //             controlBar.appendChild(speedBtn);
            //     //             controlBar.appendChild(ccBtn);
            //     //         }

            //     //         playerInstance.on(
            //     //             'timeChanged' as any,
            //     //             updateTimeDisplay
            //     //         );
            //     //         playerInstance.on(
            //     //             'durationChanged' as any,
            //     //             updateTimeDisplay
            //     //         );
            //     //         playerInstance.on('seeked' as any, updateTimeDisplay);

            //     //         setTimeout(updateTimeDisplay, 100);
            //     //     }
            //     // }

            //     // const style = document.createElement('style');
            //     // style.textContent = `
            //     //     /* Hide default time labels */
            //     //     .bmpui-ui-timelabel,
            //     //     .bmpui-ui-timelabel-timeplayed,
            //     //     .bmpui-ui-timelabel-timetotal {
            //     //         display: none !important;
            //     //     }

            //     //     .bmpui-ui-playbacktimelabel.bmpui-text-right {
            //     //         display: none !important;
            //     //     }

            //     //     .bmpui-ui-playbacktimelabel {
            //     //         display: none !important;
            //     //     }

            //     //     .bmpui-ui-playbackspeedselectionbutton {
            //     //         display: none !important;
            //     //     }

            //     //     .bmpui-ui-volumeslider,
            //     //     .bmpui-ui-volumecontrolbutton,
            //     //     .bmpui-ui-volumetogglebutton,
            //     //     .bmpui-ui-volumecontrol {
            //     //         display: none !important;
            //     //         visibility: hidden !important;
            //     //         opacity: 0 !important;
            //     //         pointer-events: none !important;
            //     //     }

            //     //     .bmpui-ui-controlbar .bmpui-ui-volumeslider,
            //     //     .bmpui-ui-controlbar .bmpui-ui-volumecontrolbutton,
            //     //     .bmpui-ui-controlbar .bmpui-ui-volumetogglebutton,
            //     //     .bmpui-ui-controlbar .bmpui-ui-volumecontrol,
            //     //     .bmpui-container .bmpui-ui-volumeslider,
            //     //     .bmpui-container .bmpui-ui-volumecontrolbutton,
            //     //     .bmpui-container .bmpui-ui-volumetogglebutton,
            //     //     .bmpui-container .bmpui-ui-volumecontrol {
            //     //         display: none !important;
            //     //         visibility: hidden !important;
            //     //         opacity: 0 !important;
            //     //         pointer-events: none !important;
            //     //     }

            //     //     .bmpui-ui-seekbar .bmpui-seekbar-playbackposition,
            //     //     .bmpui-ui-seekbar .bmpui-seekbar-playbackposition-marker {
            //     //         background-color: #5F2BCE !important;
            //     //     }

            //     //     .bmpui-ui-volumeslider .bmpui-seekbar .bmpui-seekbar-playbackposition-marker,
            //     //     .bmpui-ui-seekbar .bmpui-seekbar .bmpui-seekbar-playbackposition-marker {
            //     //         border: none !important;
            //     //     }

            //     //     .bmpui-ui-seekbar .bmpui-seekbar-bufferlevel {
            //     //         background-color: rgba(255, 255, 255, 0.3) !important;
            //     //     }

            //     //     .bmpui-ui-seekbar .bmpui-seekbar-thumb {
            //     //         background-color: #5F2BCE !important;
            //     //         border-color: #5F2BCE !important;
            //     //     }

            //     //     .bmpui-ui-hugeplaybacktogglebutton .bmpui-ui-playbacktogglebutton {
            //     //         border: none !important;
            //     //         outline: none !important;
            //     //     }

            //     //     .bmpui-ui-hugeplaybacktogglebutton .bmpui-ui-playbacktogglebutton:focus {
            //     //         border: none !important;
            //     //         outline: none !important;
            //     //         box-shadow: none !important;
            //     //     }

            //     //     .bmpui-ui-hugeplaybacktogglebutton {
            //     //         border: none !important;
            //     //         outline: none !important;
            //     //     }

            //     //     .bmpui-watermark,
            //     //     .bmpui-ui-watermark {
            //     //         display: none !important;
            //     //     }

            //     //     .custom-skip-backward,
            //     //     .custom-skip-forward,
            //     //     .custom-cc-button,
            //     //     .custom-speed-button,
            //     //     .custom-volume-button {
            //     //         background: transparent !important;
            //     //         border: none !important;
            //     //         color: white !important;
            //     //         opacity: 0.8 !important;
            //     //         transition: opacity 0.2s ease, background-color 0.2s ease !important;
            //     //     }

            //     //     .custom-skip-backward:hover,
            //     //     .custom-skip-forward:hover,
            //     //     .custom-cc-button:hover,
            //     //     .custom-speed-button:hover,
            //     //     .custom-volume-button:hover {
            //     //         background: transparent !important;
            //     //         border: none !important;
            //     //         opacity: 1 !important;
            //     //     }

            //     //     .custom-cc-button.active {
            //     //         background-color: rgba(95, 43, 206, 0.3) !important;
            //     //         opacity: 1 !important;
            //     //     }

            //     //     .custom-time-display {
            //     //         color: white !important;
            //     //         font-size: 12px !important;
            //     //         opacity: 0.9 !important;
            //     //     }

            //     //     .custom-speed-menu,
            //     //     .custom-volume-slider {
            //     //         box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
            //     //     }

            //     //     .custom-speed-menu .speed-option {
            //     //         border-radius: 0 !important;
            //     //     }

            //     //     .custom-speed-menu .speed-option:first-child {
            //     //         border-radius: 6px 6px 0 0 !important;
            //     //     }

            //     //     .custom-speed-menu .speed-option:last-child {
            //     //         border-radius: 0 0 6px 6px !important;
            //     //     }

            //     //     .custom-volume-slider {
            //     //         user-select: none !important;
            //     //     }
            //     // `;
            //     // document.head.appendChild(style);
            // }, 100);

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
        </div>
    );
}
