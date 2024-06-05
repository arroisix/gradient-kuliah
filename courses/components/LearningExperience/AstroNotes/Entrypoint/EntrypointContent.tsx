import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Skeleton from 'commons/components/elements/Skeleton';
import { CDN_URL } from 'commons/constants';
import {
    useGetEntrypointBooksQuery,
    useGetPublicEntrypointBooksQuery
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AstronoteBookCard } from '../AstronoteBook';
import { Sort, Tab } from '../constants';

export const EntrypointContent = ({
    isLoading,
    astronotes
}: {
    isLoading: boolean;
    astronotes?: Astronote[];
}): JSX.Element => {
    if (isLoading)
        return (
            <div className="grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6">
                <Skeleton repeat={5} className="w-full h-36 !mb-0" />
            </div>
        );

    if (!isLoading && astronotes?.length == 0)
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
        latestPage: string
    ): string => {
        const baseHref = category.toLowerCase() === 'textbook'
                            ? `/perpustakaan/textbook/${slug}`
                            : category.toLowerCase() === 'catatan'
                            ? `/perpustakaan/astronotes/${slug}`
                            : `/perpustakaan/bank-soal/${slug}`

        if (latestPage) {
            return `${baseHref}/${latestPage}`
        }
        return baseHref
    };

    return (
        <div className="grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6">
            {!!astronotes && !isLoading && (
                <>
                    {astronotes?.map((book) => (
                        <AstronoteBookCard
                            key={book.id}
                            href={getLink(
                                book.slug,
                                book.category_name ?? '',
                                book.latest_page ?? ''
                            )}
                            eventName="Click Book Item on Library Page"
                            eventPayload={{ 'Book Slug': book.slug }}
                            imageClassname="min-w-20 min-h-24"
                            {...book}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export const EntrypointPrivate = ({ type }: { type: Tab }): JSX.Element => {
    const router = useRouter();
    const { sort } = router.query as { sort?: Sort; tab?: Tab };

    const isAuthenticated = useSelector(getIsAuthenticated);
    const skip = !(
        Object.values(Sort).includes(sort ?? Sort.release) &&
        Object.values(Tab).includes(type ?? Tab.all)
    );

    const {
        data: astronotes,
        isLoading,
        isFetching
    } = useGetEntrypointBooksQuery(
        { limit: 100, type: type, status: sort },
        { skip: !isAuthenticated || skip }
    );

    return (
        <EntrypointContent
            isLoading={isLoading || isFetching}
            astronotes={astronotes?.books}
        />
    );
};

export const EntrypointPublic = ({ type }: { type: Tab }): JSX.Element => {
    const router = useRouter();
    const { sort } = router.query as { sort?: Sort; tab?: Tab };

    const isAuthenticated = useSelector(getIsAuthenticated);
    const skip = !(
        Object.values(Sort).includes(sort ?? Sort.release) &&
        Object.values(Tab).includes(type ?? Tab.all)
    );

    const {
        data: astronotes,
        isLoading,
        isFetching
    } = useGetPublicEntrypointBooksQuery(
        { limit: 100, type: type, status: sort },
        { skip: isAuthenticated || skip }
    );

    return (
        <EntrypointContent
            isLoading={isLoading || isFetching}
            astronotes={astronotes?.books}
        />
    );
};
