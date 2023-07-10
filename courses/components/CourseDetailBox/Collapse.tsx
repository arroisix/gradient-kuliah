import { ReactNode, useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

const Collapse = ({
    key,
    title,
    content,
    initialOpen = false
}: {
    key?: string;
    title: string;
    content: ReactNode;
    initialOpen?: boolean;
}): JSX.Element => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    return (
        <div key={key} className="bg-[#1D1D1D] rounded">
            <div
                className={`flex justify-between gap-2 p-3 cursor-pointer ${
                    isOpen && 'border-b-[1px] border-[#2D2D2D]'
                }`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-hidden>
                <span className="inline-block font-extrabold text-sm whitespace-nowrap text-ellipsis overflow-hidden">
                    {title}
                </span>
                <HiOutlineChevronDown
                    size={18}
                    className={`text-white ${
                        isOpen ? 'rotate-180' : ''
                    } transition-all`}
                />
            </div>
            <div className={`${isOpen ? '' : 'hidden'}`}>{content}</div>
        </div>
    );
};

export default Collapse;
