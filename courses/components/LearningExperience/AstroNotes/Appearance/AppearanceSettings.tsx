import Switch from 'commons/components/elements/Form/switch';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import { capitalize, cn } from 'commons/utils';
import React from 'react';
import { fontClassName } from 'courses/components/LearningExperience/AstroNotes/constants';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';

const AppearanceSettings = (): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { fontStyle, setFontStyle, smallText, setSmallText } =
        useAstronotes();
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
                <Switch
                    checked={theme === 'dark'}
                    setChecked={(checked) => {
                        tracker?.genericTrack('Toggle Color Theme Settings', {
                            'Book Slug': router.query.slug,
                            'Book Page Query': router.query.page,
                            Theme: checked ? 'dark' : 'light'
                        });
                        toggleTheme();
                    }}
                />
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
                            onClick={() => {
                                tracker?.genericTrack(
                                    'Click Font Settings Button',
                                    {
                                        'Book Slug': router.query.slug,
                                        'Book Page Query': router.query.page,
                                        'Font Name': btn
                                    }
                                );
                                setFontStyle(btn);
                            }}>
                            <span
                                className={cn(fontClassName[btn], {
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
                <Switch
                    checked={smallText}
                    setChecked={(checked) => {
                        tracker?.genericTrack('Toggle Text Size', {
                            'Book Slug': router.query.slug,
                            'Book Page Query': router.query.page,
                            'Small Text': checked
                        });
                        setSmallText(checked);
                    }}
                />
            </div>
        </>
    );
};

export default AppearanceSettings;
