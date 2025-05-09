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

const DashboardFeatures = () => {
    const [isOpen, setIsOpen] = useState(false);
    const tracker = useTracker();

    const topRowFeatures: Feature[] = [
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
        }
    ];

    const bottomRowFeatures: Feature[] = [
        {
            id: 'kelas',
            title: 'Kelas',
            description: 'Video materi dari dosen',
            Icon: KelasIcon,
            url: '/kelas'
        },
        {
            id: 'perpus',
            title: 'Perpus',
            description: 'Text book, rangkuman, bank soal',
            Icon: PerpusIcon,
            url: '/perpustakaan'
        },
        {
            id: 'kuis',
            title: 'Kuis',
            description: 'Uji kemampuanmu sekarang',
            Icon: KuisIcon,
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
            Icon: DiskusiIcon,
            url: '/komunitas'
        }
    ];

    return (
        <div className="w-full mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-2">
                {topRowFeatures.map((feature) => (
                    <Link
                        key={feature.id}
                        href={feature.url}
                        onClick={() =>
                            tracker?.genericTrack(
                                `Click ${feature.title} Dashboard Card`
                            )
                        }
                        className="block p-4 bg-[#1D1D1D] rounded-xl hover:bg-neutral-800 transition-colors relative">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-white flex items-center">
                                    {feature.title}
                                    {feature.isNew && (
                                        <span className="ml-2 py-1 px-3 text-xs rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] z-[1]">
                                            Baru
                                        </span>
                                    )}
                                </h3>
                                <p className="text-sm text-neutral-400 w-[80%]">
                                    {feature.description}
                                </p>
                            </div>
                            <div className="absolute top-1.5 right-0 z-0">
                                <feature.Icon />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
                {bottomRowFeatures.map((feature) =>
                    feature.id === 'lainnya' ? (
                        <button
                            key={feature.id}
                            onClick={() => {
                                setIsOpen(true);
                                tracker?.genericTrack(
                                    'Click More Features Dashboard Card'
                                );
                            }}
                            className="p-3 bg-[#1D1D1D] rounded-xl hover:bg-neutral-800 transition-colors">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 flex items-center justify-center mb-2">
                                    <feature.Icon width={32} height={32} />
                                </div>
                                <span className="font-bold text-white text-sm">
                                    {feature.title}
                                </span>
                            </div>
                        </button>
                    ) : (
                        <Link
                            key={feature.id}
                            href={feature.url}
                            onClick={() =>
                                tracker?.genericTrack(
                                    `Click ${feature.title} Dashboard Card`
                                )
                            }
                            className="p-3 bg-[#1D1D1D] rounded-xl hover:bg-neutral-800 transition-colors">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 flex items-center justify-center mb-2">
                                    <feature.Icon width={32} height={32} />
                                </div>
                                <span className="font-bold text-white text-sm">
                                    {feature.title}
                                </span>
                            </div>
                        </Link>
                    )
                )}
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
                                                ...topRowFeatures,
                                                ...bottomRowFeatures.filter(
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
