import React from 'react';
import { MdClose } from 'react-icons/md';
import AppearanceSettings from '../../Appearance/AppearanceSettings';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';

const AppearanceMenu = (): JSX.Element => {
    const { setNavigation } = useAstronotes();
    return (
        <dialog className="modal modal-bottom modal-open">
            <div className="modal-box p-0 bg-[#F6F5F8] dark:bg-[#1D1D1D]">
                <div className="flex justify-between px-5 pt-5 pb-3">
                    <span className="inline-block font-extrabold text-base pt-[2px]">
                        Opsi Tampilan
                    </span>
                    <MdClose
                        size={24}
                        className="btn btn-xs btn-circle btn-ghost"
                        onClick={() => setNavigation('CLOSE')}
                    />
                </div>
                <div className="h-[calc(100vh-16rem)] overflow-y-auto px-5 py-3 flex flex-col gap-2">
                    <AppearanceSettings />
                </div>
            </div>
        </dialog>
    );
};
export default AppearanceMenu;
