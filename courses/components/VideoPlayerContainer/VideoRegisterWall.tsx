import { IoMdClose } from 'react-icons/io';
import { RegistrationSection } from 'authentication/containers/RegistrationSection';
import { cn } from 'commons/utils';
import React from 'react';

const VideoRegisterwall = ({
    showRegisterwall,
    setIsShowRegisterwall
}: {
    showRegisterwall: boolean;
    setIsShowRegisterwall: (state: boolean) => void;
}): JSX.Element => {
    return showRegisterwall ? (
        <div
            className={cn(
                'fixed backdrop-blur-lg w-screen h-screen z-[100] top-0 left-0'
            )}>
            <div
                className={cn(
                    'flex flex-col items-center justify-center w-screen h-screen'
                )}>
                <div className="bg-neutral-900 px-8 py-8 rounded max-w-[450px] shadow-md relative">
                    <IoMdClose
                        className="absolute top-2 right-2 text-xl font-bold cursor-pointer"
                        onClick={() => setIsShowRegisterwall(false)}
                    />
                    <h2 className="mb-4 text-xl font-extrabold leading-relaxed text-center">
                        Buat akun untuk lanjut menonton
                    </h2>
                    <RegistrationSection />
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default VideoRegisterwall;
