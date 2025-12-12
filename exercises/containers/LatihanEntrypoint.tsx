import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LatihanContent from '../components/Entrypoint/EntrypointContent';
import { useGetExerciseV2LandingPageQuery } from '../redux/api/exercisesApi';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import FilterEntrypoint from 'exercises/components/Entrypoint/FilterEntrypoint';
import Button from 'commons/components/elements/Button';
import { IoMdSettings } from 'react-icons/io';
import { useWindowSize } from 'usehooks-ts';
import EntrypointTabs from '../components/Entrypoint/EntrypointTabs';

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
    const { width } = useWindowSize();

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

    const onChangeTab = (tab: string): void => {
        router.push(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    status: tab,
                    page: 1
                }
            },
            undefined,
            { shallow: true }
        );
    };

    const handleManageTargetOnClick = (): void => {
        console.log('Manage Target clicked');
    };

    return (
        <>
            <Breadcrumb className="w-full pb-5" />
            <div className="relative grid w-full grid-cols-1 mx-auto xl:max-w-screen-2xl">
                <div className="flex flex-row justify-between">
                    <h1 className="text-xl font-bold md:text-2xl text-balance">
                        Try Out
                    </h1>

                    <Button
                        size={width < 768 ? 'extraSmall' : 'small'}
                        variant="custom"
                        className="bg-graphite-700 flex flex-row gap-[6px] items-center"
                        onClick={handleManageTargetOnClick}>
                        <IoMdSettings />
                        <span className="size-sm font-semibold">
                            Atur Target
                        </span>
                    </Button>
                </div>
                <EntrypointTabs
                    activeStatus={status as string}
                    onStatusChange={onChangeTab}
                />
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
            {!is_subscribed && <RenewSubscriptionBanner product="latihan" />}
        </>
    );
};

export default LatihanEntrypoint;
