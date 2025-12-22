import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LatihanContent from '../components/Entrypoint/EntrypointContent';
import { useGetExerciseV2LandingPageQuery } from '../redux/api/exercisesApi';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import FilterEntrypoint from 'exercises/components/Entrypoint/FilterEntrypoint';
import { useAuth } from 'authentication/contexts/AuthProvider';
import dynamic from 'next/dynamic';

const SetTargetDrawerButton = dynamic(
    () => import('exercises/components/Entrypoint/SetTargetDrawerButton')
);

const LatihanEntrypoint = (): JSX.Element => {
    const { profile } = useAuth();
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
            <div className="relative grid w-full grid-cols-1 mx-auto xl:max-w-screen-2xl">
                <div className="flex flex-row justify-between">
                    <h1 className="text-xl font-bold md:text-2xl text-balance">
                        Try Out
                    </h1>

                    {profile?.current_role === 'K12' && (
                        <div className="flex flex-row items-center gap-4">
                            <button className="bg-graphite-700 px-5 py-2 rounded-full">
                                Placeholder
                            </button>
                            <SetTargetDrawerButton />
                        </div>
                    )}
                </div>
                {profile?.current_role === 'COLLEGE_STUDENT' && (
                    <FilterEntrypoint />
                )}

                <LatihanContent
                    isLoading={isLoading || isFetching}
                    exercises={data?.data || []}
                    myExercises={[]}
                    totalItems={data?.count_items || 0}
                    currentPage={data?.current_page || 1}
                    limit={data?.limit || 6}
                />
            </div>
            {!is_subscribed && <RenewSubscriptionBanner product="latihan" />}
        </>
    );
};

export default LatihanEntrypoint;
