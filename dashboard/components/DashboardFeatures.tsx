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

type Feature = {
    id: string;
    title: string;
    description: string;
    Icon: React.FC<{ width?: number; height?: number }>;
    url: string;
};

const DashboardFeatures = () => {
    const [isOpen, setIsOpen] = useState(false);

    const mainFeature: Feature = {
        id: 'copilot',
        title: 'Copilot AI',
        description: 'Chatbot teman belajarmu',
        Icon: CopilotAIIcon,
        url: '/copilot'
    };

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

    const ModalFeatureIcon = ({
        Icon: FeatureIcon
    }: {
        Icon: Feature['Icon'];
    }) => (
        <div className="relative">
            <div className="w-10 h-10 bg-[#333540] rounded-full flex items-center justify-center">
                <FeatureIcon width={24} height={24} />
            </div>
        </div>
    );

    return (
        <div className="w-full mx-auto space-y-4">
            <Link
                href={mainFeature.url}
                className="block p-4 bg-[#1D1D1D] rounded-xl hover:bg-neutral-800 transition-colors relative overflow-hidden">
                <div className="flex items-start">
                    <div>
                        <h3 className="font-bold text-white flex items-center">
                            {mainFeature.title}
                            <span className="ml-2 py-1 px-3 text-xs rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56]">
                                Beta
                            </span>
                        </h3>
                        <p className="text-sm text-neutral-400">
                            {mainFeature.description}
                        </p>
                    </div>
                    <div className="absolute right-0 top-1">
                        <mainFeature.Icon width={64} height={64} />
                    </div>
                </div>
            </Link>

            <div className="grid grid-cols-4 gap-2">
                {bottomRowFeatures.map((feature) => (
                    <Link
                        key={feature.id}
                        href={feature.url}
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
                ))}

                <button
                    onClick={() => setIsOpen(true)}
                    className="p-3 bg-[#1D1D1D] rounded-xl hover:bg-neutral-800 transition-colors">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 flex items-center justify-center mb-2">
                            <LainnyaIcon width={32} height={32} />
                        </div>
                        <span className="font-bold text-white text-sm">
                            Lainnya
                        </span>
                    </div>
                </button>
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
                        <div className="flex min-h-full items-end">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="translate-y-full"
                                enterTo="translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="translate-y-0"
                                leaveTo="translate-y-full">
                                <Dialog.Panel className="w-full transform bg-[#1D1D1D] shadow-xl rounded-t-2xl">
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
                                            <Link
                                                href={mainFeature.url}
                                                className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-[#333540] rounded-full flex items-center justify-center">
                                                        <mainFeature.Icon
                                                            width={32}
                                                            height={24}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white flex items-center">
                                                        {mainFeature.title}
                                                        <span className="ml-2 py-1 px-3 text-xs rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56]">
                                                            Beta
                                                        </span>
                                                    </h3>
                                                    <p className="text-sm text-neutral-400">
                                                        {
                                                            mainFeature.description
                                                        }
                                                    </p>
                                                </div>
                                            </Link>

                                            {[
                                                ...bottomRowFeatures,
                                                ...moreFeatures
                                            ].map((feature) => (
                                                <Link
                                                    key={feature.id}
                                                    href={feature.url}
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                                                    <ModalFeatureIcon
                                                        Icon={feature.Icon}
                                                    />
                                                    <div>
                                                        <h3 className="font-bold text-white">
                                                            {feature.title}
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
