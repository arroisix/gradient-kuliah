import { PropsWithChildren } from 'react';
import { MdClose } from 'react-icons/md';
import { SetTargetForm } from './SetTargetForm';

function SetTargetDrawer({ children }: PropsWithChildren) {
    return (
        <div className="drawer drawer-end">
            <input
                id="set_target_institution_drawer"
                type="checkbox"
                className="drawer-toggle"
            />

            <div className="drawer-content">{children}</div>

            <div className="drawer-side z-[9999]">
                <label
                    htmlFor="set_target_institution_drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"></label>

                <div className="bg-[#101010] min-h-full w-full max-w-[520px] px-6">
                    <label
                        htmlFor="set_target_institution_drawer"
                        aria-label="close sidebar"
                        className="cursor-pointer block pt-4">
                        <MdClose className="w-6 h-6" />
                    </label>

                    <div className="space-y-3 mt-4">
                        <h2 className="text-white font-bold text-xl text-center">
                            Tentukan Target
                        </h2>
                        <p className="text-[#999999] text-center">
                            Pilih kampus dan jurusan yang kamu incar. Soal akan
                            menyesuaikan tingkat kesulitannya.
                        </p>
                    </div>

                    <SetTargetForm />
                </div>
            </div>
        </div>
    );
}

export { SetTargetDrawer };
