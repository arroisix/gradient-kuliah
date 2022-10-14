import { useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { MdSpeed } from 'react-icons/md';

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
                className="w-full flex items-center gap-1 border-b border-neutral-400 p-4 cursor-pointer"
                onClick={onBack}
                aria-hidden>
                <BiChevronLeft />
                <span>{title}</span>
            </div>
            <div className="max-h-[60px] lg:max-h-[500px]">
                {dataOption.map((d) => (
                    <div
                        key={`${d.value}`}
                        className={`flex justify-between items-center w-full gap-4 text-xs lg:text-base font-body hover:bg-neutral-600 p-4 rounded cursor-pointer ${
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
    playback,
    setPlayback
}: {
    playback: number;
    setPlayback: (target: number) => void;
}): JSX.Element => {
    const [showPlayback, setShowPlayback] = useState(false);

    return (
        <div
            className="absolute bg-neutral-800 rounded right-4 bottom-20 z-[10] flex justify-center items-center overflow-y-auto"
            aria-hidden>
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
            {!showPlayback && (
                <div
                    className="transition-all flex justify-between items-center w-full gap-4 text-xs lg:text-base font-body hover:bg-neutral-600 p-4 rounded cursor-pointer"
                    onClick={() => setShowPlayback(true)}
                    aria-hidden>
                    <div className="flex gap-2 items-center ">
                        <MdSpeed />
                        <span>Kecepatan pemutaran</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <span>{playback == 1 ? 'Normal' : playback}</span>
                        <BiChevronRight />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
