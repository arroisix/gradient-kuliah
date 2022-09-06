/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import {
    BiFullscreen,
    BiExitFullscreen,
    BiVolumeFull,
    BiVolumeMute
} from 'react-icons/bi';
import Spinner from '../Spinner';

interface Time {
    hh: string;
    mm: string;
    ss: string;
}

export interface Props {
    max: number;
    currentTime: number;
    progress?: number;
    onChange: (time: number) => void;
    hideHoverTime?: boolean;
    offset?: number;
    secondsPrefix?: string;
    minutesPrefix?: string;
    limitTimeTooltipBySides?: boolean;
    isPlay: boolean;
    onPlay: () => void;
    onFullScreen: () => void;
    isFullScreen: boolean;
    isBuffering?: boolean;
    popupArea?: number[];
    isMute: boolean;
    onMute: () => void;
    volume: number;
    setVolume: (wantedVolume: number) => void;
}

function secondsToTime(seconds: number, offset: number): Time {
    const roundedSeconds = Math.round(seconds + offset);

    const hours: number = Math.floor(roundedSeconds / 3600);
    const divirsForMinutes: number = roundedSeconds % 3600;
    const minutes: number = Math.floor(divirsForMinutes / 60);
    const sec: number = Math.ceil(divirsForMinutes % 60);

    return {
        hh: hours.toString(),
        mm: minutes < 10 ? `0${minutes}` : minutes.toString(),
        ss: sec < 10 ? `0${sec}` : sec.toString()
    };
}

