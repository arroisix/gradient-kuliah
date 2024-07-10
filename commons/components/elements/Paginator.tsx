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
            {Array.from({
                length: Math.min(totalPages, 5)
            })
                .map((_, i) => i + 1)
                .map((pageNav) => (
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
            {totalPages > 6 && <p>...</p>}
            {totalPages > 5 && (
                <PageButton
                    href={getHref(totalPages)}
                    type="button"
                    scroll={false}
                    onClick={() => setPage?.(totalPages - 1)}
                    className={cn(
                        'btn btn-sm btn-circle ',
                        totalPages === page + 1
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
