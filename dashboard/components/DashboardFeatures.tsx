import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IoClose } from 'react-icons/io5';
import Link from 'next/link';
import KelasIcon from '../assets/KelasIcon';
import PerpusIcon from '../assets/PerpusIcon';
import KuisIcon from '../assets/KuisIcon';
import DiskusiIcon from '../assets/DiskusiIcon';
import LainnyaIcon from '../assets/LainnyaIcon';
import CopilotAIIcon from '../assets/CopilotAIIcon';
import { useTracker } from 'tracker/tracker';
import FlashcardLargeIcon from 'dashboard/assets/FlashcardLargeIcon';
import FlashcardIcon from 'dashboard/assets/FlashcardIcon';

type Feature = {
    id: string;
    title: string;
    description: string;
    Icon: React.FC<{ width?: number; height?: number; isSmall?: boolean }>;
    url: string;
    isNew?: boolean;
};

const DashboardFeatures = (): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const tracker = useTracker();

    const cardBaseClasses =
        'relative group rounded-xl transition-colors md:bg-[#1D1D1D] md:hover:bg-neutral-800 min-h-[96px]';

    const features: Feature[] = [
        {
            id: 'copilot',
            title: 'Copilot AI',
            description: 'Chatbot teman belajarmu',
            Icon: CopilotAIIcon,
            url: '/copilot'
        },
        {
            id: 'flashcard',
            title: 'Flashcard',
            description: 'Hafalan kebut semalam',
            Icon: ({ isSmall }: { isSmall?: boolean }) =>
                isSmall ? (
                    <FlashcardIcon width={24} height={24} />
                ) : (
                    <FlashcardLargeIcon />
                ),
            url: '/flashcards',
            isNew: true
        },
        {
            id: 'kelas',
            title: 'Kelas',
            description: 'Video materi dari dosen',
            Icon: () => <KelasIcon width={64} height={69} />,
            url: '/kelas'
        },
        {
            id: 'perpus',
            title: 'Perpustakaan',
            description: 'Text book, rangkuman, bank soal',
            Icon: () => <PerpusIcon width={64} height={69} />,
            url: '/perpustakaan'
        },
        {
            id: 'kuis',
            title: 'Kuis',
            description: 'Uji kemampuanmu sekarang',
            Icon: () => <KuisIcon width={64} height={69} />,
            url: '/latihan'
        },
        {
            id: 'lainnya',
            title: 'Lainnya',
            description: '',
            Icon: LainnyaIcon,
            url: '#'
        }
    ];

    const moreFeatures: Feature[] = [
        {
            id: 'diskusi',
            title: 'Diskusi',
            description: 'Tanya ke tutor atau user lain',
            Icon: () => <DiskusiIcon width={64} height={69} />,
            url: '/komunitas'
        }
    ];

    return (
        <div className="w-full mx-auto space-y-4 mb-4">
            <div
                className="
                    grid grid-cols-3
                    xl:grid-cols-[repeat(5,1fr)_auto]
                    gap-4 xl:gap-2
                ">
                {/* Core feature cards (exclude 'lainnya' placeholder) */}
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
                                xl:flex-row-reverse xl:items-center xl:justify-between xl:gap-3 xl:text-left
                                px-4 py-3 xl:p-3
                            `}>
                            <div className="relative w-14 h-14 rounded-full bg-[#1D1D1D] flex items-center justify-center xl:w-auto xl:h-auto xl:rounded-none xl:bg-transparent">
                                <feature.Icon />
                                {feature.isNew && (
                                    <span
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 py-0.5 px-2 text-[10px] rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56]
                                                   xl:top-0 xl:right-0 xl:-mt-2 xl:-mr-2 xl:bottom-auto xl:left-auto xl:translate-x-0 xl:text-xs">
                                        Baru
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col items-center xl:items-start">
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

                {/* Additional features shown inline below xl (merged list) */}
                {moreFeatures.map((feature) => (
                    <Link
                        key={feature.id}
                        href={feature.url}
                        onClick={() =>
                            tracker?.genericTrack(
                                `Click ${feature.title} Dashboard Card`
                            )
                        }
                        className={`${cardBaseClasses} flex flex-col items-center text-center gap-2 px-4 py-3 xl:hidden`}>
                        <div className="relative w-14 h-14 rounded-full bg-[#1D1D1D] flex items-center justify-center">
                            <feature.Icon />
                        </div>
                        <div className="flex flex-col items-center">
                            <h3 className="font-bold text-white text-xs">
                                {feature.title}
                            </h3>
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
                            className={`${cardBaseClasses} hidden xl:flex flex-col items-center justify-center text-center gap-2 px-4 py-3 focus:outline-none`}>
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
