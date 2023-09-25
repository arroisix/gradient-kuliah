import React from 'react';
import { MdClose } from 'react-icons/md';
import AppearanceSettings from '../../Appearance/AppearanceSettings';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';

const AppearanceMenu = (): JSX.Element => {
    const { setNavigation } = useAstronotes();
    return (
        <div className="absolute left-[-20px] bottom-[-24px] w-screen h-[calc(100vh-200px)] bg-[#F6F5F8] dark:bg-[#1D1D1D] z-10">
            <div className="flex justify-between p-5">
                <span className="inline-block font-extrabold text-base pt-[2px]">
                    Opsi Tampilan
                </span>
                <MdClose
                    size={24}
                    className="text-black cursor-pointer dark:text-white"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="flex flex-col gap-2 px-5 py-3">
                <AppearanceSettings />
            </div>
        </div>
    );
};
export default AppearanceMenu;
