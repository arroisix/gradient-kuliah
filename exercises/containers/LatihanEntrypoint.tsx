import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LatihanContent from '../components/Entrypoint/EntrypointContent';
import { useGetExerciseV2LandingPageQuery } from '../redux/api/exercisesApi';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import FilterEntrypoint from 'exercises/components/Entrypoint/FilterEntrypoint';

const LatihanEntrypoint = (): JSX.Element => {
    const router = useRouter();
    const {
        status = '',
        course_id = '',
        university_name = '',
        sort = 'latest',
        type = '',
        page: pageQuery = '1'
    } = router.query;
    const [page, setPage] = useState(Number(pageQuery));
    const { is_subscribed } = useCourseSubscription();

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
        sort: sort as string
    });

    return (
        <>
            <Breadcrumb className="w-full pb-5" />

            <h1 className="text-xl font-bold md:text-2xl text-balance">
                Try Out
            </h1>
            <FilterEntrypoint />

            <LatihanContent
                isLoading={isLoading || isFetching}
                exercises={data?.data || []}
                myExercises={[]}
                totalItems={data?.count_items || 0}
                currentPage={data?.current_page || 1}
                limit={data?.limit || 6}
            />
            {!is_subscribed && <RenewSubscriptionBanner product="latihan" />}
        </>
    );
};

export default LatihanEntrypoint;
