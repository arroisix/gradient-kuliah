import { useState, useEffect, useRef } from 'react';

interface SortOptionProps {
    key: string;
    label: string;
}

interface SortProps {
    options: SortOptionProps[];
    selectedSort: { key: string; label: string };
    onSelectSort: (sort: { key: string; label: string }) => void;
}

const SortButton = ({
    label,
    onClick
}: {
    label: string;
    onClick: () => void;
}): JSX.Element => (
    <button
        onClick={onClick}
        className="bg-[#2C2C2C] w-full border-0 rounded-full py-[10px] px-[20px] flex justify-between items-center hover:bg-[#373737] duration-200">
        <p className="text-[14px] text-start">{label}</p>
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 5H2.5V6.66667H17.5V5Z" fill="white" />{' '}
            <path d="M15 9.16602H5V10.8327H15V9.16602Z" fill="white" />{' '}
            <path d="M12.5 13.334H7.5V15.0007H12.5V13.334Z" fill="white" />{' '}
        </svg>
    </button>
);

const Separator = (): JSX.Element => (
    <div className="w-full h-[0.5px] bg-[rgba(153,153,153,0.5)]"></div>
);

const Sort = ({
    options,
    selectedSort,
    onSelectSort
}: SortProps): JSX.Element => {
    const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (
                sortRef.current &&
                !sortRef.current.contains(event.target as Node)
            ) {
                setIsSortMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sortRef]);

    return (
        <div className="md:w-[230px] relative" ref={sortRef}>
            <SortButton
                label={selectedSort.label}
                onClick={() => setIsSortMenuVisible((prev) => !prev)}
            />
            <div
                className={`absolute ${
                    !isSortMenuVisible && 'hidden'
                } mt-2 w-full bg-[#2C2C2C] rounded-lg`}
                style={{ zIndex: 100 }}>
                {options.map((sort: SortOptionProps, index: number) => (
                    <>
                        {index !== 0 && <Separator />}
                        <button
                            key={sort.key}
                            className="w-full py-2 hover:bg-[#373737] rounded-lg text-[14px] duration-200"
                            onClick={() => {
                                onSelectSort(sort);
                                setIsSortMenuVisible(false);
                            }}>
                            {sort.label}
                        </button>
                    </>
                ))}
            </div>
        </div>
    );
};

export default Sort;
