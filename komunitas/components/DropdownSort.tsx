import React from 'react';
import { BiCheck, BiFilter } from 'react-icons/bi';

const SORT_SUBJECTS = [
    { key: 'LATEST', value: 'Terbaru' },
    { key: 'POPULAR', value: 'Populer' },
    { key: 'ANSWERED', value: 'Terjawab' },
    { key: 'NOT_ANSWERED ', value: 'Belum terjawab' }
];

const DropdownSort = ({
    showFilter,
    filter,
    setShowFilter,
    setFilter,
    onChange
}: {
    showFilter: boolean;
    filter: string;
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    onChange: (event: any) => void;
}): JSX.Element => {
    return (
        <div className="w-1/2 relative cursor-pointer">
            <div
                className="flex justify-between items-center text-xs font-bold w-full md:w-fit pl-[18px] pr-2 py-[7.5px] md:p-[7px] bg-[#2C2C2C] rounded-full"
                onClick={() => setShowFilter((prev) => !prev)}
                aria-hidden>
                <span className="md:hidden">Filter</span>
                <BiFilter size={18} />
            </div>
            <div
                className={`absolute top-[120%] right-0 w-max bg-[#2C2C2C] text-xs rounded-lg z-[9] ${
                    showFilter ? '' : 'hidden'
                }`}>
                {SORT_SUBJECTS.map(({ key, value }) => (
                    <span
                        key={key}
                        id={key}
                        className="flex justify-between items-center gap-3 px-[18px] py-[7.5px] border-t-[1px] border-[#373737] first:border-t-0"
                        onClick={(event) => {
                            setFilter(key);
                            setShowFilter((prev) => !prev);
                            onChange(event);
                        }}
                        aria-hidden>
                        {value}
                        <BiCheck
                            size={16}
                            className={`${
                                filter === key
                                    ? 'text-neutral-600'
                                    : 'text-transparent'
                            }`}
                        />
                    </span>
                ))}
            </div>
        </div>
    );
};

export default DropdownSort;
