import { Fragment, useState, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Download } from 'lucide-react';
import { IoClose } from 'react-icons/io5';
import Button from 'commons/components/elements/Button';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Image from 'next/image';
import { CDN_URL } from '../../commons/constants';
import GradientMobile from '../assets/GradientMobile';

const DownloadVideoButton = ({
    isDownloaded
}: {
    isDownloaded?: boolean;
}): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const { isDesktopBreakpoints } = useWindowBreakpoints();

    const buttonText = isDownloaded
        ? 'Tersedia di Aplikasi'
        : 'Download di Aplikasi';

    const heading = isDownloaded
        ? 'Downloaded Video Tersedia'
        : 'Download Video di Aplikasi';

    const subheading = isDownloaded
        ? 'Buka aplikasi untuk menontonnya tanpa internet'
        : 'Buka aplikasi untuk download video dan menontonnya tanpa internet';

    const isIOS = useMemo(() => {
        if (typeof window !== 'undefined') {
            return (
                /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) &&
                !window.MSStream
            );
        }
        return false;
    }, []);

    return (
        <>
            <Button
                variant="primary"
                onClick={() => setIsOpen(true)}
                className="text-xs whitespace-nowrap flex gap-2 items-center justify-center bg-gradient-to-r from-[#36236A] via-[#6A45D0] to-[#494BA0] px-4">
                <Download size={20} />
                {buttonText}
            </Button>

            {isDesktopBreakpoints && (
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50"
                        onClose={() => setIsOpen(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-black/75" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95">
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#222222] p-6 text-left align-middle shadow-xl transition-all">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="text-neutral-400">
                                                <IoClose size={24} />
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-24 h-24 flex items-center justify-center mb-4">
                                                <GradientMobile />
                                            </div>

                                            <Dialog.Title className="text-lg font-bold text-[#FFFFFF] mb-2">
                                                {heading}
                                            </Dialog.Title>

                                            <p className="text-[#999999] mb-6">
                                                {subheading}
                                            </p>

                                            <div className="w-full space-y-3">
                                                <a
                                                    href="https://play.google.com/store/apps/details?id=com.gradient.academy"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#333333] hover:bg-neutral-700 transition-colors">
                                                    <Image
                                                        src={`${CDN_URL}/assets/play-store-logo.png`}
                                                        alt="Get it on Google Play"
                                                        width={16}
                                                        height={16}
                                                    />
                                                    <span className="text-[#FFFFFF]">
                                                        Playstore
                                                    </span>
                                                </a>

                                                <a
                                                    href="https://apps.apple.com/id/app/gradient/id6749671325"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#333333] hover:bg-neutral-700 transition-colors">
                                                    <span className="text-[#FFFFFF] flex items-center">
                                                        <svg
                                                            width="14"
                                                            height="16"
                                                            viewBox="0 0 14 16"
                                                            fill="currentColor"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M11.6748 8.54497C11.6748 6.61816 12.8916 5.67578 12.9209 5.65332C12.042 4.40625 10.6846 4.24414 10.1885 4.22754C8.98926 4.10352 7.82617 4.91016 7.21826 4.91016C6.59473 4.91016 5.63281 4.24414 4.63184 4.26074C3.34668 4.27734 2.14453 5.01172 1.50146 6.16895C0.18164 8.51074 1.18262 12.001 2.45801 13.8945C3.09521 14.8291 3.85303 15.8892 4.85986 15.8477C5.84033 15.8062 6.2041 15.2266 7.38428 15.2266C8.5498 15.2266 8.89795 15.8477 9.91943 15.8232C10.9683 15.8062 11.6162 14.8623 12.2236 13.9194C12.9507 12.8594 13.248 11.8242 13.2627 11.7661C13.2334 11.7578 11.6914 11.1201 11.6748 8.54497Z"
                                                                fill="white"
                                                            />
                                                            <path
                                                                d="M9.68994 2.87598C10.2091 2.24658 10.5645 1.39453 10.4648 0.533203C9.75244 0.566406 8.8418 1.02832 8.30762 1.64209C7.83496 2.18799 7.41162 3.07227 7.52783 3.90039C8.32275 3.96729 9.15674 3.49463 9.68994 2.87598Z"
                                                                fill="white"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span className="text-[#FFFFFF]">
                                                        Appstore
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}

            {!isDesktopBreakpoints && (
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50"
                        onClose={() => setIsOpen(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-black/75" />
                        </Transition.Child>

                        <div className="fixed left-0 right-0 -bottom-2">
                            <div className="flex min-h-full items-end">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="translate-y-full"
                                    enterTo="translate-y-0"
                                    leave="ease-in duration-200"
                                    leaveFrom="translate-y-0"
                                    leaveTo="translate-y-full">
                                    <Dialog.Panel className="w-full transform bg-[#222222] shadow-xl rounded-t-2xl">
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <Dialog.Title className="text-lg font-bold text-[#FFFFFF]">
                                                    {heading}
                                                </Dialog.Title>
                                                <button
                                                    onClick={() =>
                                                        setIsOpen(false)
                                                    }
                                                    className="text-neutral-400">
                                                    <IoClose size={24} />
                                                </button>
                                            </div>

                                            <p className="text-[#999999] mb-6">
                                                {subheading}
                                            </p>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 bg-[#36236A] rounded-xl flex items-center justify-center mr-3">
                                                        <span className="text-2xl font-bold text-white">
                                                            G
                                                        </span>
                                                    </div>
                                                    <span className="text-xl font-semibold text-[#FFFFFF]">
                                                        Gradient
                                                    </span>
                                                </div>

                                                <a
                                                    href={
                                                        isIOS
                                                            ? 'https://apps.apple.com/id/app/gradient/id6749671325'
                                                            : 'https://play.google.com/store/apps/details?id=com.gradient.academy'
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#333333] hover:bg-neutral-600 transition-colors text-white font-medium">
                                                    {isIOS ? (
                                                        <Image
                                                            src={`${CDN_URL}/assets/apple-logo.png`}
                                                            alt="Download on the App Store"
                                                            width={16}
                                                            height={20}
                                                        />
                                                    ) : (
                                                        <Image
                                                            src={`${CDN_URL}/assets/play-store-logo.png`}
                                                            alt="Get it on Google Play"
                                                            width={16}
                                                            height={16}
                                                        />
                                                    )}
                                                    Install
                                                </a>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
        </>
    );
};

export default DownloadVideoButton;
