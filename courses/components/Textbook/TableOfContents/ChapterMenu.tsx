import Skeleton from 'commons/components/elements/Skeleton';
import { checkVisible, cn } from 'commons/utils';
import { useGetPublicTableContentSubchaptersQuery } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTracker } from 'tracker/tracker';
import SubchapterMenu from './SubchapterMenu';
import { activeClassName } from './constant';

type ChapterMenuProps = {
    chapter: BookDetailInterface['chapters'][number];
    category: BookDetailInterface['category'];
    activeChapter?: string;
    activeSubchapter?: string;
    showChapter?: string;
    setShowChapter?: (to: string) => void;
};

const ChapterMenu = ({
    chapter,
    category,
    activeSubchapter,
    activeChapter,
    showChapter,
    setShowChapter
}: ChapterMenuProps): JSX.Element => {
    const router = useRouter();
    const { slug, problemSlug } = router.query as {
        slug: string;
        problemSlug?: string;
    };
    const { data: subchapters, isLoading } =
        useGetPublicTableContentSubchaptersQuery(
            { slug: slug, chapter_id: chapter.id },
            { skip: showChapter !== chapter.id }
        );

    const [showSubchapter, setShowSubchapter] = useState(activeSubchapter);

    const tracker = useTracker();
    const toggleAccordion = (): void => {
        tracker?.genericTrack('User Click Chapter List of Content', {
            'Chapter Name': chapter.title,
            'Book Slug': slug,
            'Book Page Query': router.query
        });
        setShowChapter?.(showChapter == chapter.id ? '' : chapter.id);
    };

    useEffect(() => {
        if (document && activeChapter) {
            const activeChapterElement = document.getElementById(activeChapter);
            if (!checkVisible(activeChapterElement as Element))
                activeChapterElement?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [problemSlug, activeChapter]);

    const isOpen = chapter.id == showChapter;

    return (
        <li id={chapter.id}>
            <button
                type="button"
                onClick={toggleAccordion}
                className={cn(
                    'menu-dropdown-toggle auto-cols-auto',
                    isOpen && 'menu-dropdown-show',
                    !activeChapter && isOpen && activeClassName,
                    chapter.id == activeChapter && activeClassName
                )}>
                <h2>{chapter.title}</h2>
            </button>
            <ul
                className={cn(
                    'menu-dropdown *:!whitespace-normal mt-1',
                    isOpen && 'menu-dropdown-show'
                )}>
                {isLoading ? (
                    <Skeleton
                        isCustomSize
                        repeat={3}
                        className="w-full h-8 mb-2"
                    />
                ) : (
                    subchapters?.data.map((subchapter) => (
                        <SubchapterMenu
                            key={subchapter.id}
                            category={category}
                            chapter={chapter}
                            subchapter={subchapter}
                            activeSubchapter={activeSubchapter}
                            showSubchapter={showSubchapter}
                            setShowSubchapter={setShowSubchapter}
                        />
                    ))
                )}
            </ul>
        </li>
    );
};

export default ChapterMenu;
