import { checkVisible, cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useLayoutEffect } from 'react';
import { activeClassName } from './constant';
import { getBookBaseHref } from 'courses/utils';
import { useTracker } from 'tracker/tracker';

type SubchapterMenuProps = {
    subchapter: BookSubchapter;
    chapter: Pick<BookChapter, 'title'>;
    category: BookDetailInterface['category'];
    activeSubchapter?: string;
    showSubchapter?: string;
    setShowSubchapter?: (to: string) => void;
};

const SubchapterMenu = ({
    subchapter,
    chapter,
    category,
    activeSubchapter,
    showSubchapter,
    setShowSubchapter
}: SubchapterMenuProps): JSX.Element => {
    const router = useRouter();
    const tracker = useTracker();
    const { slug, problemId, problemSlug } = router.query as {
        slug: string;
        problemSlug?: string;
        problemId?: string;
    };
    const hasChildren =
        subchapter.sections.length !== 0 ||
        (category == 'Bank Soal' && !subchapter.slug);

    useLayoutEffect(() => {
        setTimeout(() => {
            if (document && subchapter.sections.length && problemId) {
                const problem = document.getElementById(problemId);
                if (!checkVisible(problem as Element))
                    problem?.scrollIntoView({ behavior: 'smooth' });
            }
        }, 200);
    }, [problemId, subchapter]);

    const toggleAccordion = (): void => {
        setShowSubchapter?.(
            showSubchapter == subchapter.id ? '' : subchapter.id
        );
        tracker?.genericTrack('Click Subchapter List of Content', {
            'Book Slug': slug,
            'Book Page Query': problemId ?? problemSlug,
            'Chapter Name': chapter.title,
            'SubChapter Name': subchapter.title
        });
    };

    const href = (section: BookSubchapterSection): string => {
        const path = getBookBaseHref(category);
        switch (category) {
            case 'Textbook':
                return `${path}/${slug}/${section.id}`;
            case 'Bank Soal':
                return `${path}/${slug}/${section.slug}`;
            default:
                return `${path}/${slug}/${section.page_order}#${section.id}`;
        }
    };

    const isOpen = subchapter.id == showSubchapter;

    if (hasChildren)
        return (
            <li>
                <button
                    type="button"
                    onClick={toggleAccordion}
                    className={cn(
                        'menu-dropdown-toggle auto-cols-auto',
                        isOpen && 'menu-dropdown-show',
                        !activeSubchapter && isOpen && activeClassName,
                        subchapter.id == activeSubchapter && activeClassName
                    )}>
                    {subchapter.title}
                </button>
                <div
                    className={cn(
                        'menu-dropdown max-h-[200px] overflow-y-auto !p-0 hover:!bg-transparent hover:!cursor-default auto-cols-fr',
                        isOpen && 'menu-dropdown-show'
                    )}>
                    <ul className="*:!whitespace-normal">
                        {subchapter.sections.map((section) => (
                            <li id={section.id} key={section.id}>
                                <Link
                                    href={href(section)}
                                    className={cn(
                                        section.id == problemId &&
                                            'font-semibold text-white'
                                    )}>
                                    {section.title}
                                </Link>
                            </li>
                        ))}
                        {subchapter.sections.length == 0 && (
                            <li className="disabled">
                                <span>Segera hadir!</span>
                            </li>
                        )}
                    </ul>
                </div>
            </li>
        );

    return (
        <li>
            <Link
                href={href(subchapter)}
                className={cn(
                    (subchapter.id == problemId ||
                        subchapter.slug == problemSlug) &&
                        'font-semibold text-white'
                )}>
                {subchapter.title}
            </Link>
        </li>
    );
};

export default SubchapterMenu;
