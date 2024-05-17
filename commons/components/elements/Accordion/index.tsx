import { cn } from 'commons/utils';
import { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface AccordionItemProps {
    title: string;
    content?: string;
    jsxContent?: JSX.Element;
    className?: string;
    isOpen?: boolean;
    onClick?: () => void;
}

interface AccordionProps {
    item: AccordionItemProps[];
    className?: string;
}

export const AccordionItem = ({
    title,
    content,
    jsxContent,
    onClick,
    className,
    isOpen
}: AccordionItemProps): JSX.Element => {
    const [open, setOpen] = useState(isOpen ?? false);

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
                dangerouslySetInnerHTML={{ __html: content as string }}
            />
        );
    };

    return (
        <>
            <div
                className={`text-sm md:text-base font-semibold px-4 py-3 flex justify-between items-center cursor-pointer bg-neutral-900 first:mt-0 mt-4 ${
                    open ? 'rounded-t-lg' : 'rounded-lg'
                }`}
                role="alert"
                onClick={() => {
                    setOpen(!open);
                    onClick?.();
                }}
                aria-hidden="true">
                {title}
                {open ? (
                    <FaChevronUp className="w-4 h-4" />
                ) : (
                    <FaChevronDown className="w-4 h-4" />
                )}
            </div>
            {open && renderContent()}
        </>
    );
};

const Accordion = ({ item, className }: AccordionProps): JSX.Element => {
    return (
        <div className={cn(className)}>
            {item.map((props: AccordionItemProps) => (
                <AccordionItem key={props.title} {...props} />
            ))}
        </div>
    );
};

export default Accordion;
