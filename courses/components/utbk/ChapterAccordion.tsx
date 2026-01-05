import { useRouter } from 'next/router';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SubchapterList } from './SubchapterList';

interface ChapterAccordionProps {
    title: string;
    chapter_id: string;
    chapter_slug: string;
    is_finished: boolean;
    initialOpen?: boolean;
}

function ChapterAccordion({
    title,
    chapter_id,
    chapter_slug,
    is_finished,
    initialOpen
}: ChapterAccordionProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const router = useRouter();
    const { slug_chapter } = router.query as { slug_chapter: string };

    return (
        <>
            <button
                className={`${
                    slug_chapter === chapter_slug
                        ? 'text-[#B6A6F3]'
                        : 'text-white'
                } ${
                    isOpen ? 'rounded-xl' : 'rounded-lg'
                } bg-[#222222] w-full flex justify-between items-center text-left font-semibold text-sm p-4`}
                onClick={() => setIsOpen((prev) => !prev)}>
                <span>{title}</span>
                <ChevronDown
                    className={`${
                        isOpen ? '-rotate-180' : ''
                    } w-6 h-6 text-[#999999] transition-all duration-300`}
                />
            </button>

            {isOpen ? (
                <SubchapterList
                    chapter_id={chapter_id}
                    chapter_slug={chapter_slug}
                    is_finished={is_finished}
                />
            ) : (
                <></>
            )}
        </>
    );
}

export { ChapterAccordion };
