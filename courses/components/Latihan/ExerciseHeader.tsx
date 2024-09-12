import React from 'react';
import Link from 'next/link';
import { IoClose } from 'react-icons/io5';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';

interface ExerciseHeaderProps {
    title?: string;
    showNavigation?: boolean;
    prevLink?: string | null;
    nextLink?: string | null;
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
    title,
    showNavigation = false,
    prevLink,
    nextLink
}) => {
    useRouter();
    return (
        <div
            className={`p-4 flex flex-row w-full max-w-full items-center ${
                showNavigation || title ? 'justify-between' : 'justify-end'
            }`}>
            {title && !showNavigation && (
                <div className="text-sm font-base text-white">{title}</div>
            )}

            <Link href="/latihan" passHref>
                <a className="text-gray-400 hover:text-white z-10">
                    <IoClose size={24} />
                </a>
            </Link>

            {showNavigation && (
                <div className="flex gap-4 items-center">
                    <div className="bg-[#333540] rounded-sm px-3 py-1.5 h-[30px] w-[132px] flex items-center justify-center">
                        <span className="text-white text-sm">
                            Quiz Navigation
                        </span>
                    </div>
                    <Link href={prevLink || ''} passHref>
                        <a
                            className={`bg-[#333540] text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full ${
                                !prevLink ? 'opacity-50 cursor-not-allowed' : ''
                            }`}>
                            <IoChevronBackOutline size={20} />
                        </a>
                    </Link>
                    <Link href={nextLink || ''} passHref>
                        <a
                            className={`bg-[#333540] text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full ${
                                !nextLink ? 'opacity-50 cursor-not-allowed' : ''
                            }`}>
                            <IoChevronForwardOutline size={20} />
                        </a>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ExerciseHeader;
