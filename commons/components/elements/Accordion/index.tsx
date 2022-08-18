import { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface AccordionItemProps {
    title: string;
    content: string;
}

interface AccordionProps {
    item: AccordionItemProps[];
}

const AccordionItem = ({
    title,
    content
}: {
    title: string;
    content: string;
}): JSX.Element => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div
                className={`text-xl font-bold p-4 flex justify-between items-center cursor-pointer bg-neutral-900 mt-4 ${
                    open ? 'rounded-t-lg' : 'rounded-lg'
                }`}
                role="alert"
                onClick={() => setOpen(!open)}
                aria-hidden="true">
                {title}
                {open ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {open && (
                <div
                    className="p-4 pt-1 bg-neutral-900 text-neutral-400 rounded-b-lg font-body"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            )}
        </>
    );
};

const Accordion = ({ item }: AccordionProps): JSX.Element => {
    return (
        <div>
            {item.map((i: AccordionItemProps) => (
                <AccordionItem
                    content={i.content}
                    title={i.title}
                    key={i.title}
                />
            ))}
        </div>
    );
};

export default Accordion;
