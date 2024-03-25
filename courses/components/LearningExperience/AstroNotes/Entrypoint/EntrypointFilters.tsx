import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BiCheck, BiFilter } from 'react-icons/bi';
import { SORT_OPTIONS, Sort } from '../constants';

const EntrypointSort = (): JSX.Element => {
    const router = useRouter();
    const { sort } = router.query as { sort: Sort };

    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="sticky z-10 pt-2 pb-4 bg-black top-32">
            <button
                className="flex justify-between items-center gap-2 text-xs font-bold w-full h-8 md:w-52 pl-5 pr-2 py-3 bg-[#2C2C2C] rounded-full"
                onClick={() => setShowDropdown((prev) => !prev)}
                aria-hidden>
                <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {SORT_OPTIONS[sort ?? Sort.release]}
                </span>
                <BiFilter size={18} />
            </button>
            <div
                className={cn(
                    'absolute top-12 left-0 w-full md:w-52 bg-[#2C2C2C] text-xs rounded-lg z-10 transition-all origin-top',
                    showDropdown
                        ? 'scale-100 opacity-100 visible pointer-events-auto'
                        : 'scale-95 opacity-0 invisible pointer-events-none'
                )}>
                {Object.entries(SORT_OPTIONS).map(([key, value]) => (
                    <Link
                        key={key}
                        id={key}
                        className="flex justify-between items-center gap-3 px-[18px] py-[7.5px] border-t-[1px] border-[#373737] first:border-t-0"
                        href={{ query: { sort: key as Sort } }}
                        replace
                        onClick={() => setShowDropdown((prev) => !prev)}
                        aria-hidden>
                        {value}
                        <BiCheck
                            size={16}
                            className={cn(
                                (!sort && key == Sort.release) ||
                                    sort === (key as Sort)
                                    ? 'text-neutral-600'
                                    : 'text-transparent'
                            )}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default EntrypointSort;
