import { cn } from 'commons/utils';
import { useGetBookDetailQuery } from 'courses/redux/api/astronotesApi';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import ChapterContent from '../LearningExperience/AstroNotes/Detail/ChapterContent';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Skeleton from 'commons/components/elements/Skeleton';
import { useTracker } from 'tracker/tracker';

export const TableOfContentMenu = ({
    problem
}: Partial<Pick<TextbookSolution, 'problem'>>): JSX.Element => {
    const tracker = useTracker();
    const { query } = useRouter();
    const { slug, problemId } = query as { slug: string; problemId: string };
    const { data } = useGetBookDetailQuery({ slug }, { skip: !slug });
    const book = data?.book;
    const { isDesktopBreakpoints, isMobileBreakpoints } =
        useWindowBreakpoints();

    const [isDrawerOpen, setIsDrawerOpen] = useState(isDesktopBreakpoints);

    useEffect(() => {
        if (problemId && isMobileBreakpoints) setIsDrawerOpen(false);
    }, [problemId, isMobileBreakpoints]);

    useEffect(() => {
        if (problem?.chapter_id) setChapter(problem.chapter_id);
    }, [problem]);

    const [chapter, setChapter] = useState('');

    const toggleAccordion = (id: string, name: string): void => {
        if (id !== chapter)
            tracker?.genericTrack('User Click Chapter List of Content', {
                'Chapter Name': name,
                'Book Slug': slug,
                'Book Page Query': query
            });
        setChapter((prev) => (prev == id ? '' : id));
    };

    return (
        <>
            <input
                id="toc-drawer"
                type="checkbox"
                checked={isDrawerOpen}
                onChange={(e) => {
                    const checked = e.target.checked;
                    setIsDrawerOpen(checked);
                    tracker?.genericTrack(
                        checked
                            ? 'Open Textbook List of Content Menu'
                            : 'Close Textbook List of Content Menu',
                        {
                            'Book Slug': slug,
                            'Book Page Query': query
                        }
                    );
                }}
                className="drawer-toggle"
            />
            <label
                htmlFor="toc-drawer"
                className="fixed inset-x-0 z-10 flex items-center gap-4 px-4 py-3 shadow top-14 bg-neutral-900 lg:hidden">
                <div
                    className={cn(
                        'relative flex-none border rounded-md border-neutral-700 h-16 aspect-[256/364] bg-neutral-600',
                        !book?.cover_url && 'animate-pulse'
                    )}>
                    {book?.cover_url && (
                        <Image
                            src={book?.cover_url}
                            alt={book?.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded"
                        />
                    )}
                </div>
                <div className="space-y-1 grow">
                    {problem?.title ? (
                        <p className={'text-sm font-bold'}>{problem?.title}</p>
                    ) : (
                        <Skeleton isCustomSize className="w-32 h-4" />
                    )}
                    {book?.title ? (
                        <p className="text-xs text-neutral-400">
                            {book?.title}
                        </p>
                    ) : (
                        <Skeleton isCustomSize className="w-48 h-4" />
                    )}
                </div>
                <BiChevronRight size={24} />
            </label>
            <div className="z-20 md:pt-14 lg:!overflow-y-auto drawer-side md:z-0">
                <div className="w-full min-h-full bg-[#121212] md:w-96">
                    <div className="sticky inset-x-0 top-0 px-4 py-3 bg-[#1d1d1d]">
                        <label
                            htmlFor="toc-drawer"
                            className="block h-6 mb-3 md:hidden">
                            <BiChevronLeft size={24} />
                        </label>
                        <div className="flex items-center gap-4 ">
                            <div
                                className={cn(
                                    'relative flex-none border rounded-md border-neutral-700 h-16 aspect-[256/364] bg-neutral-600/10',
                                    !book?.cover_url && 'animate-pulse'
                                )}>
                                {book?.cover_url && (
                                    <Image
                                        src={book?.cover_url}
                                        alt={book?.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded"
                                    />
                                )}
                            </div>

                            <div className="space-y-1 grow">
                                {book ? (
                                    <>
                                        <p className="pb-1 text-sm font-bold">
                                            {book?.title}
                                        </p>
                                        <p className="font-sans text-xs truncate">
                                            {book?.authors.join(', ')}
                                        </p>
                                        {book?.isbn && (
                                            <h2 className="font-sans text-xs text-neutral-400">{`ISBN: ${book?.isbn}`}</h2>
                                        )}
                                    </>
                                ) : (
                                    <Skeleton
                                        isCustomSize
                                        repeat={3}
                                        className="w-3/5 h-3 first:w-3/4 last:w-1/2"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {book?.chapters ? (
                        <div className="p-4 space-y-4 ">
                            {book.chapters.map((ch) => (
                                <label
                                    key={ch.id}
                                    className="rounded-lg collapse collapse-arrow bg-[#222]">
                                    <input
                                        type="checkbox"
                                        name="kelasku"
                                        onChange={() =>
                                            toggleAccordion(ch.id, ch.title)
                                        }
                                        checked={ch.id == chapter}
                                        className="min-h-0"
                                    />
                                    <div className="!px-4 !py-3 font-bold collapse-title min-h-fit md:!py-4 md:!px-5 collapse-arrow">
                                        {ch.title}
                                    </div>
                                    <div className="collapse-content">
                                        <ChapterContent
                                            isDrawer
                                            id={ch.id}
                                            activeSubchapter={
                                                problem?.section_id
                                            }
                                            category="Textbook"
                                            slug={slug as string}
                                        />
                                    </div>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 space-y-4">
                            <Skeleton
                                repeat={4}
                                isCustomSize
                                className="h-12"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
