import React, { Dispatch, SetStateAction } from 'react';
import { IoMdClose } from 'react-icons/io';
import AppearanceSettings from './AppearanceSettings';

type AppearanceSettingSidebarProps = {
    fontStyle: AstronotesFontStyle;
    setFontStyle: Dispatch<SetStateAction<AstronotesFontStyle>>;
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
    smallText: boolean;
    setSmallText: Dispatch<SetStateAction<boolean>>;
};

const AppearanceSettingSidebar = ({
    fontStyle,
    setFontStyle,
    setNavigation,
    smallText,
    setSmallText
}: AppearanceSettingSidebarProps): JSX.Element => {
    return (
        <div className="w-60 bg-[#F6F5F8] dark:bg-[#121212] rounded-box text-black dark:text-white">
            <div className="flex justify-between px-3 py-2">
                <span className="inline-block font-body text-xs pt-[2px]">
                    Opsi Tampilan
                </span>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-black dark:hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh_-_10rem)] py-4 px-3 flex flex-col gap-2">
                <AppearanceSettings
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                    smallText={smallText}
                    setSmallText={setSmallText}
                />
            </div>
        </div>
    );
};

export default AppearanceSettingSidebar;
