import { useThemeContext } from 'commons/contexts/ThemeProvider';
import React, { Dispatch, SetStateAction } from 'react';
import { FaToggleOn } from 'react-icons/fa';

type AppearanceSettingsProps = {
    fontStyle: AstronotesFontStyle;
    setFontStyle: Dispatch<SetStateAction<AstronotesFontStyle>>;
    smallText: boolean;
    setSmallText: Dispatch<SetStateAction<boolean>>;
};

const AppearanceSettings = ({
    fontStyle,
    setFontStyle,
    smallText,
    setSmallText
}: AppearanceSettingsProps): JSX.Element => {
    const { theme, toggleTheme } = useThemeContext();

    return (
        <>
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleTheme}
                aria-hidden>
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC]">
                    Tampilan Gelap
                </span>
                <div className="relative w-max h-max">
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[20px] h-[10px] bg-[#D9D9D9]" />
                    <FaToggleOn
                        size={24}
                        className={`relative text-[#333333] ${
                            theme === 'light' && 'rotate-180'
                        }`}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC]">
                    Style
                </span>
                <div className="flex gap-2">
                    <div
                        className={`flex flex-col items-center gap-[2px] w-[55px] pt-[5px] pb-[7px] hover:bg-neutral-200 dark:hover:bg-[#2D2D2D] rounded-lg cursor-pointer ${
                            fontStyle === 'DEFAULT' &&
                            'bg-white dark:bg-[#212121]'
                        }`}
                        onClick={() => setFontStyle('DEFAULT')}
                        aria-hidden>
                        <span
                            className={`inline-block font-body ${
                                fontStyle === 'DEFAULT' && 'text-[#B6A6F3]'
                            }`}>
                            Ag
                        </span>
                        <span className="inline-block font-body text-[10px] text-[#999999] dark:text-[#CCCCCC]">
                            Default
                        </span>
                    </div>
                    <div
                        className={`flex flex-col items-center gap-[2px] w-[55px] pt-[5px] pb-[7px] hover:bg-neutral-200 dark:hover:bg-[#2D2D2D] rounded-lg cursor-pointer ${
                            fontStyle === 'SERIF' &&
                            'bg-white dark:bg-[#212121]'
                        }`}
                        onClick={() => setFontStyle('SERIF')}
                        aria-hidden>
                        <span
                            className={`inline-block font-serif ${
                                fontStyle === 'SERIF' && 'text-[#B6A6F3]'
                            }`}>
                            Ag
                        </span>
                        <span className="inline-block font-body text-[10px] text-[#999999] dark:text-[#CCCCCC]">
                            Serif
                        </span>
                    </div>
                    <div
                        className={`flex flex-col items-center gap-[2px] w-[55px] pt-[5px] pb-[7px] hover:bg-neutral-200 dark:hover:bg-[#2D2D2D] rounded-lg cursor-pointer ${
                            fontStyle === 'MONO' && 'bg-white dark:bg-[#212121]'
                        }`}
                        onClick={() => setFontStyle('MONO')}
                        aria-hidden>
                        <span
                            className={`inline-block font-mono ${
                                fontStyle === 'MONO' && 'text-[#B6A6F3]'
                            }`}>
                            Ag
                        </span>
                        <span className="inline-block font-body text-[10px] text-[#999999] dark:text-[#CCCCCC]">
                            Mono
                        </span>
                    </div>
                </div>
            </div>
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setSmallText((prev) => !prev)}
                aria-hidden>
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC]">
                    Small text
                </span>
                <div className="relative w-max h-max">
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[20px] h-[10px] bg-[#D9D9D9]" />
                    <FaToggleOn
                        size={24}
                        className={`relative text-[#333333] ${
                            !smallText && 'rotate-180'
                        }`}
                    />
                </div>
            </div>
        </>
    );
};

export default AppearanceSettings;
