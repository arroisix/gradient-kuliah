import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useLayoutEffect } from 'react';
import { activeClassName } from './constant';
import { getBookBaseHref } from 'courses/utils';

type SubchapterMenuProps = {
    subchapter: BookSubchapter;
    category: BookDetailInterface['category'];
    activeSubchapter?: string;
    showSubchapter?: string;
    setShowSubchapter?: (to: string) => void;
};

const SubchapterMenu = ({
    subchapter,
    category,
    activeSubchapter,
    showSubchapter,
    setShowSubchapter
}: SubchapterMenuProps): JSX.Element => {
    const router = useRouter();
    const { slug, problemId } = router.query as {
        slug: string;
        problemId?: string;
    };
    const hasChildren = subchapter.sections.length !== 0;

    useLayoutEffect(() => {
        setTimeout(() => {
            if (document && subchapter.sections.length && problemId) {
                const problem = document.getElementById(problemId);
                problem?.scrollIntoView({ behavior: 'smooth' });
            }
        }, 200);
    }, [problemId, subchapter]);

    const toggleAccordion = (): void => {
        setShowSubchapter?.(
            showSubchapter == subchapter.id ? '' : subchapter.id
        );
    };

    const href = (section: BookSubchapterSection): string => {
        const path = getBookBaseHref(category);
        return category === 'Textbook'
            ? `${path}/${slug}/${section.id}`
            : `${path}/${slug}/${section.page_order}#${section.id}`;
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
                    </ul>
                </div>
            </li>
        );

    return (
        <li>
            <Link
                href={href(subchapter)}
                className={cn(
                    subchapter.id == problemId && 'font-semibold text-white'
                )}>
                {subchapter.title}
            </Link>
        </li>
    );
};

export default SubchapterMenu;
