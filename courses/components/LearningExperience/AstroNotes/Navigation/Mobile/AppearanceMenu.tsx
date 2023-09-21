import React, { type Dispatch, SetStateAction } from 'react';
import { MdClose } from 'react-icons/md';
import AppearanceSettings from '../../Appearance/AppearanceSettings';

type AppearanceMenuProps = {
    fontStyle: AstronotesFontStyle;
    setFontStyle: Dispatch<SetStateAction<AstronotesFontStyle>>;
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
    smallText: boolean;
    setSmallText: Dispatch<SetStateAction<boolean>>;
};

const AppearanceMenu = ({
    fontStyle,
    setFontStyle,
    setNavigation,
    smallText,
    setSmallText
}: AppearanceMenuProps): JSX.Element => {
    return (
        <div className="absolute left-[-20px] bottom-[-24px] w-screen h-[calc(100vh-200px)] bg-[#F6F5F8] dark:bg-[#1D1D1D] z-10">
            <div className="flex justify-between p-5">
                <span className="inline-block font-extrabold text-base pt-[2px]">
                    Opsi Tampilan
                </span>
                <MdClose
                    size={24}
                    className="text-black dark:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="px-5 py-3 flex flex-col gap-2">
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
export default AppearanceMenu;
