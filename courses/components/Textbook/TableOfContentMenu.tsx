import { cn } from 'commons/utils';
import { useGetBookDetailQuery } from 'courses/redux/api/astronotesApi';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Skeleton from 'commons/components/elements/Skeleton';
import { useTracker } from 'tracker/tracker';
import TableOfContents from './TableOfContents';
import Link from 'next/link';
import { getBookBaseHref } from 'courses/utils';

export const TableOfContentMenu = ({
    problem
}: Partial<Pick<TextbookSolution, 'problem'>>): JSX.Element => {
    const tracker = useTracker();
    const { query } = useRouter();
    const { slug, problemSlug } = query as {
        slug: string;
        problemSlug: string;
    };
    const { isDesktopBreakpoints, isMobileBreakpoints } =
        useWindowBreakpoints();
    const [isDrawerOpen, setIsDrawerOpen] = useState(isDesktopBreakpoints);

    const { data } = useGetBookDetailQuery({ slug }, { skip: !slug });
    const book = data?.book;

    useEffect(() => {
        if (problemSlug && isMobileBreakpoints) setIsDrawerOpen(false);
    }, [problemSlug, isMobileBreakpoints]);

    const Loader = (): JSX.Element => (
        <div className="p-4 space-y-4">
            <Skeleton repeat={4} isCustomSize className="h-12" />
        </div>
    );

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
                            ? `Open ${book?.category} List of Content Menu`
                            : `Close ${book?.category} List of Content Menu`,
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
                className="fixed inset-x-0 z-[11] flex items-center gap-4 px-4 py-3 shadow top-14 bg-neutral-900 lg:hidden">
                <div
                    className={cn(
                        'relative flex-none border rounded-md border-neutral-700 w-8 aspect-[256/364] bg-neutral-600',
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
                        <p className="text-xs text-neutral-400">
                            {book?.title}
                        </p>
                    ) : (
                        <Skeleton isCustomSize className="w-32 h-4" />
                    )}
                    <p className="text-sm font-bold">Daftar Isi</p>
                </div>
                <BiChevronRight size={24} />
            </label>
            <div className="z-20 pt-0 lg:pt-11 lg:!overflow-y-auto drawer-side lg:z-[11] lg:[scrollbar-gutter:stable]">
                <label
                    htmlFor="toc-drawer"
                    className="drawer-overlay lg:hidden"></label>
                <div className="min-h-full bg-[#121212] w-screen md:w-96 lg:w-80 xl:w-96">
                    <div className="sticky inset-x-0 top-0 z-10">
                        <label
                            htmlFor="toc-drawer"
                            className="block w-full px-4 py-3 bg-[#222] lg:hidden">
                            <BiChevronLeft size={24} />
                        </label>
                        <label
                            htmlFor="toc-drawer"
                            className="px-4 py-3 bg-[#1d1d1d] grid grid-cols-2">
                            <Link
                                href={`${getBookBaseHref(
                                    book?.category ?? ''
                                )}/${slug}`}
                                className="flex items-center gap-4">
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
                                        <div className="space-y-1 grow">
                                            {problem?.title ? (
                                                <p className="text-xs text-neutral-400">
                                                    {book?.title}
                                                </p>
                                            ) : (
                                                <Skeleton
                                                    isCustomSize
                                                    className="w-32 h-4"
                                                />
                                            )}
                                            <p className="text-sm font-bold">
                                                Daftar Isi
                                            </p>
                                        </div>
                                    ) : (
                                        <Skeleton
                                            isCustomSize
                                            repeat={3}
                                            className="w-3/5 h-3 first:w-3/4 last:w-1/2"
                                        />
                                    )}
                                </div>
                            </Link>
                        </label>
                    </div>
                    {((!isDesktopBreakpoints && isDrawerOpen) ||
                        isDesktopBreakpoints) &&
                    book?.chapters ? (
                        <Delayed delay={300} loader={<Loader />}>
                            <TableOfContents
                                className="p-4"
                                category={book.category}
                                chapters={book.chapters}
                                activeSubchapter={problem?.section_id}
                                activeChapter={problem?.chapter_id}
                            />
                        </Delayed>
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
        </>
    );
};

const Delayed = ({
    children,
    loader = <></>,
    delay = 500
}: PropsWithChildren & {
    loader?: JSX.Element;
    delay: number;
}): JSX.Element => {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShown(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return isShown ? <>{children}</> : loader;
};

export default Delayed;
