import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LatihanContent from '../components/Entrypoint/EntrypointContent';
import { useGetExerciseV2LandingPageQuery } from '../redux/api/exercisesApi';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import FilterEntrypoint from 'exercises/components/Entrypoint/FilterEntrypoint';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

const LatihanEntrypoint = (): JSX.Element => {
    const { profile } = useAuth();
    const router = useRouter();
    const {
        status = '',
        course_id = '',
        university_name = '',
        sort = 'latest',
        type = '',
        access_type = profile?.current_role === 'K12' ? 'all' : '',
        page: pageQuery = '1'
    } = router.query;
    const [page, setPage] = useState(Number(pageQuery));
    const { is_subscribed } = useCourseSubscription();
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        setPage(Number(pageQuery));
    }, [pageQuery]);

    const { data, isLoading, isFetching } = useGetExerciseV2LandingPageQuery({
        page,
        limit: 6,
        type: type as string,
        status: status as string,
        course_id: course_id as string,
        university_name: university_name as string,
        sort: sort as string,
        access_type: access_type as string
    });

    return (
        <>
            <Breadcrumb className="w-full pb-5" />
            <div className="relative grid w-full grid-cols-1 mx-auto xl:max-w-screen-2xl">
                <div className="flex flex-row justify-between">
                    <h1 className="text-xl font-bold md:text-2xl text-balance">
                        Try Out
                    </h1>
                </div>

                <FilterEntrypoint />

                <LatihanContent
                    isLoading={isLoading || isFetching}
                    exercises={data?.data || []}
                    myExercises={[]}
                    totalItems={data?.count_items || 0}
                    currentPage={data?.current_page || 1}
                    limit={data?.limit || 6}
                />
            </div>
            {!is_subscribed && (
                <>
                    <RenewSubscriptionBanner product="latihan" />
                    {isAuthenticated && <div className="h-6 md:h-0" />}
                </>
            )}
        </>
    );
};

export default LatihanEntrypoint;
