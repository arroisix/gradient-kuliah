import { useRouter } from 'next/router';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SubchapterList } from './SubchapterList';

// "chapter_id" used to get subchapters
type SubchapterUnion =
    | {
          chapter_id?: string;
          subchapterSearch: SubchapterSearch['items'];
      }
    | {
          chapter_id: string;
          subchapterSearch?: SubchapterSearch['items'];
      };

interface ChapterAccordionProps {
    title: string;
    chapter_slug: string;
    toggleable?: boolean;
    initialOpen?: boolean;
}

function ChapterAccordion({
    title,
    chapter_slug,
    toggleable = true,
    initialOpen,
    chapter_id,
    subchapterSearch
}: ChapterAccordionProps & SubchapterUnion): JSX.Element {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const router = useRouter();
    const { slug_chapter } = router.query as { slug_chapter: string };

    return (
        <div className="bg-[#222222] rounded-xl">
            <button
                disabled={!toggleable}
                className={`${
                    slug_chapter === chapter_slug
                        ? 'text-[#B6A6F3]'
                        : 'text-white'
                } ${
                    isOpen ? 'rounded-xl' : 'rounded-lg'
                } w-full flex justify-between items-center gap-2 text-left font-semibold text-sm p-4`}
                onClick={() => setIsOpen((prev) => !prev)}>
                <span className={isOpen ? '' : 'line-clamp-1'}>{title}</span>
                {toggleable ? (
                    <ChevronDown
                        className={`${
                            isOpen ? '-rotate-180' : ''
                        } w-6 h-6 text-[#999999] transition-all duration-300`}
                    />
                ) : (
                    <></>
                )}
            </button>

            {isOpen ? (
                <SubchapterList
                    chapter_id={chapter_id}
                    chapter_slug={chapter_slug}
                    subchapterSearch={subchapterSearch}
                />
            ) : (
                <></>
            )}
        </div>
    );
}

export { ChapterAccordion };
