import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import { BiCheck, BiFilter } from 'react-icons/bi';

interface Option {
    value: string;
    label: string;
}

interface FilterProps {
    options: Option[];
    defaultSelected?: string;
    onChange?: (value: string) => void;
    fullWidth?: boolean;
}

const Filter = ({
    options,
    defaultSelected,
    onChange,
    fullWidth = false,
    className
}: FilterProps & { className?: string }): JSX.Element => {
    const router = useRouter();
    const { filter } = router.query as { filter: string };

    const selected = options.find((option) =>
        filter ? option.value == filter : option.value == defaultSelected
    );

    const handleOptionClick = (value: string) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div className={cn('dropdown', fullWidth ? 'w-full' : '', className)}>
            <button
                tabIndex={0}
                className={cn(
                    'flex justify-between items-center gap-2 text-xs font-bold pl-5 pr-3 py-3 bg-[#2C2C2C] rounded-full',
                    fullWidth ? 'w-full' : 'w-full md:w-52'
                )}
                aria-hidden>
                <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {selected?.label}
                </span>
                <BiFilter size={18} />
            </button>
            <ul
                tabIndex={0}
                role="menu"
                className={cn(
                    'dropdown-content menu overflow-clip mt-1 [&_li>*]:rounded-none p-0 bg-[#2C2C2C] text-xs rounded-lg z-10 divide-y divide-[#373737]',
                    fullWidth ? 'w-full' : 'w-full md:w-52'
                )}>
                {options.map(({ value, label }) => (
                    <li key={value}>
                        <button
                            id={value}
                            className="flex justify-between items-center gap-3 px-[18px] py-[7.5px] border-t-[1px] border-[#373737] first:border-t-0 w-full text-left"
                            onClick={() => handleOptionClick(value)}
                            aria-hidden>
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
    );
};

export default Filter;
