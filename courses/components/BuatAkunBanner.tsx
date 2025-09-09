import Button from 'commons/components/elements/Button';
import { AUTHENTICATION_ROUTE, CDN_URL } from 'commons/constants';
import Image from 'next/image';
import React from 'react';

const COURSE_REGISTER_ASSET = `${CDN_URL}/assets/dashboard-register.png`;

const BuatAkunBanner = (): JSX.Element => {
    return (
        <div className="relative z-0 flex flex-col w-full gap-3 p-4 overflow-hidden md:gap-4 rounded-xl md:p-6 bg-accent-purple">
            <div className="absolute z-0 object-contain h-32 -right-4 sm:right-0 -bottom-2 lg:w-auto">
                <Image
                    src={COURSE_REGISTER_ASSET}
                    width={163}
                    height={136}
                    objectFit="contain"
                    alt="Course registration illustration"
                />
            </div>
            <p className="z-[1] text-lg font-extrabold md:text-2xl text-white">
                Daftar untuk melihat rekomendasi sesuai{' '}
                <br className="block lg:hidden" />
                jurusan kamu!
            </p>
            <Button
                variant="custom"
                href={AUTHENTICATION_ROUTE}
                eventName="Click Course Register Banner"
                className="font-sans text-sm font-bold text-purple-600 bg-white w-fit z-[1] mt-8 min-[375px]:mt-0 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
                Buat Akun
            </Button>
        </div>
    );
};

export default BuatAkunBanner;
