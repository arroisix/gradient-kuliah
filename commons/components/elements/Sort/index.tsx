import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BiCheck, BiFilter } from 'react-icons/bi';

interface SortProps {
    options: Option[];
    defaultSelected?: string;
    iconOnly?: boolean;
    fullWidth?: boolean;
}

const Sort = ({
    options,
    defaultSelected,
    iconOnly = false,
    fullWidth,
    className
}: SortProps & PropsWithClassName): JSX.Element => {
    const router = useRouter();
    const { sort } = router.query as { sort: string };

    const selected = options.find((option) =>
        sort ? option.value == sort : option.value == defaultSelected
    );

    return (
        <div
            className={cn(
                'dropdown',
                iconOnly && 'dropdown-end',
                fullWidth && 'w-full',
                className
            )}>
            <button
                tabIndex={0}
                className={cn(
                    'flex items-center bg-[#2C2C2C] rounded-full',
                    iconOnly
                        ? 'justify-center w-11 h-11'
                        : 'justify-between gap-2 text-xs font-bold w-full md:w-52 pl-5 pr-3 py-3'
                )}
                aria-hidden>
                {!iconOnly && (
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                        {selected?.label}
                    </span>
                )}
                <BiFilter size={18} />
            </button>
            <ul
                tabIndex={0}
                role="menu"
                className={cn(
                    'dropdown-content menu overflow-clip mt-1 [&_li>*]:rounded-none p-0 bg-[#2C2C2C] text-xs rounded-lg z-10 divide-y divide-[#373737]',
                    iconOnly ? 'w-52' : 'w-full md:w-52'
                )}>
                {options.map(({ value, label }) => (
                    <li key={value}>
                        <Link
                            id={value}
                            className="flex justify-between items-center gap-3 px-[18px] py-[7.5px] border-t-[1px] border-[#373737] first:border-t-0"
                            href={{ query: { ...router.query, sort: value } }}
                            replace
                            scroll={false}
                            aria-hidden>
                            {label}
                            <BiCheck
                                size={16}
                                className={cn(
                                    (!sort && value == defaultSelected) ||
                                        sort === value
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

export default Sort;
