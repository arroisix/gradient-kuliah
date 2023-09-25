import Switch from 'commons/components/elements/Form/switch';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import { capitalize, cn } from 'commons/utils';
import React, { Dispatch, SetStateAction } from 'react';

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
    const fontStyleOptions: AstronotesFontStyle[] = [
        'DEFAULT',
        'SERIF',
        'MONO'
    ];

    return (
        <>
            <div className="flex items-center justify-between">
                <span className="inline-block font-body text-sm text-black dark:text-[#CCCCCC]">
                    Tampilan Gelap
                </span>
                <Switch checked={theme === 'dark'} setChecked={toggleTheme} />
            </div>
            <div className="inline-block font-body text-sm text-black dark:text-[#CCCCCC]">
                Style
            </div>
            <div className="flex gap-2">
                {fontStyleOptions.map((btn) => {
                    const isActive = fontStyle === btn;
                    return (
                        <button
                            key={btn}
                            className={cn(
                                'gap-1 normal-case flex-col btn btn-square btn-lg btn-ghost',
                                isActive && 'bg-white dark:bg-neutral-800'
                            )}
                            onClick={() => setFontStyle(btn)}>
                            <span
                                className={cn({
                                    'font-sans': btn === 'DEFAULT',
                                    'font-mono': btn === 'MONO',
                                    'font-serif': btn === 'SERIF',
                                    'text-accent-purple dark:text-[#B6A6F3]':
                                        isActive
                                })}>
                                Ag
                            </span>
                            <span className="text-[10px] text-[#999999] dark:text-[#CCCCCC]">
                                {capitalize(btn)}
                            </span>
                        </button>
                    );
                })}
            </div>
            <div className="flex items-center justify-between">
                <span className="inline-block font-body text-sm text-black dark:text-[#CCCCCC]">
                    Small text
                </span>
                <Switch checked={smallText} setChecked={setSmallText} />
            </div>
        </>
    );
};

export default AppearanceSettings;
