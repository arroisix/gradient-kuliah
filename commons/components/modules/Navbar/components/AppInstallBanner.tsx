import React, { useEffect, useMemo, useState } from 'react';
import { MdClose } from 'react-icons/md';
import Image from 'next/image';
import { cn } from 'commons/utils';
import { CDN_URL } from 'commons/constants';

interface AppInstallBannerProps {
    showSidebar?: boolean;
}

const AppInstallBanner = ({ showSidebar }: AppInstallBannerProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const isIOS = useMemo(() => {
        if (typeof window !== 'undefined') {
            console.log(navigator.userAgent);
            return (
                /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) &&
                !window.MSStream
            );
        }
        return false;
    }, []);

    useEffect(() => {
        const isBannerClosed = localStorage.getItem('appBannerClosed');
        if (!isBannerClosed) {
            setIsVisible(true);
        }

        const observer = new MutationObserver(() => {
            const mobileSidebar = document.querySelector(
                '.fixed.z-\\[110\\].w-screen.h-screen'
            );
            setIsMobileSidebarOpen(!!mobileSidebar);
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        localStorage.setItem('appBannerClosed', 'true');
    };

    const handleInstall = () => {
        if (isIOS) {
            window.open(
                'https://apps.apple.com/id/app/gradient/id6749671325',
                '_blank'
            );
            return;
        } else {
            window.open(
                'https://play.google.com/store/apps/details?id=com.gradient.academy',
                '_blank'
            );
        }
    };

    if (!isVisible || isMobileSidebarOpen) return null;

    return (
        <div
            className={cn(
                'sticky top-[54px] md:top-16',
                showSidebar
                    ? 'md:left-[250px] md:w-[calc(100%-250px)] md:!top-14'
                    : 'w-full'
            )}
            style={{ zIndex: 60 }}>
            <button
                onClick={handleInstall}
                className="w-full bg-[#494BA0] transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between px-4 py-3 md:px-8">
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
                            <span className="flex items-center gap-2 py-1 px-3 rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-xs text-white">
                                Baru
                            </span>
                        </div>
                        <p className="text-[11px] text-left">
                            Install di {isIOS ? 'App Store' : 'Play Store'} dan
                            mulai belajar!
                        </p>
                    </div>
                    {isIOS ? (
                        <Image
                            src={`${CDN_URL}/assets/app-store-logo.svg`}
                            alt={'Get it on App Store'}
                            width={140}
                            height={40}
                        />
                    ) : (
                        <div className="flex items-center gap-2 bg-[#171717] rounded-[70px] px-4 py-1.5 text-sm font-medium hover:opacity-80 transition-opacity">
                            <Image
                                src={`${CDN_URL}/assets/play-store-logo.png`}
                                alt={'Get it on Google Play'}
                                width={16}
                                height={16}
                            />
                            Install
                        </div>
                    )}
                </div>
            </button>
        </div>
    );
};

export default AppInstallBanner;
