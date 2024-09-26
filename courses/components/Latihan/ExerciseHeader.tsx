import React, { useState } from 'react';
import Link from 'next/link';
import { IoClose } from 'react-icons/io5';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { router } from 'next/client';
import ExerciseCloseModal from './ExerciseCloseModal';

interface ExerciseHeaderProps {
    title?: string;
    showNavigation?: boolean;
    prevLink?: string | null;
    nextLink?: string | null;
    onNavigationClick?: () => void;
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
    title,
    showNavigation = false,
    prevLink,
    nextLink,
    onNavigationClick
}) => {
    useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleConfirmClose = async () => {
        setIsModalOpen(false);
        router.push('/latihan');
    };

    return (
        <>
            <div
                className={`px-4 md:px-4 py-2 md:py-4 flex flex-row w-full max-w-full items-center ${
                    showNavigation || title ? 'justify-between' : 'justify-end'
                }`}>
                {title && !showNavigation && (
                    <div className="text-sm font-base text-white">{title}</div>
                )}

                <a
                    href="/latihan"
                    className="text-gray-400 hover:text-white z-10"
                    onClick={handleCloseClick}>
                    <IoClose size={24} />
                </a>

                {showNavigation && (
                    <div className="flex gap-3 md:gap-4 items-center">
                        <button
                            onClick={onNavigationClick}
                            className="bg-[#333540] rounded-sm px-2 md:px-3 py-1 md:py-1.5 h-[30px] w-[120px] md:w-[132px] flex items-center justify-center">
                            <span className="text-white text-xs md:text-sm">
                                Quiz Navigation
                            </span>
                        </button>
                        <Link href={prevLink || ''} passHref>
                            <a
                                className={`bg-[#333540] text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full ${
                                    !prevLink
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}>
                                <IoChevronBackOutline size={20} />
                            </a>
                        </Link>
                        <Link href={nextLink || ''} passHref>
                            <a
                                className={`bg-[#333540] text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full ${
                                    !nextLink
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}>
                                <IoChevronForwardOutline size={20} />
                            </a>
                        </Link>
                    </div>
                )}
            </div>
            <ExerciseCloseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmClose}
            />
        </>
    );
};

export default ExerciseHeader;
