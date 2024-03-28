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
            <div className="grid grid-cols-1 gap-4 pt-3 pb-24 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6">
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

    return (
        <div className="grid grid-cols-1 gap-4 pt-3 pb-24 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6">
            {!!astronotes && !isLoading && (
                <>
                    {astronotes?.map((book) => (
                        <AstronoteBookCard key={book.id} {...book} />
                    ))}
                </>
            )}
        </div>
    );
};

export const EntrypointPrivate = (): JSX.Element => {
    const router = useRouter();
    const { sort, tab } = router.query as { sort?: Sort; tab?: Tab };

    const isAuthenticated = useSelector(getIsAuthenticated);
    const skip = !(
        Object.values(Sort).includes(sort ?? Sort.release) &&
        Object.values(Tab).includes(tab ?? Tab.all)
    );

    const {
        data: astronotes,
        isLoading,
        isFetching
    } = useGetEntrypointBooksQuery(
        { limit: 100, type: tab, status: sort },
        { skip: !isAuthenticated || skip }
    );

    return (
        <EntrypointContent
            isLoading={isLoading || isFetching}
            astronotes={astronotes?.books}
        />
    );
};

export const EntrypointPublic = (): JSX.Element => {
    const router = useRouter();
    const { sort, tab } = router.query as { sort?: Sort; tab?: Tab };

    const isAuthenticated = useSelector(getIsAuthenticated);
    const skip = !(
        Object.values(Sort).includes(sort ?? Sort.release) &&
        Object.values(Tab).includes(tab ?? Tab.all)
    );

    const {
        data: astronotes,
        isLoading,
        isFetching
    } = useGetPublicEntrypointBooksQuery(
        { limit: 100, type: tab, status: sort },
        { skip: isAuthenticated || skip }
    );

    return (
        <EntrypointContent
            isLoading={isLoading || isFetching}
            astronotes={astronotes?.books}
        />
    );
};
