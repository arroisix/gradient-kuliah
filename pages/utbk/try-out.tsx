import Filter from 'commons/components/elements/Filter';
import Layout from 'commons/utbkLayout';
import withAnon from 'commons/withAnon';
import LatihanContent from 'exercises/components/Entrypoint/EntrypointContent';
import { useGetExerciseV2LandingPageQuery } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

const tryoutFilterOptions: Option[] = [
    { value: 'all', label: 'Semua' },
    { value: 'free', label: 'Gratis' },
    { value: 'member', label: 'Khusus Member' }
];

const TryOutPage = (): JSX.Element => {
    const router = useRouter();

    const {
        sort = 'latest',
        access_type = 'all',
        page: pageQuery = '1'
    } = useMemo(() => {
        return router.query;
    }, [router.query]);

    const [page, setPage] = useState(Number(pageQuery));

    useEffect(() => {
        setPage(Number(pageQuery));
    }, [pageQuery]);

    const { data, isLoading, isFetching } = useGetExerciseV2LandingPageQuery({
        page,
        limit: 6,
        sort: sort as string,
        access_type: access_type as string
    });

    const handleFilterTryout = (type: string): void => {
        router.push(
            { query: { ...router.query, access_type: type, page: 1 } },
            undefined,
            { shallow: true }
        );
    };

    return (
        <Layout>
            <div className="max-w-screen-lg mx-auto pt-32 px-4 md:px-0">
                <div className="flex justify-between items-center">
                    <h1 className="text-white text-xl font-bold md:text-2xl text-balance">
                        Try Out
                    </h1>

                    <div>
                        <Filter
                            options={tryoutFilterOptions}
                            defaultSelected={access_type as string}
                            onChange={handleFilterTryout}
                            title="Tipe Akses Tryout"
                            className="[&>button]:px-4 [&>button]:py-2 [&>button]:text-sm [&>button]:font-bold [&>button]:w-fit"
                        />
                    </div>
                </div>

                <LatihanContent
                    isLoading={isLoading || isFetching}
                    exercises={data?.data || []}
                    myExercises={[]}
                    totalItems={data?.count_items || 0}
                    currentPage={data?.current_page || 1}
                    limit={data?.limit || 6}
                />
            </div>
        </Layout>
    );
};

TryOutPage.displayName = 'Latihan';
export default withAnon(TryOutPage);
