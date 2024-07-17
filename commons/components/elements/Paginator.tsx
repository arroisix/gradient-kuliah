import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { UrlObject } from 'url';

type PaginatorProps = {
    /**
     * Page starts with 1
     * */
    page?: number;
    setPage?: Dispatch<SetStateAction<number>>;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
} & PropsWithClassName;

const Paginator = ({
    hasNextPage,
    hasPreviousPage,
    page: pageState,
    setPage,
    totalPages,
    className
}: PaginatorProps): JSX.Element => {
    const router = useRouter();
    const { page: pageParam } = router.query as { page: string };
    const page = parseInt(pageParam ?? 1);

    const PageButton = pageState !== undefined ? 'button' : Link;
    const getHref = (newPage: number): string | UrlObject =>
        pageState ? '?' : { query: { ...router.query, page: newPage } };

    /**
     * Determines how many page buttons to render. The first page's button is rendered separately.
     * @desc
     * - If totalPages is no more than 4, then it'll render (totalPages - 1) buttons.
     *   - e.g. if totalPages is 3, then it'll render `[firstPage, 2, 3]`
     *
     * - Always render at least 4 buttons when current page is less than 3. This applies only if totalPages >= 5
     *   - e.g. if current page is 3, it'll render `[2, 3, 4, 5, ..., lastPage]`
     *   - e.g. if current page is 8, it'll render `[firstPage, ..., 6, 7, 8, 9, 10, ..., lastPage]`
     *
     * - If there's a lot of pages, and current page is nearing the end, then always render 4 buttons.
     *   - e.g. if current page is 14 and totalPage is 16, it'll render `[firstPage, ..., 12, 13, 14, 15, lastPage]`
     */
    const pageButtons = Array.from({
        length: Math.min(
            totalPages - 1,
            page <= 3 ? 4 : 5,
            totalPages > 6 && page < totalPages - 2 ? 5 : 4
        )
    }).map(
        (_, i) =>
            i +
            (totalPages > 5 && page > 3 && page < totalPages - 2
                ? page - 2
                : totalPages > 5 && page >= totalPages - 2
                ? totalPages - 4
                : 2)
    );

    return (
        <div className={cn('flex gap-3', className)}>
            <PageButton
                href={getHref(hasPreviousPage ? page - 1 : page)}
                type="button"
                scroll={false}
                disabled={!hasPreviousPage}
                onClick={() => {
                    if (!hasPreviousPage) return;
                    setPage?.((prev) => prev - 1);
                }}
                className={cn(
                    'btn btn-sm rounded-full bg-surface-200 text-white pl-2',
                    !hasPreviousPage && 'btn-disabled'
                )}>
                <BiChevronLeft className="w-5 h-5" /> Prev
            </PageButton>
            <PageButton
                href={getHref(1)}
                type="button"
                scroll={false}
                onClick={() => setPage?.(1)}
                className={cn(
                    'btn btn-sm btn-circle ',
                    page === 1
                        ? 'btn-neutral bg-white border-white text-black'
                        : 'btn-outline text-white border-neutral-600'
                )}>
                1
            </PageButton>
            {totalPages > 6 && page > 4 && <p>...</p>}
            {pageButtons.map((pageNav) => (
                <PageButton
                    href={getHref(pageNav)}
                    key={`pagenav-${pageNav}`}
                    onClick={() => setPage?.(pageNav)}
                    scroll={false}
                    type="button"
                    className={cn(
                        'btn btn-sm btn-circle',
                        pageNav === page
                            ? 'btn-neutral bg-white border-white text-black'
                            : 'btn-outline text-white border-neutral-600'
                    )}>
                    {pageNav}
                </PageButton>
            ))}
            {totalPages > 6 && page < totalPages - 2 && <p>...</p>}
            {totalPages > 5 && (
                <PageButton
                    href={getHref(totalPages)}
                    type="button"
                    scroll={false}
                    onClick={() => setPage?.(totalPages)}
                    className={cn(
                        'btn btn-sm btn-circle ',
                        totalPages === page
                            ? 'btn-neutral bg-white border-white text-black'
                            : 'btn-outline text-white border-neutral-600'
                    )}>
                    {totalPages}
                </PageButton>
            )}
            <PageButton
                href={getHref(hasNextPage ? page + 1 : page)}
                type="button"
                scroll={false}
                onClick={() => {
                    if (!hasNextPage) return;
                    setPage?.((prev) => prev + 1);
                }}
                className={cn(
                    'btn btn-sm rounded-full text-white bg-surface-200 pr-2',
                    !hasNextPage && 'btn-disabled'
                )}>
                Next <BiChevronRight className="w-5 h-5" />
            </PageButton>
        </div>
    );
};

export default Paginator;
