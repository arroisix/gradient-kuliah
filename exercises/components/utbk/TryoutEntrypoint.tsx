import Filter from 'commons/components/elements/Filter';
import { useGetExerciseV2LandingPageQuery } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import LatihanContent from '../Entrypoint/EntrypointContent';
import SetTargetDrawerButton from '../Entrypoint/SetTargetDrawerButton';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';

const tryoutFilterOptions: Option[] = [
    { value: 'all', label: 'Semua' },
    { value: 'free', label: 'Gratis' },
    { value: 'member', label: 'Khusus Member' }
];

function TryoutEntrypoint() {
    const router = useRouter();

    const {
        sort = 'latest',
        access_type = 'all',
        page: pageQuery = '1'
    } = useMemo(() => {
        return router.query;
    }, [router.query]);

    const [page, setPage] = useState(Number(pageQuery));

    const { is_subscribed } = useCourseSubscription();
    const isAuthenticated = useSelector(getIsAuthenticated);

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
        <>
            <Breadcrumb className="w-full pb-5" />

            <div className="relative grid w-full grid-cols-1 mx-auto xl:max-w-screen-2xl">
                <div className="flex flex-row justify-between">
                    <h1 className="text-xl font-bold md:text-2xl text-balance">
                        Try Out
                    </h1>

                    <div className="flex justify-between items-center gap-2 md:gap-4">
                        <Filter
                            options={tryoutFilterOptions}
                            defaultSelected={access_type as string}
                            onChange={handleFilterTryout}
                            title="Tipe Akses Tryout"
                            className="[&>button]:px-4 [&>button]:py-2 [&>button]:text-sm [&>button]:font-bold [&>button]:w-fit"
                        />

                        {isAuthenticated ? <SetTargetDrawerButton /> : <></>}
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

            {!is_subscribed && isAuthenticated ? (
                <>
                    <div className="md:h-9" />
                    <RenewSubscriptionBanner product="latihan" type="K12" />
                    <RenewSubscriptionBanner
                        product="latihan"
                        type="K12_MOBILE"
                    />
                    <div className="h-3 md:h-0" />
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export { TryoutEntrypoint };
