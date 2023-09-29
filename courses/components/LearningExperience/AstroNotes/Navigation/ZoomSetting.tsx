import React, { Dispatch, SetStateAction } from 'react';

type ZoomSettingProps = {
    zoom: number;
    setZoom: Dispatch<SetStateAction<number>>;
};

const ZoomSetting = ({ zoom, setZoom }: ZoomSettingProps): JSX.Element => {
    function handleZoomIn(): void {
        setZoom((prev) => (prev + 25 > 500 ? 500 : prev + 25));
    }

    function handleZoomOut(): void {
        setZoom((prev) => (prev - 25 < 25 ? 25 : prev - 25));
    }
    return (
        <div className="flex items-center gap-[10px]">
            <div
                className="w-[16px] h-[16px] pb-[2px] flex items-center justify-center font-body leading-[0] bg-neutral-200 dark:bg-[#666666] rounded-full cursor-pointer select-none"
                onClick={handleZoomOut}
                aria-hidden>
                -
            </div>
            <span className="inline-block font-body text-xs select-none">
                {zoom}%
            </span>
            <div
                className="w-[16px] h-[16px] pb-[1px] flex items-center justify-center font-body leading-[0] bg-neutral-200 dark:bg-[#666666] rounded-full cursor-pointer select-none"
                onClick={handleZoomIn}
                aria-hidden>
                +
            </div>
        </div>
    );
};

export default ZoomSetting;
