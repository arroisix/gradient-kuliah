import Button from 'commons/components/elements/Button';
import { AUTHENTICATION_ROUTE, CDN_URL } from 'commons/constants';
import Image from 'next/image';
import React from 'react';

const REGISITER_ASSET = `${CDN_URL}/assets/dashboard-register.png`;

const RegisterBanner = (): JSX.Element => {
    return (
        <div className="relative z-0 flex flex-col w-full gap-3 p-4 overflow-hidden md:gap-4 rounded-xl md:p-6 bg-accent-purple">
            <div className="absolute z-0 object-contain h-32 -right-4 sm:right-0 -bottom-2 lg:w-auto">
                <Image
                    src={REGISITER_ASSET}
                    width={163}
                    height={136}
                    objectFit="contain"
                />
            </div>
            <h5 className="z-[1] text-lg font-extrabold md:text-2xl">
                Daftar dan telusuri <br className="block lg:hidden " />
                fitur belajar Gradient
            </h5>
            <Button
                variant="custom"
                href={AUTHENTICATION_ROUTE}
                target="blank"
                className="font-sans text-xs font-bold text-black bg-white w-fit z-[1] mt-12 min-[375px]:mt-0"
                eventName="Join Tutor Button">
                Daftar Sekarang
            </Button>
        </div>
    );
};

export default RegisterBanner;
