import React, { useEffect, useState } from 'react';
import ChapterMenu from './ChapterMenu';
import { cn } from 'commons/utils';

type TableOfContentsProps = {
    activeChapter?: string;
    activeSubchapter?: string;
} & Pick<BookDetailInterface, 'chapters' | 'category'> &
    PropsWithClassName;

const TableOfContents = ({
    chapters,
    activeChapter,
    activeSubchapter,
    category,
    className
}: TableOfContentsProps): JSX.Element => {
    const [showChapter, setShowChapter] = useState(activeChapter);

    useEffect(() => {
        if (activeChapter !== showChapter) setShowChapter(activeChapter);
    }, [activeChapter]);

    return (
        <ul
            className={cn(
                'menu *:!whitespace-normal text-neutral-300',
                className
            )}>
            {chapters.map((chapter) => (
                <ChapterMenu
                    key={chapter.id}
                    category={category}
                    chapter={chapter}
                    activeChapter={activeChapter}
                    activeSubchapter={activeSubchapter}
                    showChapter={showChapter}
                    setShowChapter={setShowChapter}
                />
            ))}
        </ul>
    );
};

export default TableOfContents;
