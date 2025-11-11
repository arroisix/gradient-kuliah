import { Fragment, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IoClose, IoChevronForward, IoChevronBack } from 'react-icons/io5';
import Link from 'next/link';
import KelasIcon from '../assets/KelasIcon';
import PerpusIcon from '../assets/PerpusIcon';
import KuisIcon from '../assets/KuisIcon';
import LainnyaIcon from '../assets/LainnyaIcon';
import CopilotAIIcon from '../assets/CopilotAIIcon';
import { useTracker } from 'tracker/tracker';
import FlashcardLargeIcon from 'dashboard/assets/FlashcardLargeIcon';
import FlashcardIcon from 'dashboard/assets/FlashcardIcon';
import FlashcardIconFull from 'dashboard/assets/FlashcardIconFull';
import CopilotAIIconFull from 'dashboard/assets/CopilotAIIconFull';

type Feature = {
    id: string;
    title: string;
    description: string;
    Icon: React.FC<{ width?: number; height?: number; isSmall?: boolean }>;
    url: string;
    isNew?: boolean;
    gradient?: string;
};

const DashboardFeatures = (): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [slideDirection, setSlideDirection] = useState<
        'left' | 'right' | null
    >(null);
    const tracker = useTracker();
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const cardBaseClasses =
        'relative group rounded-xl transition-colors md:bg-[#1D1D1D] md:hover:bg-neutral-800 min-h-[96px]';

    const features: Feature[] = [
        {
            id: 'kelas',
            title: 'Kelas',
            description: 'Video materi dari dosen',
            Icon: () => <KelasIcon width={64} height={69} />,
            url: '/kelas',
            gradient: 'from-emerald-600 to-emerald-400'
        },
        {
            id: 'kuis',
            title: 'Kuis',
            description: 'Uji kemampuanmu sekarang',
            Icon: () => <KuisIcon width={64} height={69} />,
            url: '/latihan',
            gradient: 'from-purple-600 to-purple-400'
        },
        {
            id: 'copilot',
            title: 'Copilot AI',
            description: 'Chatbot teman belajarmu',
            Icon: ({ isSmall }: { isSmall?: boolean }) =>
                isSmall ? (
                    <CopilotAIIconFull width={24} height={24} />
                ) : (
                    <CopilotAIIconFull width={64} height={69} />
                ),
            url: '/copilot',
            gradient: 'from-blue-600 to-indigo-500'
        },
        {
            id: 'perpus',
            title: 'Perpustakaan',
            description: 'Text book, rangkuman, bank soal',
            Icon: () => <PerpusIcon width={64} height={69} />,
            url: '/perpustakaan',
            gradient: 'from-red-500 to-orange-400'
        },
        {
            id: 'lainnya',
            title: 'Lainnya',
            description: '',
            Icon: LainnyaIcon,
            url: '#',
            gradient: 'from-neutral-700 to-neutral-600'
        }
    ];

    const moreFeatures: Feature[] = [
        {
            id: 'flashcard',
            title: 'Flashcard',
            description: 'Hafalan kebut semalam',
            Icon: ({ isSmall }: { isSmall?: boolean }) =>
                isSmall ? (
                    <FlashcardIcon width={24} height={24} />
                ) : (
                    <FlashcardIconFull width={48} height={48} />
                ),
            url: '/flashcards',
            gradient: 'from-orange-500 to-pink-500'
        }
    ];

    const ITEMS_PER_PAGE = 4;
    const allMobileFeatures: (
        | Feature
        | {
              id: string;
              title: string;
              url: string;
              Icon: typeof LainnyaIcon;
              isNew?: boolean;
          }
    )[] = [
        ...features.filter((f) => f.id !== 'lainnya'),
        ...moreFeatures,
        { id: 'lainnya', title: 'Lainnya', url: '#', Icon: LainnyaIcon }
    ];
    const totalPages = Math.ceil(allMobileFeatures.length / ITEMS_PER_PAGE);

    const currentPageItems = allMobileFeatures.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setSlideDirection('left');
            setTimeout(() => {
                setCurrentPage(currentPage + 1);
                setSlideDirection(null);
            }, 300);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setSlideDirection('right');
            setTimeout(() => {
                setCurrentPage(currentPage - 1);
                setSlideDirection(null);
            }, 300);
        }
    };

    const goToPage = (page: number) => {
        if (page > currentPage) {
            setSlideDirection('left');
        } else if (page < currentPage) {
            setSlideDirection('right');
        }
        setTimeout(() => {
            setCurrentPage(page);
            setSlideDirection(null);
        }, 300);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50; // Minimum distance for a swipe

        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) {
                nextPage();
            } else {
                prevPage();
            }
        }

        // Reset values
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    return (
        <div className="w-full mx-auto space-y-4 mb-4">
            <div className="lg:hidden relative">
                {currentPage > 0 && (
                    <button
                        onClick={prevPage}
                        className="absolute left-0 bottom-1/2 z-10 w-7 h-7 bg-neutral-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg"
                        aria-label="Previous">
                        <IoChevronBack size={16} />
                    </button>
                )}

                <div
                    className="px-6 overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}>
                    <div
                        className={`grid grid-cols-4 gap-4 transition-all duration-300 ease-in-out ${
                            slideDirection === 'left'
                                ? 'opacity-0 -translate-x-8'
                                : slideDirection === 'right'
                                ? 'opacity-0 translate-x-8'
                                : 'opacity-100 translate-x-0'
                        }`}>
                        {currentPageItems.map((feature) => {
                            const isLainnya = feature.id === 'lainnya';

                            if (isLainnya) {
                                return (
                                    <button
                                        key={feature.id}
                                        onClick={() => {
                                            setIsOpen(true);
                                            tracker?.genericTrack(
                                                'Click More Features Dashboard Card'
                                            );
                                        }}
                                        className="flex flex-col items-center gap-3">
                                        <div className="w-[48px] h-[48px]  aspect-square rounded-full bg-[#2C2E3A] flex items-center justify-center">
                                            <LainnyaIcon
                                                width={48}
                                                height={48}
                                            />
                                        </div>
                                        <h3 className="font-semibold text-white text-xs text-center leading-tight">
                                            Lainnya
                                        </h3>
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={feature.id}
                                    href={feature.url}
                                    onClick={() =>
                                        tracker?.genericTrack(
                                            `Click ${feature.title} Dashboard Card`
                                        )
                                    }
                                    className="flex flex-col items-center gap-3 relative">
                                    {feature.isNew && (
                                        <span className="absolute -top-1 -right-1 py-0.5 px-1.5 text-[8px] font-semibold rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] z-10">
                                            Baru
                                        </span>
                                    )}
                                    <div className="w-[48px] h-[48px] aspect-square rounded-full bg-[#2C2E3A] flex items-center justify-center">
                                        <feature.Icon width={48} height={48} />
                                    </div>
                                    <h3 className="font-semibold text-white text-xs text-center leading-tight">
                                        {feature.title}
                                    </h3>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {currentPage < totalPages - 1 && (
                    <button
                        onClick={nextPage}
                        className="absolute right-0 bottom-1/2 z-10 w-7 h-7 bg-neutral-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg"
                        aria-label="Next">
                        <IoChevronForward size={16} />
                    </button>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToPage(index)}
                                className={`h-1 rounded-full transition-all ${
                                    index === currentPage
                                        ? 'w-6 bg-[#B6A6F3]'
                                        : 'w-3 bg-[#2A225F]'
                                }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Grid View */}
            <div
                className="
                hidden lg:grid lg:grid-cols-[repeat(5,1fr)_auto]
                gap-4 lg:gap-2
            ">
                {features
                    .filter((f) => f.id !== 'lainnya')
                    .map((feature) => (
                        <Link
                            key={feature.id}
                            href={feature.url}
                            onClick={() =>
                                tracker?.genericTrack(
                                    `Click ${feature.title} Dashboard Card`
                                )
                            }
                            className={`${cardBaseClasses}
                            flex flex-col items-center text-center gap-2
                            xl:flex-row xl:items-center xl:justify-between xl:gap-3 xl:text-left
                            px-4 py-3 xl:p-3
                            ${
                                feature.id === 'copilot' ||
                                feature.id === 'flashcard'
                                    ? 'xl:pr-0'
                                    : ''
                            }
                            ${
                                feature.id !== 'copilot'
                                    ? 'xl:flex-row-reverse'
                                    : ''
                            }
                        `}>
                            <div
                                className={`relative w-14 h-14 rounded-full bg-[#1D1D1D] flex items-center justify-center xl:w-auto xl:h-auto xl:rounded-none xl:bg-transparent ${
                                    feature.id === 'copilot' ? 'xl:order-2' : ''
                                }`}>
                                <div
                                    className={`${
                                        feature.id === 'copilot' ||
                                        feature.id === 'flashcard'
                                            ? 'flex items-center justify-center w-full h-full'
                                            : ''
                                    }`}>
                                    {/* Show Full icons on non-xl screens, original icons on xl screens */}
                                    <div className="xl:hidden">
                                        <feature.Icon />
                                    </div>
                                    <div className="hidden xl:block">
                                        {feature.id === 'copilot' ? (
                                            <CopilotAIIcon
                                                width={64}
                                                height={69}
                                            />
                                        ) : feature.id === 'flashcard' ? (
                                            <FlashcardLargeIcon />
                                        ) : (
                                            <feature.Icon />
                                        )}
                                    </div>
                                </div>
                                {feature.isNew && (
                                    <span
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 py-0.5 px-2 text-[10px] rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56]
                   xl:top-0 xl:right-0 xl:-mt-2 xl:-mr-2 xl:bottom-auto xl:left-auto xl:translate-x-0 xl:text-xs">
                                        Baru
                                    </span>
                                )}
                            </div>
                            <div
                                className={`flex flex-col items-center xl:items-start ${
                                    feature.id === 'copilot' ? 'xl:order-1' : ''
                                }`}>
                                <h3 className="font-bold text-white text-xs xl:text-sm">
                                    {feature.title}
                                </h3>
                                {/* Show description only on xl+ */}
                                <p className="hidden xl:block text-[11px] xl:text-xs text-neutral-400 leading-snug">
                                    {feature.description}
                                </p>
                            </div>
                        </Link>
                    ))}

                {/* 'Lainnya' trigger only on xl (no custom narrow width anymore) */}
                {features
                    .filter((f) => f.id === 'lainnya')
                    .map((feature) => (
                        <button
                            key={feature.id}
                            onClick={() => {
                                setIsOpen(true);
                                tracker?.genericTrack(
                                    'Click More Features Dashboard Card'
                                );
                            }}
                            className={`${cardBaseClasses} hidden lg:flex flex-col items-center justify-center text-center gap-2 px-4 py-3 focus:outline-none`}>
                            <div className="relative w-14 h-14 rounded-full bg-[#1D1D1D] flex items-center justify-center">
                                <feature.Icon width={28} height={28} />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-white text-xs xl:text-sm">
                                    {feature.title}
                                </span>
                            </div>
                        </button>
                    ))}
            </div>

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

                    <div className="fixed inset-0">
                        <div className="flex min-h-full items-end md:items-center justify-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="translate-y-full md:translate-y-0 md:scale-95 md:opacity-0"
                                enterTo="translate-y-0 md:scale-100 md:opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="translate-y-0 md:scale-100 md:opacity-100"
                                leaveTo="translate-y-full md:translate-y-0 md:scale-95 md:opacity-0">
                                <Dialog.Panel className="w-full md:w-[500px] transform bg-[#1D1D1D] shadow-xl rounded-t-2xl md:rounded-2xl">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <Dialog.Title className="text-lg font-bold text-white">
                                                Fitur Gradient
                                            </Dialog.Title>
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="text-neutral-400 hover:text-white transition-colors">
                                                <IoClose size={24} />
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {[
                                                ...features.filter(
                                                    (f) => f.id !== 'lainnya'
                                                ),
                                                ...moreFeatures
                                            ].map((feature) => (
                                                <Link
                                                    key={feature.id}
                                                    href={feature.url}
                                                    onClick={() =>
                                                        tracker?.genericTrack(
                                                            `Click ${feature.title} Modal Card`
                                                        )
                                                    }
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                                                    <div className="w-10 h-10 bg-[#333540] rounded-full flex items-center justify-center">
                                                        <feature.Icon
                                                            width={24}
                                                            height={24}
                                                            isSmall
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white flex items-center">
                                                            {feature.title}
                                                            {feature.isNew && (
                                                                <span className="ml-2 py-1 px-3 text-xs rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56]">
                                                                    Baru
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-sm text-neutral-400">
                                                            {
                                                                feature.description
                                                            }
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default DashboardFeatures;
