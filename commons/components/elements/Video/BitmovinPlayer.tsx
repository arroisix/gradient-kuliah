import { Player, PlayerAPI, PlayerConfig, SourceConfig } from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player-ui';
import 'bitmovin-player-ui/dist/css/bitmovinplayer-ui.css';
import { useCallback, useEffect, useRef, useState } from 'react';

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

export default function BitmovinPlayer({
    src,
    drmToken,
    autoPlay = false,
    trackProgress,
    next_subchapter_link
}: BitmovinPlayerProps): JSX.Element {
    const [player, setPlayer] = useState<PlayerAPI | null>(null);
    const playerDiv = useRef<HTMLDivElement>(null);

    const setupPlayer = useCallback((): void => {
        console.log('🎬 [BitmovinPlayer] Starting setupPlayer...');
        console.log('🎬 [BitmovinPlayer] Props received (ignored for test):', {
            src,
            drmToken: drmToken ? 'TOKEN_PROVIDED' : 'NO_TOKEN',
            autoPlay,
            trackProgress: trackProgress ? 'FUNCTION_PROVIDED' : 'NO_FUNCTION',
            next_subchapter_link
        });

        if (!playerDiv.current) {
            console.error(
                '❌ [BitmovinPlayer] playerDiv.current is null, returning early'
            );
            return;
        }
        console.log('✅ [BitmovinPlayer] playerDiv.current is available');

        const playerKey = process.env.NEXT_PUBLIC_BITMOVIN_PLAYER_KEY;
        if (!playerKey) {
            console.error(
                '❌ [BitmovinPlayer] NEXT_PUBLIC_BITMOVIN_PLAYER_KEY not found'
            );
            return;
        }
        console.log(
            '✅ [BitmovinPlayer] Player key available:',
            playerKey.substring(0, 8) + '...'
        );

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
            }
        };

        const sourceConfig: SourceConfig = {
            hls: 'https://streams.bitmovin.com/cv95fqu1pf7itg7cfei0/manifest.m3u8'
        };

        console.log('🔧 [BitmovinPlayer] Player config:', playerConfig);
        console.log('🔧 [BitmovinPlayer] Source config (HARDCODED TEST):', {
            hls: 'https://streams.bitmovin.com/cv95fqu1pf7itg7cfei0/manifest.m3u8',
            drm: 'NONE - Testing without DRM'
        });

        try {
            console.log('🏗️ [BitmovinPlayer] Creating Player instance...');
            const playerInstance = new Player(
                playerDiv.current as HTMLDivElement,
                playerConfig
            );
            console.log(
                '✅ [BitmovinPlayer] Player instance created successfully'
            );

            console.log('🎨 [BitmovinPlayer] Building custom UI...');

            UIFactory.buildModernUI(playerInstance);

            setTimeout(() => {
                console.log('🔧 [BitmovinPlayer] Adding custom controls...');

                const playerContainer = playerInstance.getContainer();
                const controlBar = playerContainer?.querySelector(
                    '.bmpui-ui-controlbar'
                );

                if (controlBar) {
                    console.log(
                        '✅ [BitmovinPlayer] Found control bar, adding skip buttons and CC button...'
                    );

                    const playButton = controlBar.querySelector(
                        '.bmpui-ui-playbacktogglebutton'
                    );

                    if (playButton && playButton.parentElement) {
                        const backwardBtn = document.createElement('div');
                        backwardBtn.className =
                            'bmpui-ui-button custom-skip-backward';
                        backwardBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M11.99 5V1l-5 5l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6s-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8s-3.58-8-8-8m-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57s-.28.26-.45.33s-.37.1-.59.1s-.41-.03-.59-.1s-.33-.18-.46-.33s-.23-.34-.3-.57s-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57s.28-.26.45-.33s.37-.1.59-.1s.41.03.59.1s.33.18.46.33s.23.34.3.57s.11.5.11.82zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31s-.11-.14-.19-.17s-.16-.05-.25-.05s-.18.02-.25.05s-.14.09-.19.17s-.09.18-.12.31s-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32s.11.14.19.17s.16.05.25.05s.18-.02.25-.05s.14-.09.19-.17s.09-.19.11-.32s.04-.29.04-.48v-.97z"/>
                            </svg>
                        `;
                        backwardBtn.style.cssText = `
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            cursor: pointer !important;
                            user-select: none !important;
                            background: transparent !important;
                            border: none !important;
                            color: white !important;
                            margin: 0 !important;
                            opacity: 0.8 !important;
                        `;

                        backwardBtn.addEventListener('click', () => {
                            console.log(
                                '⏪ [BitmovinPlayer] Skip backward 10s'
                            );
                            const currentTime = playerInstance.getCurrentTime();
                            playerInstance.seek(Math.max(0, currentTime - 10));
                        });

                        const forwardBtn = document.createElement('div');
                        forwardBtn.className =
                            'bmpui-ui-button custom-skip-forward';
                        forwardBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6s2.69-6 6-6v4l5-5l-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8s8-3.58 8-8z"/>
                                <path fill="currentColor" d="M10.9 16v-4.27h-.09l-1.77.63v.69l1.01-.31V16zm3.42-4.22c-.18-.07-.37-.1-.59-.1s-.41.03-.59.1s-.33.18-.45.33s-.23.34-.29.57s-.1.5-.1.82v.74c0 .32.04.6.11.82s.17.42.3.57s.28.26.46.33s.37.1.59.1s.41-.03.59-.1s.33-.18.45-.33s.22-.34.29-.57s.1-.5.1-.82v-.74c0-.32-.04-.6-.11-.82s-.17-.42-.3-.57s-.29-.26-.46-.33m.01 2.57c0 .19-.01.35-.04.48s-.06.24-.11.32s-.11.14-.19.17s-.16.05-.25.05s-.18-.02-.25-.05s-.14-.09-.19-.17s-.09-.19-.12-.32s-.04-.29-.04-.48v-.97c0-.19.01.35.04-.48s.06-.23.12-.31s.11-.14.19-.17s.16-.05.25-.05s.18.02.25.05s.14.09.19.17s.09.18.12.31s.04.29.04.48v.97z"/>
                            </svg>
                        `;
                        forwardBtn.style.cssText = `
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            cursor: pointer !important;
                            user-select: none !important;
                            background: transparent !important;
                            border: none !important;
                            color: white !important;
                            margin: 0 !important;
                            opacity: 0.8 !important;
                        `;

                        forwardBtn.addEventListener('click', () => {
                            console.log('⏩ [BitmovinPlayer] Skip forward 10s');
                            const currentTime = playerInstance.getCurrentTime();
                            const duration = playerInstance.getDuration();
                            playerInstance.seek(
                                Math.min(duration, currentTime + 10)
                            );
                        });

                        const ccBtn = document.createElement('div');
                        ccBtn.className = 'bmpui-ui-button custom-cc-button';
                        let ccEnabled = false;

                        ccBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1z"/>
                            </svg>
                        `;
                        ccBtn.style.cssText = `
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            cursor: pointer !important;
                            user-select: none !important;
                            background: transparent !important;
                            border: none !important;
                            color: white !important;
                            margin: 0 !important;
                            opacity: 0.8 !important;
                        `;

                        const updateCCButtonState = (enabled: boolean) => {
                            ccBtn.style.opacity = enabled ? '1' : '0.8';
                            ccBtn.style.backgroundColor = enabled
                                ? 'rgba(95, 43, 206, 0.3)'
                                : 'transparent';
                        };

                        ccBtn.addEventListener('click', () => {
                            console.log(
                                '📺 [BitmovinPlayer] CC button clicked'
                            );

                            try {
                                const subtitleTracks =
                                    playerInstance.subtitles.list();
                                console.log(
                                    'Available subtitle tracks:',
                                    subtitleTracks
                                );

                                if (subtitleTracks.length === 0) {
                                    console.warn(
                                        '⚠️ [BitmovinPlayer] No subtitle tracks available'
                                    );
                                    return;
                                }

                                if (!ccEnabled) {
                                    const firstTrack = subtitleTracks[0];
                                    playerInstance.subtitles.enable(
                                        firstTrack.id
                                    );
                                    ccEnabled = true;
                                    console.log(
                                        '✅ [BitmovinPlayer] Subtitles enabled:',
                                        firstTrack.label || firstTrack.id
                                    );
                                } else {
                                    (playerInstance.subtitles.disable as any)();
                                    ccEnabled = false;
                                    console.log(
                                        '❌ [BitmovinPlayer] Subtitles disabled'
                                    );
                                }

                                updateCCButtonState(ccEnabled);
                            } catch (error) {
                                console.error(
                                    '❌ [BitmovinPlayer] Error toggling subtitles:',
                                    error
                                );
                            }
                        });

                        const speedBtn = document.createElement('div');
                        speedBtn.className =
                            'bmpui-ui-button custom-speed-button';
                        let currentSpeed = 1;
                        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
                        let speedMenuVisible = false;

                        speedBtn.innerHTML = `
                            <span style="font-size: 12px; font-weight: 500;">1x</span>
                        `;
                        speedBtn.style.cssText = `
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            cursor: pointer !important;
                            user-select: none !important;
                            background: transparent !important;
                            border: none !important;
                            color: white !important;
                            margin: 0 !important;
                            opacity: 0.8 !important;
                            position: relative !important;
                        `;

                        const speedMenu = document.createElement('div');
                        speedMenu.className = 'custom-speed-menu';
                        speedMenu.style.cssText = `
                            position: absolute !important;
                            bottom: 100% !important;
                            left: 50% !important;
                            transform: translateX(-50%) !important;
                            background: rgba(0, 0, 0, 0.9) !important;
                            border-radius: 6px !important;
                            margin-bottom: 8px !important;
                            display: none !important;
                            flex-direction: column !important;
                            min-width: 60px !important;
                            z-index: 1000 !important;
                            backdrop-filter: blur(10px) !important;
                            border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        `;

                        speeds.forEach((speed) => {
                            const speedOption = document.createElement('div');
                            speedOption.className = 'speed-option';
                            speedOption.textContent = `${speed}x`;
                            speedOption.style.cssText = `
                                padding: 8px 16px !important;
                                color: white !important;
                                cursor: pointer !important;
                                font-size: 12px !important;
                                text-align: center !important;
                                transition: background-color 0.2s ease !important;
                                ${
                                    speed === currentSpeed
                                        ? 'background-color: rgba(95, 43, 206, 0.3) !important;'
                                        : ''
                                }
                            `;

                            speedOption.addEventListener('mouseenter', () => {
                                if (speed !== currentSpeed) {
                                    (
                                        speedOption as HTMLElement
                                    ).style.backgroundColor =
                                        'rgba(255, 255, 255, 0.1)';
                                }
                            });

                            speedOption.addEventListener('mouseleave', () => {
                                if (speed !== currentSpeed) {
                                    (
                                        speedOption as HTMLElement
                                    ).style.backgroundColor = 'transparent';
                                }
                            });

                            speedOption.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                currentSpeed = speed;
                                playerInstance.setPlaybackSpeed(speed);
                                const spanElement =
                                    speedBtn.querySelector('span');
                                if (spanElement) {
                                    spanElement.textContent = `${speed}x`;
                                }

                                speedMenu
                                    .querySelectorAll('.speed-option')
                                    .forEach((option) => {
                                        if (
                                            option.textContent === `${speed}x`
                                        ) {
                                            (
                                                option as HTMLElement
                                            ).style.backgroundColor =
                                                'rgba(95, 43, 206, 0.3)';
                                        } else {
                                            (
                                                option as HTMLElement
                                            ).style.backgroundColor =
                                                'transparent';
                                        }
                                    });

                                speedMenu.style.display = 'none';
                                speedMenuVisible = false;

                                console.log(
                                    `⚡ [BitmovinPlayer] Playback speed changed to ${speed}x`
                                );
                            });

                            speedMenu.appendChild(speedOption);
                        });

                        speedBtn.appendChild(speedMenu);

                        speedBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            speedMenuVisible = !speedMenuVisible;
                            speedMenu.style.display = speedMenuVisible
                                ? 'flex'
                                : 'none';
                            console.log(
                                '⚡ [BitmovinPlayer] Speed menu toggled:',
                                speedMenuVisible
                            );
                        });

                        const hideSpeedMenu = (e: Event) => {
                            if (
                                speedMenuVisible &&
                                !speedBtn.contains(e.target as Node)
                            ) {
                                speedMenu.style.display = 'none';
                                speedMenuVisible = false;
                            }
                        };

                        document.addEventListener('click', hideSpeedMenu);

                        const timeDisplay = document.createElement('div');
                        timeDisplay.className =
                            'bmpui-ui-label custom-time-display';
                        timeDisplay.style.cssText = `
                            color: white !important;
                            font-size: 12px !important;
                            font-family: inherit !important;
                            display: flex !important;
                            align-items: center !important;
                            white-space: nowrap !important;
                            user-select: none !important;
                        `;

                        const formatTime = (seconds: number): string => {
                            const mins = Math.floor(seconds / 60);
                            const secs = Math.floor(seconds % 60);
                            return `${mins.toString().padStart(2, '0')}:${secs
                                .toString()
                                .padStart(2, '0')}`;
                        };

                        const updateTimeDisplay = () => {
                            const currentTime = playerInstance.getCurrentTime();
                            const duration = playerInstance.getDuration();
                            timeDisplay.textContent = `${formatTime(
                                currentTime
                            )}/${formatTime(duration)}`;
                        };

                        const nextElement = playButton.nextElementSibling;
                        playButton.parentElement.insertBefore(
                            backwardBtn,
                            nextElement
                        );
                        playButton.parentElement.insertBefore(
                            forwardBtn,
                            nextElement
                        );

                        const volumeButton =
                            controlBar.querySelector(
                                '.bmpui-ui-volumeslider'
                            ) ||
                            controlBar.querySelector(
                                '.bmpui-ui-volumecontrolbutton'
                            );

                        if (volumeButton && volumeButton.parentElement) {
                            const volumeNextElement =
                                volumeButton.nextElementSibling;
                            volumeButton.parentElement.insertBefore(
                                timeDisplay,
                                volumeNextElement
                            );
                        } else {
                            playButton.parentElement.insertBefore(
                                timeDisplay,
                                nextElement
                            );
                        }

                        const pipButton = controlBar.querySelector(
                            '.bmpui-ui-piptogglebutton'
                        );
                        const fullscreenButton = controlBar.querySelector(
                            '.bmpui-ui-fullscreentogglebutton'
                        );
                        const settingsButton = controlBar.querySelector(
                            '.bmpui-ui-settingstogglebutton'
                        );

                        const rightSideButton =
                            pipButton || fullscreenButton || settingsButton;

                        if (rightSideButton && rightSideButton.parentElement) {
                            rightSideButton.parentElement.insertBefore(
                                ccBtn,
                                rightSideButton
                            );

                            rightSideButton.parentElement.insertBefore(
                                speedBtn,
                                ccBtn
                            );

                            console.log(
                                '✅ [BitmovinPlayer] CC and Speed buttons positioned on right side'
                            );
                        } else {
                            controlBar.appendChild(speedBtn);
                            controlBar.appendChild(ccBtn);
                            console.log(
                                '⚠️ [BitmovinPlayer] Right-side buttons not found, added to end of control bar'
                            );
                        }

                        playerInstance.on(
                            'timeChanged' as any,
                            updateTimeDisplay
                        );
                        playerInstance.on(
                            'durationChanged' as any,
                            updateTimeDisplay
                        );
                        playerInstance.on('seeked' as any, updateTimeDisplay);

                        setTimeout(updateTimeDisplay, 100);

                        console.log(
                            '✅ [BitmovinPlayer] Skip buttons, CC button, speed button, and time display added successfully'
                        );
                    } else {
                        console.error(
                            '❌ [BitmovinPlayer] Could not find play button'
                        );
                    }
                } else {
                    console.error(
                        '❌ [BitmovinPlayer] Could not find control bar'
                    );
                }

                const style = document.createElement('style');
                style.textContent = `
                    .bmpui-ui-timelabel,
                    .bmpui-ui-timelabel-timeplayed,
                    .bmpui-ui-timelabel-timetotal {
                        display: none !important;
                    }
                    
                    .bmpui-ui-playbacktimelabel.bmpui-text-right {
                        display: none !important;
                    }
                    
                    .bmpui-ui-playbacktimelabel {
                        display: none !important;
                    }
                    
                    .bmpui-ui-playbackspeedselectionbutton {
                        display: none !important;
                    }
                    
                    .bmpui-ui-seekbar .bmpui-seekbar-playbackposition,
                    .bmpui-ui-seekbar .bmpui-seekbar-playbackposition-marker {
                        background-color: #5F2BCE !important;
                    }
                    
                    .bmpui-ui-volumeslider .bmpui-seekbar .bmpui-seekbar-playbackposition-marker, .bmpui-ui-seekbar .bmpui-seekbar .bmpui-seekbar-playbackposition-marker {
                        border: none !important;
                    }
                    
                    .bmpui-ui-seekbar .bmpui-seekbar-bufferlevel {
                        background-color: rgba(255, 255, 255, 0.3) !important;
                    }
                    
                    .bmpui-ui-volumeslider .bmpui-slider-track-playbackposition,
                    .bmpui-ui-volumeslider .bmpui-slider-playbackposition {
                        background-color: #5F2BCE !important;
                    }
                    
                    .bmpui-ui-seekbar .bmpui-seekbar-thumb {
                        background-color: #5F2BCE !important;
                        border-color: #5F2BCE !important;
                    }
                    
                    .bmpui-ui-volumeslider .bmpui-slider-thumb {
                        background-color: #5F2BCE !important;
                        border-color: #5F2BCE !important;
                    }
                    
                    .bmpui-ui-hugeplaybacktogglebutton .bmpui-ui-playbacktogglebutton {
                        border: none !important;
                        outline: none !important;
                    }
                    
                    .bmpui-ui-hugeplaybacktogglebutton .bmpui-ui-playbacktogglebutton:focus {
                        border: none !important;
                        outline: none !important;
                        box-shadow: none !important;
                    }
                    
                    .bmpui-ui-hugeplaybacktogglebutton {
                        border: none !important;
                        outline: none !important;
                    }
                    
                    .bmpui-watermark,
                    .bmpui-ui-watermark {
                        display: none !important;
                    }
                    
                    .custom-skip-backward,
                    .custom-skip-forward,
                    .custom-cc-button,
                    .custom-speed-button {
                        background: transparent !important;
                        border: none !important;
                        color: white !important;
                        opacity: 0.8 !important;
                        transition: opacity 0.2s ease, background-color 0.2s ease !important;
                    }
                    
                    .custom-skip-backward:hover,
                    .custom-skip-forward:hover,
                    .custom-cc-button:hover,
                    .custom-speed-button:hover {
                        background: transparent !important;
                        border: none !important;
                        opacity: 1 !important;
                    }
                    
                    .custom-cc-button.active {
                        background-color: rgba(95, 43, 206, 0.3) !important;
                        opacity: 1 !important;
                    }
                    
                    .custom-time-display {
                        color: white !important;
                        font-size: 12px !important;
                        opacity: 0.9 !important;
                    }
                    
                    .custom-speed-menu {
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
                    }
                    
                    .custom-speed-menu .speed-option {
                        border-radius: 0 !important;
                    }
                    
                    .custom-speed-menu .speed-option:first-child {
                        border-radius: 6px 6px 0 0 !important;
                    }
                    
                    .custom-speed-menu .speed-option:last-child {
                        border-radius: 0 0 6px 6px !important;
                    }
                `;
                document.head.appendChild(style);

                console.log(
                    '✅ [BitmovinPlayer] Custom controls and styling applied'
                );
            }, 100);

            console.log('✅ [BitmovinPlayer] UI built successfully');

            playerInstance.on('ready' as any, () => {
                console.log('✅ [BitmovinPlayer] Player ready event fired');
            });

            playerInstance.on('sourceLoaded' as any, () => {
                console.log('✅ [BitmovinPlayer] Source loaded event fired');
            });

            playerInstance.on('error' as any, (event: any) => {
                console.error('❌ [BitmovinPlayer] Player error event:', event);
            });

            playerInstance.on('warning' as any, (event: any) => {
                console.warn('⚠️ [BitmovinPlayer] Player warning:', event);
            });

            playerInstance.on('play' as any, () => {
                console.log('▶️ [BitmovinPlayer] Play event fired');
            });

            playerInstance.on('paused' as any, () => {
                console.log('⏸️ [BitmovinPlayer] Pause event fired');
            });

            console.log('📥 [BitmovinPlayer] Loading source...');
            playerInstance.load(sourceConfig).then(
                () => {
                    console.log(
                        '✅ [BitmovinPlayer] Source loaded successfully'
                    );
                    setPlayer(playerInstance);
                },
                (error) => {
                    console.error(
                        '❌ [BitmovinPlayer] Error while loading source:',
                        error
                    );
                }
            );
        } catch (error) {
            console.error(
                '❌ [BitmovinPlayer] Error during player setup:',
                error
            );
        }
    }, [autoPlay]);

    useEffect(() => {
        console.log(
            '🔄 [BitmovinPlayer] useEffect called, running setupPlayer'
        );
        setupPlayer();

        return () => {
            console.log('🧹 [BitmovinPlayer] Cleanup function called');

            function destroyPlayer(): void {
                if (player != null) {
                    console.log('🗑️ [BitmovinPlayer] Destroying player');
                    player.destroy();
                    setPlayer(null);
                } else {
                    console.log('ℹ️ [BitmovinPlayer] No player to destroy');
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
