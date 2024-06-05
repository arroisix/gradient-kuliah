import Skeleton from 'commons/components/elements/Skeleton';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { pageSliderClassNames } from '../constants';
import { useDebounce } from 'commons/hooks/useDebounce';
import { useTracker } from 'tracker/tracker';
import Link from 'next/link';
import { useGetBookDetailQuery } from 'courses/redux/api/astronotesApi';

interface PaginatorProps extends PropsWithClassName {
    currentPage: number;
    totalPage: number;
    isLoading: boolean;
}

const Paginator = ({
    totalPage,
    isLoading,
    className
}: PaginatorProps): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { slug, page } = router.query as { slug: string; page: string };
    const MAX_VALUE = totalPage;
    const [pageNumber, setPageNumber] = useState<number>(Number(page));
    const destinationPage = useDebounce(pageNumber, 500);
    const { data: getBookDetail } = useGetBookDetailQuery(
        { slug },
        { skip: !slug }
    );
    const category_name = getBookDetail?.book.category.toLowerCase();

    const getBaseHref = () => {
        if (category_name === 'textbook') {
            return `/perpustakaan/textbook/${slug}`;
        } else if (category_name === 'catatan') {
            return `/perpustakaan/astronotes/${slug}`;
        } else {
            return `/perpustakaan/bank-soal/${slug}`;
        }
    };

    useEffect(() => {
        setPageNumber(Number(page));
    }, [page]);

    useEffect(() => {
        if (destinationPage !== Number(page)) {
            router.push(`${getBaseHref()}/${destinationPage}`);
        }
    }, [destinationPage]);

    return (
        <div className={cn('flex items-center gap-6', className)}>
            <div className="relative w-full h-1 text-accent-purple">
                <div
                    className="absolute inset-0 z-10 h-full bg-current rounded-l-full pointer-events-none"
                    style={{
                        width: `${((pageNumber - 1) / (MAX_VALUE - 1)) * 100}%`
                    }}></div>
                <input
                    id="astronotes-paginator"
                    type="range"
                    step={1}
                    min={1}
                    max={MAX_VALUE}
                    className={pageSliderClassNames}
                    onChange={(e) => {
                        tracker?.genericTrack('Slide Book Pagination', {
                            'Book Slug': slug,
                            'Book Page Query': page,
                            'Target Page': e.target.valueAsNumber
                        });
                        setPageNumber(e.target.valueAsNumber);
                    }}
                    value={pageNumber}
                />
            </div>
            <div className="flex items-center gap-[10px]">
                <Link
                    href={
                        pageNumber > 1
                            ? `${getBaseHref()}/${pageNumber - 1}`
                            : '#'
                    }
                    onClick={() => {
                        if (pageNumber > 1) {
                            tracker?.genericTrack('Click Book Pagination', {
                                'Book Slug': slug,
                                'Book Page Query': page,
                                'Current Page': pageNumber,
                                'Target Page': pageNumber - 1
                            });
                        }
                    }}>
                    <FaChevronLeft
                        size={24}
                        className={cn(
                            'text-[#666666] transition-all',
                            pageNumber > 1
                                ? 'hover:text-black dark:hover:text-white cursor-pointer'
                                : 'opacity-50'
                        )}
                    />
                </Link>
                <span className="inline-block text-sm select-none font-body">
                    {isLoading ? (
                        <Skeleton className="h-5 w-6 p-0 !m-0" />
                    ) : (
                        `${page}/${MAX_VALUE}`
                    )}
                </span>
                <Link
                    href={
                        pageNumber < MAX_VALUE
                            ? `${getBaseHref()}/${pageNumber - 1}`
                            : '#'
                    }
                    onClick={() => {
                        if (pageNumber < MAX_VALUE) {
                            tracker?.genericTrack('Click Book Pagination', {
                                'Book Slug': slug,
                                'Book Page Query': page,
                                'Current Page': pageNumber,
                                'Target Page': pageNumber + 1
                            });
                        }
                    }}>
                    <FaChevronRight
                        size={24}
                        className={cn(
                            'text-[#666666] transition-all',
                            pageNumber < MAX_VALUE
                                ? 'hover:text-black dark:hover:text-white cursor-pointer'
                                : 'opacity-50'
                        )}
                    />
                </Link>
            </div>
        </div>
    );
};

export default Paginator;
