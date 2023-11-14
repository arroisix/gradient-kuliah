import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Image from 'next/image';
import React from 'react';

const SUBSCRIBE_ASSET = `${CDN_URL}/assets/dashboard-subscribe.png`;

const SubscribeBanner = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    return (
        <div className="relative z-0 flex flex-col w-full gap-3 p-4 overflow-hidden md:gap-4 rounded-xl md:p-6 bg-accent-orange">
            <div className="absolute z-0 object-contain -bottom-3 -right-4 sm:right-0">
                <Image
                    src={SUBSCRIBE_ASSET}
                    width={198 * (isMobileBreakpoints ? 0.75 : 1)}
                    height={183 * (isMobileBreakpoints ? 0.75 : 1)}
                    objectFit="contain"
                />
            </div>
            <h5 className="z-[1] text-lg font-extrabold md:text-2xl">
                Beli paket untuk <br className="block xl:hidden" /> melihat
                seluruh materi
            </h5>
            <Button
                variant="custom"
                className="font-sans text-xs font-bold text-black bg-white w-fit z-[1] mt-12 min-[375px]:mt-0">
                Beli Paket
            </Button>
        </div>
    );
};

export default SubscribeBanner;
