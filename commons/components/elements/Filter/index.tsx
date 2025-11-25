import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import { BiCheck, BiChevronDown } from 'react-icons/bi';
import { useState } from 'react';
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

    const selected = options.find((option) =>
        filter ? option.value == filter : option.value == defaultSelected
    );

    const handleOptionClick = (value: string) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <>
            {/* Mobile: Button that opens bottom sheet */}
            <button
                onClick={() => setIsBottomSheetOpen(true)}
                className={cn(
                    'md:hidden flex justify-between items-center gap-2 text-xs font-bold pl-5 pr-3 py-3 bg-[#20222E] rounded-full',
                    fullWidth ? 'w-full' : 'w-full'
                )}>
                <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {selected?.label.replace('Semua ', '')}
                </span>
                <BiChevronDown size={18} />
            </button>

            {/* Desktop: Dropdown */}
            <div
                className={cn(
                    'hidden md:block dropdown z-0',
                    fullWidth ? 'w-full' : '',
                    className
                )}>
                <button
                    tabIndex={0}
                    className={cn(
                        'flex justify-between items-center gap-2 text-xs font-bold pl-5 pr-3 py-3 bg-[#20222E] rounded-full',
                        fullWidth ? 'w-full' : 'w-full md:w-52'
                    )}>
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                        {selected?.label.replace('Semua ', '')}
                    </span>
                    <BiChevronDown size={18} />
                </button>
                <ul
                    tabIndex={0}
                    role="menu"
                    className={cn(
                        'dropdown-content menu overflow-clip mt-1 [&_li>*]:rounded-none p-0 bg-[#20222E] text-xs rounded-lg z-10 divide-y divide-[#373737]',
                        fullWidth ? 'w-full' : 'w-full md:w-52'
                    )}>
                    {options.map(({ value, label }) => (
                        <li key={value} className="z-10">
                            <button
                                id={value}
                                className="flex justify-between items-center gap-3 px-[18px] py-[7.5px] border-t-[1px] border-[#373737] first:border-t-0 w-full text-left"
                                onClick={() => handleOptionClick(value)}>
                                {label}
                                <BiCheck
                                    size={16}
                                    className={cn(
                                        (!filter && value == defaultSelected) ||
                                            filter === value
                                            ? 'text-neutral-600'
                                            : 'text-transparent'
                                    )}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
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
