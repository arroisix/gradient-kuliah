import { useState } from 'react';
import { HiCheck, HiOutlineChevronDown } from 'react-icons/hi';

const Collapse = ({
    key,
    title,
    chapter_id,
    is_finished,
    initialOpen = false
}: {
    key?: string;
    title: string;
    chapter_id: string;
    is_finished: boolean;
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
                <div className="flex gap-2">
                    {is_finished && (
                        <HiCheck size={18} className="text-[#02EC60]" />
                    )}
                    <span className="inline-block font-extrabold text-sm whitespace-nowrap text-ellipsis overflow-hidden">
                        {title}
                    </span>
                </div>
                <HiOutlineChevronDown
                    size={18}
                    className={`text-white ${
                        isOpen ? 'rotate-180' : ''
                    } transition-all`}
                />
            </div>
            <div
                className={`px-3 py-[10px] cursor-pointer hover:bg-[#272727] ${
                    isOpen ? '' : 'hidden'
                }`}>
                {chapter_id}
            </div>
        </div>
    );
};

export default Collapse;
