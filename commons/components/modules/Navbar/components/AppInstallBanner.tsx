import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import Image from 'next/image';
import { cn } from 'commons/utils';
import { CDN_URL } from 'commons/constants';

interface AppInstallBannerProps {
    showSidebar?: boolean;
}

const AppInstallBanner = ({ showSidebar }: AppInstallBannerProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isBannerClosed = localStorage.getItem('appBannerClosed');
        if (!isBannerClosed) {
            setIsVisible(true);
        }
    }, []);

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        localStorage.setItem('appBannerClosed', 'true');
    };

    const handleInstall = () => {
        window.open(
            'https://play.google.com/store/apps/details?id=com.gradient.academy',
            '_blank'
        );
    };

    if (!isVisible) return null;

    return (
        <div className="sticky top-14 z-[15]">
            <button
                onClick={handleInstall}
                className={cn(
                    'w-full bg-[#494BA0] md:px-8 transition-all duration-300 cursor-pointer',
                    showSidebar && 'md:ml-[250px]'
                )}>
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={handleClose}
                        className="mr-4 hover:opacity-80">
                        <MdClose size={24} />
                    </button>
                    <div className="flex flex-col items-start gap-2 flex-1">
                        <div className="flex items-center gap-2">
                            <Image
                                src={`${CDN_URL}/assets/gradient-G-icon.png`}
                                alt="Gradient"
                                width={24}
                                height={24}
                                className="rounded"
                            />
                            <span className="text-sm font-bold">Gradient</span>
                            <span
                                className="flex items-center gap-2 py-1 px-3 rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-xs text-white tooltip tooltip-right"
                                data-tip="Copilot AI gratis selama versi Beta!">
                                Baru
                            </span>
                        </div>
                        <p className="text-[11px]">
                            Install di Playstore dan klaim promonya!
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#171717] rounded-[70px] px-4 py-1.5 text-sm font-medium hover:opacity-80 transition-opacity">
                        <Image
                            src={`${CDN_URL}/assets/play-store-logo.png`}
                            alt="Get it on Google Play"
                            width={16}
                            height={16}
                        />
                        Install
                    </div>
                </div>
            </button>
        </div>
    );
};

export default AppInstallBanner;
