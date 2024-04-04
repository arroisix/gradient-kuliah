import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Image from 'next/image';
import React from 'react';

const EMPTY_ASSET = `${CDN_URL}/assets/dashboard-subscribe.png`;

const EmptyState = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <div className="relative z-0 flex flex-col w-full gap-6 p-4 overflow-hidden md:gap-8 rounded-xl md:p-6 bg-neutral-800">
            <div className="absolute z-0 object-contain -bottom-3 -right-4 sm:right-0 saturate-0 opacity-20">
                <Image
                    src={EMPTY_ASSET}
                    width={198 * (isMobileBreakpoints ? 0.75 : 1)}
                    height={183 * (isMobileBreakpoints ? 0.75 : 1)}
                    objectFit="contain"
                />
            </div>
            <div>
                <h5 className="z-[1] font-bold md:text-lg">Belum ada kelas</h5>
                <p>Telusuri materi Gradient dan mulai belajar sekarang!</p>
            </div>
            <Button
                variant="custom"
                className="font-sans text-xs font-bold text-black bg-white w-fit z-[1] mt-12 min-[375px]:mt-0"
                eventName={`User click "Telusuri Kelas" Button when user don't have any Class Progress yet`}
                href="/kelas">
                Telusuri Kelas
            </Button>
        </div>
    );
};

export default EmptyState;
