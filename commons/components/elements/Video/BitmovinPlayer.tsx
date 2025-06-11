import { Player, PlayerAPI, PlayerConfig, SourceConfig } from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player-ui';
import 'bitmovin-player-ui/dist/css/bitmovinplayer-ui.css';
import { Info } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

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
        console.log('🎬 [BitmovinPlayer] Props received:', {
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
            }
        };

        const sourceConfig: SourceConfig = {
            hls: src,
            drm: {
                widevine: {
                    LA_URL: 'https://drm-widevine-licensing.axprod.net/AcquireLicense',
                    headers: {
                        'X-AxDRM-Message': drmToken
                    }
                },
                playready: {
                    LA_URL: 'https://drm-playready-licensing.axprod.net/AcquireLicense',
                    headers: {
                        'X-AxDRM-Message': drmToken
                    }
                },
                fairplay: {
                    LA_URL: 'https://drm-fairplay-licensing.axprod.net/AcquireLicense',
                    headers: {
                        'X-AxDRM-Message': drmToken
                    }
                }
            }
        };

        console.log('🔧 [BitmovinPlayer] Player config:', playerConfig);
        console.log('🔧 [BitmovinPlayer] Source config:', {
            hls: src,
            drm: 'DRM_CONFIG_PROVIDED'
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

            console.log('🎨 [BitmovinPlayer] Building UI with UIFactory...');
            UIFactory.buildModernUI(playerInstance);
            console.log('✅ [BitmovinPlayer] UI built successfully');

            // Add event listeners for debugging
            playerInstance.on('ready', () => {
                console.log('✅ [BitmovinPlayer] Player ready event fired');
            });

            playerInstance.on('sourceloaded', () => {
                console.log('✅ [BitmovinPlayer] Source loaded event fired');
            });

            playerInstance.on('error', (event: any) => {
                console.error('❌ [BitmovinPlayer] Player error event:', event);
            });

            playerInstance.on('warning', (event: any) => {
                console.warn('⚠️ [BitmovinPlayer] Player warning:', event);
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
    }, [src, drmToken, autoPlay]);

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
            <div className="flex-col mb-4 alert">
                <Info size={24} className="text-info" />
                <div className="flex flex-col">
                    <div className="text-sm font-bold">
                        Default player UI comes with a Bitmovin watermark.
                    </div>
                    <div className="text-xs">
                        Player UI is completely customizable, but not included
                        in POC to save some time.
                    </div>
                </div>
            </div>
            <div
                id="player"
                className="rounded-lg overflow-clip"
                ref={playerDiv}
            />
        </div>
    );
}
