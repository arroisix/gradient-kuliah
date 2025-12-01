import React from 'react';
import { BiCheck, BiFilter } from 'react-icons/bi';

interface SubjectInterface {
    key: 'LATEST' | 'POPULAR' | 'ANSWERED' | 'NOT_ANSWERED';
    value: string;
}

const SORT_OPTIONS: SubjectInterface[] = [
    { key: 'LATEST', value: 'Terbaru' },
    { key: 'POPULAR', value: 'Populer' },
    { key: 'ANSWERED', value: 'Terjawab' },
    { key: 'NOT_ANSWERED', value: 'Belum terjawab' }
];

const SORT_KEY_VALUE = {
    LATEST: 'Terbaru',
    POPULAR: 'Populer',
    ANSWERED: 'Terjawab',
    NOT_ANSWERED: 'Belum terjawab'
};

const DropdownSort = ({
    showSort,
    sort,
    setShowSort,
    setSort,
    onChange
}: {
    showSort: boolean;
    sort: 'LATEST' | 'POPULAR' | 'ANSWERED' | 'NOT_ANSWERED';
    setShowSort: React.Dispatch<React.SetStateAction<boolean>>;
    setSort: React.Dispatch<
        React.SetStateAction<'LATEST' | 'POPULAR' | 'ANSWERED' | 'NOT_ANSWERED'>
    >;
    onChange: (event: any) => void;
}): JSX.Element => {
    return (
        <div className="w-1/2 relative cursor-pointer">
            <div
                className="flex justify-between items-center gap-1 text-xs font-bold w-full md:w-fit pl-[18px] pr-2 py-[7.5px] md:p-[7px] bg-[#20222E] rounded-full"
                onClick={() => setShowSort((prev) => !prev)}
                aria-hidden>
                <span className="md:hidden whitespace-nowrap text-ellipsis overflow-hidden">
                    {SORT_KEY_VALUE[sort]}
                </span>
                <BiFilter size={18} />
            </div>
            <div
                className={`absolute top-[120%] right-0 w-max bg-[#20222E] text-xs rounded-lg z-[9] ${
                    showSort ? '' : 'hidden'
                }`}>
                {SORT_OPTIONS.map(({ key, value }) => (
                    <span
                        key={key}
                        id={key}
                        className="flex justify-between items-center gap-3 px-[18px] py-[7.5px] border-t-[1px] border-[#373737] first:border-t-0"
                        onClick={(event) => {
                            setSort(key);
                            setShowSort((prev) => !prev);
                            onChange(event);
                        }}
                        aria-hidden>
                        {value}
                        <BiCheck
                            size={16}
                            className={`${
                                sort === key
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
