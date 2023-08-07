import React, { ReactNode } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const Menu = ({
    icon,
    text,
    handleClick
}: {
    icon: ReactNode;
    text: string;
    handleClick: () => void;
}): JSX.Element => {
    return (
        <div
            className="flex justify-between items-center p-4 bg-[#121212] rounded-lg cursor-pointer"
            onClick={handleClick}
            aria-hidden>
            <div className="flex items-center gap-[14px]">
                {icon}
                <span className="inline-block font-extrabold text-sm">
                    {text}
                </span>
            </div>
            <FiChevronRight size={24} className="text-neutral-400" />
        </div>
    );
};

export default Menu;
