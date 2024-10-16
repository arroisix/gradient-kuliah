import React, { useState } from 'react';
import Link from 'next/link';
import { IoClose } from 'react-icons/io5';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';
import ExerciseCloseModal from './ExerciseCloseModal';
import { cn } from 'commons/utils';

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
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isReportPage = router.asPath.includes('/report/');

    const handleCloseClick = (e: React.MouseEvent): void => {
        e.preventDefault();
        if (isReportPage) {
            router.back();
        } else {
            setIsModalOpen(true);
        }
    };

    const handleConfirmClose = (): void => {
        setIsModalOpen(false);
        router.back();
    };

    return (
        <>
            <div
                className={cn(
                    'px-4 md:px-4 py-2 md:py-4 flex flex-row w-full max-w-full items-center',
                    showNavigation || title ? 'justify-between' : 'justify-end'
                )}>
                {title && !showNavigation && (
                    <div className="text-sm font-base text-white">{title}</div>
                )}

                <button
                    className="text-graphite-400 hover:text-white z-10"
                    onClick={handleCloseClick}>
                    <IoClose size={24} />
                </button>

                {showNavigation && (
                    <div className="flex gap-3 md:gap-4 items-center">
                        <button
                            onClick={onNavigationClick}
                            className="bg-[#333540] rounded-sm px-2 md:px-3 py-1 md:py-1.5 h-[30px] w-[120px] md:w-[132px] flex items-center justify-center">
                            <span className="text-white text-xs md:text-sm">
                                Quiz Navigation
                            </span>
                        </button>
                        <Link href={prevLink || ''} replace passHref>
                            <a
                                className={cn(
                                    'bg-[#333540] text-graphite-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full',
                                    !prevLink && 'opacity-50 cursor-not-allowed'
                                )}>
                                <IoChevronBackOutline size={20} />
                            </a>
                        </Link>
                        <Link href={nextLink || ''} replace passHref>
                            <a
                                className={cn(
                                    'bg-[#333540] text-graphite-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full',
                                    !nextLink && 'opacity-50 cursor-not-allowed'
                                )}>
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
