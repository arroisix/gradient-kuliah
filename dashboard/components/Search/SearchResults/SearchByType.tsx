import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { BiCheck, BiChevronDown } from 'react-icons/bi';

const TYPE_OPTIONS = [
    { value: 'all', label: 'Semua' },
    { value: 'course', label: 'Kelas' },
    { value: 'astronotes', label: 'Astronotes' },
    { value: 'bank-soal', label: 'Bank Soal' },
    { value: 'text-book', label: 'Textbook Solution' },
    { value: 'community', label: 'Komunitas' },
    { value: 'exercise', label: 'Kuis' },
    { value: 'flashcard', label: 'Flashcard' }
];

const SearchByType = (): JSX.Element => {
    const router = useRouter();
    const { type } = router.query as { type: string };

    const defaultSelected = 'all';
    const selected =
        TYPE_OPTIONS.find((option) =>
            type ? option.value === type : option.value === defaultSelected
        ) || TYPE_OPTIONS[0];

    return (
        <div className="flex-1 dropdown md:flex-none min-w-max">
            <button
                tabIndex={0}
                className="flex justify-between items-center gap-2 text-xs font-bold w-full md:w-52 pl-5 pr-3 py-3 bg-[#2C2C2C] rounded-full"
                aria-hidden>
                <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {selected?.label}
                </span>
                <BiChevronDown size={18} />
            </button>
            <ul
                tabIndex={0}
                role="menu"
                className={cn(
                    'dropdown-content menu overflow-clip mt-1 [&_li>*]:rounded-none w-full p-0 md:w-max md:min-w-52 bg-[#2C2C2C] text-xs rounded-lg z-10 divide-y divide-[#373737]'
                )}>
                {TYPE_OPTIONS.map(({ value, label }) => (
                    <li key={value}>
                        <Link
                            id={value}
                            className="flex justify-between items-center gap-3 px-[18px] py-[7.5px] border-t-[1px] border-[#373737] first:border-t-0"
                            href={{
                                query: { ...router.query, type: value, page: 1, locked: 1 }
                            }}
                            replace
                            scroll={false}
                            aria-hidden>
                            {label}
                            <BiCheck
                                size={16}
                                className={cn(
                                    (!type && value === defaultSelected) ||
                                        type === value
                                        ? 'text-neutral-600'
                                        : 'text-transparent'
                                )}
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchByType;
