import { useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { MdSpeed } from 'react-icons/md';
import { VscSettings } from 'react-icons/vsc';
import { toast } from 'react-toastify';
import { useVideoPlayer } from '../context/VideoPlayerProvider';

const QUALITY_DICT: { [key: number]: string } = {
    '-1': 'Otomatis',
    0: '144p',
    1: '240p',
    2: '360p',
    3: '480p',
    4: '720p',
    5: '1080p'
};

const MenuContainer = <T,>({
    onBack,
    title,
    data,
    setData,
    dataOption
}: {
    onBack: () => void;
    data: T;
    title: string;
    setData: (data: T) => void;
    dataOption: { value: T; label: string }[];
}): JSX.Element => {
    return (
        <div className="h-full text-xs lg:text-base font-body transition-all">
            <div
                className="w-full flex items-center justify-end gap-1 border-b border-neutral-400 p-4 cursor-pointer"
                onClick={onBack}
                aria-hidden>
                <BiChevronLeft />
                <span>{title}</span>
            </div>
            <div className="max-h-[60px] md:max-h-[100px] lg:max-h-[200px] min-w-[150px]">
                {dataOption.map((d) => (
                    <div
                        key={`${d.value}`}
                        className={`flex items-center text-center justify-end w-full gap-4 text-xs lg:text-base font-body hover:bg-neutral-600 p-4 rounded cursor-pointer ${
                            data === d.value
                                ? 'text-accent-yellow'
                                : 'text-white'
                        }`}
                        aria-hidden
                        onClick={() => {
                            setData(d.value);
                            onBack();
                        }}>
                        <span>{d.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Settings = ({
    isSupportHLS,
    isMuxVideo
}: {
    isSupportHLS: boolean;
    isMuxVideo: boolean;
}): JSX.Element => {
    const { playback, setPlayback, quality, setQuality } = useVideoPlayer();
    const [showPlayback, setShowPlayback] = useState(false);
    const [showQuality, setShowQuality] = useState(false);

    return (
        <div
            className="absolute bg-neutral-800 rounded right-4 bottom-20 z-[10] flex justify-center items-center overflow-y-auto"
            aria-hidden>
            {showQuality && (
                <MenuContainer<number>
                    onBack={() => setShowQuality(false)}
                    data={quality}
                    title="Kualitas"
                    setData={setQuality}
                    dataOption={
                        isMuxVideo
                            ? [
                                  {
                                      value: -1,
                                      label: 'Otomatis'
                                  },
                                  {
                                      value: 0,
                                      label: '144p'
                                  },
                                  {
                                      value: 1,
                                      label: '240p'
                                  },
                                  {
                                      value: 2,
                                      label: '360p'
                                  },
                                  {
                                      value: 3,
                                      label: '480p'
                                  }
                              ]
                            : [
                                  {
                                      value: -1,
                                      label: 'Otomatis'
                                  },
                                  {
                                      value: 0,
                                      label: '144p'
                                  },
                                  {
                                      value: 1,
                                      label: '240p'
                                  },
                                  {
                                      value: 2,
                                      label: '360p'
                                  },
                                  {
                                      value: 3,
                                      label: '480p'
                                  },
                                  {
                                      value: 4,
                                      label: '720p'
                                  },
                                  {
                                      value: 5,
                                      label: '1080p [HD]'
                                  }
                              ]
                    }
                />
            )}
            {showPlayback && (
                <MenuContainer<number>
                    onBack={() => setShowPlayback(false)}
                    data={playback}
                    title="Kecepatan pemutaran"
                    setData={setPlayback}
                    dataOption={[
                        {
                            value: 0.5,
                            label: '0.5'
                        },
                        {
                            value: 0.75,
                            label: '0.75'
                        },
                        {
                            value: 1,
                            label: 'Normal'
                        },
                        {
                            value: 1.5,
                            label: '1.5'
                        },
                        {
                            value: 2,
                            label: '2'
                        }
                    ]}
                />
            )}
            {!showPlayback && !showQuality && (
                <div className="transition-all w-full gap-4 text-xs lg:text-base font-body">
                    <div
                        onClick={() => setShowPlayback(true)}
                        aria-hidden
                        className="flex justify-between items-center w-full gap-4 text-xs lg:text-base font-body hover:bg-neutral-600 p-4 rounded cursor-pointer">
                        <div className="flex gap-2 items-center ">
                            <div>
                                <MdSpeed />
                            </div>
                            <span>Kecepatan pemutaran</span>
                        </div>
                        <div className="flex gap-1 items-center">
                            <span>{playback == 1 ? 'Normal' : playback}</span>
                            <BiChevronRight />
                        </div>
                    </div>
                    <div
                        onClick={
                            isSupportHLS
                                ? () => setShowQuality(true)
                                : () =>
                                      toast.info(
                                          'Saat ini video belum support pergantian kualitas video secara manual, Tunggu kabar terbaru dari Gradient'
                                      )
                        }
                        aria-hidden
                        className="flex justify-between items-center w-full gap-4 text-xs lg:text-base font-body hover:bg-neutral-600 p-4 rounded cursor-pointer">
                        <div className="flex gap-2 items-center">
                            <div>
                                <VscSettings />
                            </div>
                            <span>Kualitas</span>
                        </div>
                        <div className="flex gap-1 items-center">
                            <span>{QUALITY_DICT[quality]}</span>
                            <BiChevronRight />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
