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
        <div className="w-[230px] h-[calc(100vh-88px)] bg-[#F6F5F8] dark:bg-[#121212] rounded-lg text-black dark:text-white">
            <div className="flex justify-between p-2 border-b border-[#c0c0c0] dark:border-[#2D2D2D]">
                <span className="inline-block font-body text-xs pt-[2px]">
                    Opsi Tampilan
                </span>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-black dark:hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="px-2 py-[10px] flex flex-col gap-2">
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
