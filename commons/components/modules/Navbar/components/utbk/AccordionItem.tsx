import Link from 'next/link';
import { ChevronDownIcon } from 'lucide-react';
import { Accordion } from '@base-ui/react/accordion';
import { ArrowRight } from './Arrows';

function AccordionItem({
    label,
    children,
    href
}: {
    label: string | JSX.Element;
    href?: string;
    children?: JSX.Element;
}): JSX.Element {
    let header;
    if (href) {
        header = (
            <div className="flex items-center w-full text-white h-[78px] md:h-[86px]">
                <span className="flex-grow text-left text-2xl md:text-3xl leading-[125%] font-bold">
                    {label}
                </span>
                <ArrowRight />
            </div>
        );
    } else {
        header = (
            <Accordion.Trigger className="group flex items-center w-full text-white h-[78px] md:h-[86px]">
                <span className="flex-grow text-left text-2xl md:text-3xl leading-[125%] font-bold">
                    {label}
                </span>
                <ChevronDownIcon
                    size={24}
                    className="group-data-[panel-open]:rotate-180 group-data-[panel-open]:text-[#B6A6F3]"
                />
            </Accordion.Trigger>
        );
    }

    const body = (
        <Accordion.Header>
            {header}
            {children ? (
                <Accordion.Panel className="pb-6 pt-2 md:pt-4">
                    {children}
                </Accordion.Panel>
            ) : null}
        </Accordion.Header>
    );

    return (
        <Accordion.Item className="border-b-[1px] border-white border-opacity-10">
            {href ? <Link href={href}>{body}</Link> : body}
        </Accordion.Item>
    );
}

export default AccordionItem;
