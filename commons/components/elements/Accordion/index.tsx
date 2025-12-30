import { cn } from 'commons/utils';
import { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import DOMPurify from 'isomorphic-dompurify';

interface AccordionItemProps {
    title: string;
    content?: string;
    jsxContent?: JSX.Element;
    isHeading?: boolean;
    className?: string;
    isOpen?: boolean;
    onClick?: () => void;
    containerClassName?: string;
    headerClassName?: string;
    iconClassName?: string;
}

interface AccordionProps {
    item: AccordionItemProps[];
    className?: string;
    containerClassName?: string;
    contentClassName?: string;
    headerClassName?: string;
    iconClassName?: string;
}

export const AccordionItem = ({
    title,
    content,
    jsxContent,
    onClick,
    className,
    isOpen,
    isHeading,
    containerClassName,
    headerClassName,
    iconClassName
}: AccordionItemProps): JSX.Element => {
    const [open, setOpen] = useState(isOpen ?? false);
    const AccordionTitle = isHeading ? 'h3' : 'span';

    const renderContent = (): JSX.Element => {
        if (jsxContent) {
            return (
                <div
                    className={cn(
                        'p-4 pt-1 rounded-b-lg bg-neutral-900 text-neutral-400 font-body',
                        className
                    )}>
                    {jsxContent}
                </div>
            );
        }
        return (
            <div
                className={cn(
                    'p-4 pt-1 rounded-b-lg bg-neutral-900 text-neutral-400 font-body',
                    className
                )}
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(content as string)
                }}
            />
        );
    };

    return (
        <div className={cn('rounded-lg', containerClassName)}>
            <button
                className={cn(
                    'text-sm w-full md:text-base font-semibold px-4 py-3 flex justify-between items-center cursor-pointer bg-neutral-900',
                    open ? 'rounded-t-lg' : 'rounded-lg',
                    headerClassName
                )}
                onClick={() => {
                    setOpen(!open);
                    onClick?.();
                }}>
                <AccordionTitle>{title}</AccordionTitle>
                {open ? (
                    <FaChevronUp
                        className={cn('w-4 h-4 shrink-0', iconClassName)}
                    />
                ) : (
                    <FaChevronDown
                        className={cn('w-4 h-4 shrink-0', iconClassName)}
                    />
                )}
            </button>
            {open && renderContent()}
        </div>
    );
};

const Accordion = ({
    item,
    className,
    containerClassName,
    contentClassName,
    headerClassName,
    iconClassName
}: AccordionProps): JSX.Element => {
    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {item.map(({ className, ...props }: AccordionItemProps) => (
                <AccordionItem
                    key={props.title}
                    className={cn(className, contentClassName)}
                    headerClassName={headerClassName}
                    iconClassName={iconClassName}
                    containerClassName={containerClassName}
                    {...props}
                />
            ))}
        </div>
    );
};

export default Accordion;