export const VideoSeekSlider: React.FC<Props> = ({
    max = 100,
    currentTime = 0,
    progress = 0,
    hideHoverTime = false,
    offset = 0,
    secondsPrefix = '',
    minutesPrefix = '',
    onChange = () => undefined,
    limitTimeTooltipBySides = false,
    isPlay = false,
    onPlay,
    isMute = false,
    onMute,
    volume = 50,
    setVolume,
    onFullScreen,
    isFullScreen,
    isBuffering,
    popupArea
}) => {
    const [seekHoverPosition, setSeekHoverPosition] = useState(0);

    const seeking = useRef(false);
    const trackWidth = useRef(0);
    const mobileSeeking = useRef(false);
    const track = useRef<HTMLDivElement>(null);
    const hoverTime = useRef<HTMLDivElement>(null);
    const [isHoverVolume, setIsHoverVolume] = useState(false);

    const hoverTimeValue = useMemo(() => {
        const percent: number = (seekHoverPosition * 100) / trackWidth.current;
        const time: number = Math.floor(+(percent * (max / 100)));
        const times: Time = secondsToTime(time, offset);

        if (max + offset < 60) {
            return secondsPrefix + times.ss;
        }

        if (max + offset < 3600) {
            return `${minutesPrefix + times.mm}:${times.ss}`;
        }

        return `${times.hh}:${times.mm}:${times.ss}`;
    }, [max, minutesPrefix, offset, secondsPrefix, seekHoverPosition]);

    function changeCurrentTimePosition(pageX: number): void {
        const maxTrack = track.current?.offsetWidth ?? -1;
        const left = track.current?.getBoundingClientRect().left || 0;

        const position = pageX - left;

        const percentage = position / maxTrack;

        onChange(max * percentage);

        setSeekHoverPosition(position);
    }

    function handleTouchSeeking(event: TouchEvent): void {
        event.preventDefault();
        event.stopPropagation();

        let pageX = 0;

        for (let i = 0; i < event.changedTouches.length; i++) {
            pageX = event.changedTouches?.[i].pageX;
        }

        pageX = pageX < 0 ? 0 : pageX;

        if (mobileSeeking.current) {
            changeCurrentTimePosition(pageX);
        }
    }

    function handleSeeking(event: MouseEvent): void {
        if (seeking.current) {
            changeCurrentTimePosition(event.pageX);
        }
    }

    function setTrackWidthState(): void {
        if (track.current) {
            trackWidth.current = track.current.offsetWidth;
        }
    }

    function handleTrackHover(
        clear: boolean,
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void {
        const left = track.current?.getBoundingClientRect().left || 0;
        const position = clear ? 0 : event.pageX - left;

        setSeekHoverPosition(position);
    }

    function getPositionStyle(time: number): { width: string } {
        const divider = max / 60 || -1; // prevent division by zero
        const position = time / 60 / divider;

        return { width: `${position * 100}%` };
    }

    function getThumbHandlerPosition(): { transform: string } {
        const position = trackWidth.current / (max / currentTime);

        return { transform: `translateX(${position}px)` };
    }

    function getSeekHoverPosition(): { transform: string } {
        const position = (seekHoverPosition * 100) / trackWidth.current;

        return { transform: `scaleX(${position / 100})` };
    }

    function getHoverTimePosition(): { transform: string } {
        let position = 0;

        if (hoverTime.current) {
            position = seekHoverPosition - hoverTime.current.offsetWidth / 2;

            if (limitTimeTooltipBySides) {
                if (position < 0) {
                    position = 0;
                } else if (
                    position + hoverTime.current.offsetWidth >
                    trackWidth.current
                ) {
                    position =
                        trackWidth.current - hoverTime.current.offsetWidth;
                }
            }
        }

        return { transform: `translateX(${position}px)` };
    }

    function setMobileSeeking(state = true): void {
        mobileSeeking.current = state;
        setSeekHoverPosition(state ? seekHoverPosition : 0);
    }

    function setSeeking(state: boolean, event: MouseEvent): void {
        event.preventDefault();

        handleSeeking(event);
        seeking.current = state;

        setSeekHoverPosition(state ? seekHoverPosition : 0);
    }

    function mouseSeekingHandler(event: MouseEvent): void {
        setSeeking(false, event);
    }

    function mobileTouchSeekingHandler(): void {
        setMobileSeeking(false);
    }

    function isThumbActive(): boolean {
        return seekHoverPosition > 0 || seeking.current;
    }

    useEffect(() => {
        setTrackWidthState();

        window.addEventListener('resize', setTrackWidthState);
        window.addEventListener('mousemove', handleSeeking);
        window.addEventListener('mouseup', mouseSeekingHandler);
        window.addEventListener('touchmove', handleTouchSeeking);
        window.addEventListener('touchend', mobileTouchSeekingHandler);

        return () => {
            window.removeEventListener('resize', setTrackWidthState);
            window.removeEventListener('mousemove', handleSeeking);
            window.removeEventListener('mouseup', mouseSeekingHandler);
            window.removeEventListener('touchmove', handleTouchSeeking);
            window.removeEventListener('touchend', mobileTouchSeekingHandler);
        };
    }, [max, offset]);

    return (
        <div className="w-full px-4 py-2 bg-transparent">
            <div
                ref={track}
                aria-hidden
                onMouseMove={(event) => handleTrackHover(false, event)}
                onMouseLeave={(event) => handleTrackHover(true, event)}
                onMouseDown={(event) => setSeeking(true, event as any)}
                onTouchStart={() => setMobileSeeking(true)}
                className="w-full overflow-x-hidden overflow-y-visible bg-neutral-800 rounded-md cursor-pointer">
                <div className="w-full h-2 relative">
                    <div
                        style={getPositionStyle(progress)}
                        className="h-2 bg-neutral-500 rounded-md cursor-pointer z-[1] absolute bottom-0 left-0"
                    />

                    <div style={getSeekHoverPosition()} />

                    <div
                        style={getPositionStyle(currentTime)}
                        className="h-2 bg-red-400 rounded-md cursor-pointer z-[2] absolute bottom-0 left-0"
                    />
                </div>
                <div
                    style={getThumbHandlerPosition()}
                    className="absolute bottom-[3.2rem] left-[0.2rem] z-[8]">
                    {isThumbActive() && (
                        <div className="w-4 h-4 bg-red-400 rounded-full" />
                    )}
                </div>
                {popupArea?.map((position) => (
                    <div
                        key={position}
                        style={{
                            transform: `translateX(${
                                trackWidth.current / (max / position)
                            }px)`
                        }}
                        className="absolute bottom-[3.5rem] z-[8] cursor-pointer">
                        {
                            <div className="w-[2px] h-2 bg-yellow-400 opacity-30 hover:opacity-100" />
                        }
                    </div>
                ))}
            </div>
            {
                <div className="w-full h-8 my-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="cursor-pointer"
                            onClick={onPlay}
                            aria-hidden>
                            {isPlay ? <FaPause /> : <FaPlay />}
                        </div>
                        <div
                            className="mr-4 cursor-pointer flex gap-2"
                            onMouseEnter={() => setIsHoverVolume(true)}
                            onMouseLeave={() => setIsHoverVolume(false)}>
                            {isMute ? (
                                <FaVolumeMute
                                    className="text-xl"
                                    onClick={onMute}
                                    aria-hidden
                                />
                            ) : (
                                <FaVolumeUp
                                    className="text-xl"
                                    onClick={onMute}
                                    aria-hidden
                                />
                            )}
                            {isHoverVolume && (
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    className="transition-all"
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setVolume(
                                            event.target
                                                .value as unknown as number
                                        )
                                    }
                                    id="myRange"
                                />
                            )}
                        </div>
                        <div>{`${secondsToTime(currentTime, 0).hh}:${
                            secondsToTime(currentTime, 0).mm
                        }:${secondsToTime(currentTime, 0).ss}/${
                            secondsToTime(max, 0).hh
                        }:${secondsToTime(max, 0).mm}:${
                            secondsToTime(max, 0).ss
                        }`}</div>
                        {isBuffering && <Spinner size="small" />}
                    </div>
                    <div className="flex items-center">
                        <div
                            className="cursor-pointer"
                            onClick={onFullScreen}
                            aria-hidden>
                            {isFullScreen ? (
                                <BiExitFullscreen className="text-xl" />
                            ) : (
                                <BiFullscreen className="text-xl" />
                            )}
                        </div>
                    </div>
                </div>
            }

            {!hideHoverTime && (
                <div
                    className={
                        isThumbActive()
                            ? 'absolute bg-neutral-800 rounded-lg p-1 z-[8] -top-10'
                            : 'hidden'
                    }
                    style={getHoverTimePosition()}
                    ref={hoverTime}>
                    {hoverTimeValue}
                </div>
            )}
        </div>
    );
};
