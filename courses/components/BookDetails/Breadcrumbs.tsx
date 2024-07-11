import Skeleton from 'commons/components/elements/Skeleton';
import Link from 'next/link';
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

const Breadcrumbs = ({ title }: { title?: string }): JSX.Element => {
    return (
        <div className="flex flex-row gap-2.5 items-center text-xs md:text-sm py-4">
            <Link href={'/astronotes'} className="cursor-pointer">
                <p className="text-[#666666] hover:text-[#666666]/[0.75] duration-100 transition-all ease-in-out">
                    Perpustakaan
                </p>
            </Link>
            <FaChevronRight className="text-[#666666] h-3 md:h-3.5" />
            {title ? (
                <p className="text-white">{title}</p>
            ) : (
                <Skeleton isCustomSize className="w-24 h-4" />
            )}
        </div>
    );
};

export default Breadcrumbs;
