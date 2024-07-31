import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Skeleton from 'commons/components/elements/Skeleton';
import { CDN_URL } from 'commons/constants';
import {
    useGetEntrypointBooksQuery,
    useGetPublicEntrypointBooksQuery
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { EntrypointSort, Tab } from '../constants';
import { getBookBaseHref } from 'courses/utils';
import Paginator from 'commons/components/elements/Paginator';
import ProductCard from 'commons/components/elements/ProductCard';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { cn } from 'commons/utils';

const PAGE_SIZE = 6;

export const EntrypointContent = ({
    isLoading,
    astronotes
}: {
    isLoading: boolean;
    astronotes?: ListResponseData<Astronote>;
}): JSX.Element => {
    const { is_subscribed: isSubscribed } = useCourseSubscription();
    if (isLoading)
        return (
            <div
                className={cn(
                    'grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 2xl:grid-cols-3 xl:gap-6',
                    !isSubscribed && 'lg:grid-cols-3'
                )}>
                <Skeleton repeat={6} className="w-full h-36 !mb-0" />
            </div>
        );

    if (!isLoading && astronotes && astronotes.data?.length == 0)
        return (
            <div className="flex flex-col items-center w-full gap-5 py-12">
                <img
                    src={`${CDN_URL}/assets/empty_similar_discussions.png`}
                    alt="Buku tidak ditemukan"
                    className="w-36"
                />
                <p className="text-sm font-bold text-center">
                    Tidak ada buku yang sesuai
                </p>
            </div>
        );

    const getLink = (
        slug: string,
        category: string,
        latestPage: string,
        latestProblem: string
    ): string => {
        const baseHref = `${getBookBaseHref(category)}/${slug}`;
        const lowerCasedCategory = category.toLowerCase();

        if (latestPage && lowerCasedCategory === 'catatan') {
            return `${baseHref}/${latestPage}`;
        }

        if (
            latestProblem &&
            (lowerCasedCategory === 'textbook' ||
                lowerCasedCategory === 'bank soal')
        ) {
            return `${baseHref}/${latestProblem}`;
        }

        return baseHref;
    };

    const getProduct = (book: Astronote): Product => ({
        title: book.title,
        thumbnail: book.book_cover_url,
        inProgress: book?.in_progress ?? false,
        latestProgress: book?.percentage_progress ?? 0,
        latestChapter: book.last_chapter_read,
        authors: book.authors,
        rating: book.rating
    });

    const totalPages = Math.ceil((astronotes?.count_items ?? 0) / PAGE_SIZE);

    return (
        <>
            <div
                className={cn(
                    'grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 2xl:grid-cols-3 xl:gap-6',
                    !isSubscribed && 'lg:grid-cols-3'
                )}>
                {!!astronotes && (
                    <>
                        {astronotes?.data?.map((book) => (
                            <ProductCard
                                key={book.id}
                                orientation="horizontal"
                                heading="h2"
                                category={book.category_name}
                                product={getProduct(book)}
                                href={getLink(
                                    book.slug,
                                    book.category_name ?? '',
                                    book.latest_page ?? '',
                                    book.latest_problem ?? ''
                                )}
                                eventName="Click Book Item on Library Page"
                                eventPayload={{ 'Book Slug': book.slug }}
                                imageClassname="min-w-20 min-h-24"
                            />
                        ))}
                    </>
                )}
            </div>
            {astronotes && astronotes?.count_items > PAGE_SIZE && (
                <Paginator
                    totalPages={totalPages}
                    hasNextPage={!!astronotes?.next_page}
                    hasPreviousPage={!!astronotes?.previous_page}
                    className="justify-center w-full pb-8"
                />
            )}
        </>
    );
};

export const EntrypointPrivate = ({
    category,
    search
}: {
    category: Tab;
    search: string;
}): JSX.Element => {
    const router = useRouter();
    const { sort, page: pageParam } = router.query as {
        sort?: EntrypointSort;
        page: string;
    };
    const page = parseInt(pageParam ?? '1');

    const isAuthenticated = useSelector(getIsAuthenticated);
    const skip = !Object.values(EntrypointSort).includes(
        sort ?? EntrypointSort.release
    );

    const {
        data: astronotes,
        isLoading,
        isFetching
    } = useGetEntrypointBooksQuery(
        { limit: PAGE_SIZE, type: category, status: sort, page, search },
        { skip: !isAuthenticated || skip }
    );

    return (
        <EntrypointContent
            isLoading={!isLoading && isFetching} // only show skeleton on page change
            astronotes={astronotes}
        />
    );
};

export const EntrypointPublic = ({
    category,
    books,
    search
}: {
    category: Tab;
    books: ListResponseData<Astronote>;
    search: string;
}): JSX.Element => {
    const router = useRouter();
    const { sort, page: pageParam } = router.query as {
        sort?: EntrypointSort;
        page: string;
    };
    const page = parseInt(pageParam ?? '1');

    const isAuthenticated = useSelector(getIsAuthenticated);
    const skip = !Object.values(EntrypointSort).includes(
        sort ?? EntrypointSort.release
    );

    const {
        data: astronotes,
        isLoading,
        isFetching
    } = useGetPublicEntrypointBooksQuery(
        { limit: PAGE_SIZE, type: category, status: sort, page, search },
        { skip: isAuthenticated || skip }
    );

    return (
        <EntrypointContent
            isLoading={!isLoading && isFetching} // only show skeleton on page change
            astronotes={astronotes ?? books}
        />
    );
};
