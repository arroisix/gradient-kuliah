import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import { BiCheck, BiChevronDown } from 'react-icons/bi';
import { useState, useRef, useEffect } from 'react';
import FilterBottomSheet from './FilterBottomSheet';

interface Option {
    value: string;
    label: string;
}

interface FilterProps {
    options: Option[];
    defaultSelected?: string;
    onChange?: (value: string) => void;
    fullWidth?: boolean;
    title?: string;
}

const Filter = ({
    options,
    defaultSelected,
    onChange,
    fullWidth = false,
    className,
    title
}: FilterProps & { className?: string }): JSX.Element => {
    const router = useRouter();
    const { filter } = router.query as { filter: string };
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selected = options.find((option) =>
        filter ? option.value == filter : option.value == defaultSelected
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleOptionClick = (value: string) => {
        if (onChange) {
            onChange(value);
        }
        setIsDropdownOpen(false);
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            {/* Mobile: Button that opens bottom sheet */}
            <button
                onClick={() => setIsBottomSheetOpen(true)}
                className={cn(
                    'md:hidden flex justify-between items-center gap-1 text-sm font-bold px-4 py-2 text-white bg-[#20222E] rounded-full',
                    fullWidth ? 'w-full' : 'w-full'
                )}>
                <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {selected?.label.replace('Semua ', '')}
                </span>
                <BiChevronDown size={20} />
            </button>

            {/* Desktop: Dropdown */}
            <div
                ref={dropdownRef}
                className={cn(
                    'hidden md:block dropdown z-50',
                    fullWidth ? 'w-full' : '',
                    className
                )}>
                <button
                    onClick={handleDropdownToggle}
                    className={cn(
                        'flex justify-between items-center gap-2 text-xs font-bold pl-5 pr-3 py-3 text-white bg-[#20222E] rounded-full',
                        fullWidth ? 'w-full' : 'w-full md:w-52'
                    )}>
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                        {selected?.label.replace('Semua ', '')}
                    </span>
                    <BiChevronDown size={18} />
                </button>
                {isDropdownOpen && (
                    <ul
                        role="menu"
                        className={cn(
                            'absolute menu overflow-clip mt-1 [&_li>*]:rounded-none p-0 bg-[#20222E] text-xs rounded-lg z-50 divide-y divide-[#373737]',
                            fullWidth ? 'w-full' : 'w-full md:w-52'
                        )}>
                        {options.map(({ value, label }) => (
                            <li key={value} className="z-10">
                                <button
                                    id={value}
                                    className="flex justify-between items-center gap-3 px-[18px] py-[7.5px] text-white border-t-[1px] border-[#373737] first:border-t-0 w-full text-left"
                                    onClick={() => handleOptionClick(value)}>
                                    {label}
                                    <BiCheck
                                        size={16}
                                        className={cn(
                                            (!filter &&
                                                value == defaultSelected) ||
                                                filter === value
                                                ? 'text-neutral-600'
                                                : 'text-transparent'
                                        )}
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Mobile Bottom Sheet */}
            <FilterBottomSheet
                isOpen={isBottomSheetOpen}
                setOpen={setIsBottomSheetOpen}
                options={options}
                selectedValue={filter || defaultSelected}
                onSelect={handleOptionClick}
                title={title || selected?.label.split(' ')[0] || 'Filter'}
            />
        </>
    );
};

export default Filter;
