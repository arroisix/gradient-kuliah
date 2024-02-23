import { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface AccordionItemProps {
    title: string;
    content?: string;
    jsxContent?: JSX.Element;
    onClick?: () => void;
}

interface AccordionProps {
    item: AccordionItemProps[];
}

export const AccordionItem = ({
    title,
    content,
    jsxContent,
    onClick
}: AccordionItemProps): JSX.Element => {
    const [open, setOpen] = useState(false);

    const renderContent = (): JSX.Element => {
        if (jsxContent) {
            return (
                <div className="p-4 pt-1 bg-neutral-900 text-neutral-400 rounded-b-lg font-body">
                    {jsxContent}
                </div>
            );
        }
        return (
            <div
                className="p-4 pt-1 bg-neutral-900 text-neutral-400 rounded-b-lg font-body"
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

const Accordion = ({ item }: AccordionProps): JSX.Element => {
    return (
        <div>
            {item.map((i: AccordionItemProps) => (
                <AccordionItem
                    content={i.content}
                    jsxContent={i.jsxContent}
                    title={i.title}
                    key={i.title}
                    onClick={i.onClick}
                />
            ))}
        </div>
    );
};

export default Accordion;
