import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sort from 'commons/components/elements/Sort';
import Filter from 'commons/components/elements/Filter';
import LatihanContent from '../../../components/Latihan/Entrypoint/EntrypointContent';
import LatihanTabs from '../../../components/Latihan/Entrypoint/EntrypointTabs';
import { LATIHAN_SORT_OPTIONS } from '../../../components/Latihan/constants';
import { useGetExerciseLandingPageQuery } from '../../../redux/api/exercisesApi';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import MyExercisesSection from '../../../components/Latihan/Entrypoint/MyExercisesSection';

const LatihanEntrypoint = (): JSX.Element => {
    const router = useRouter();
    const {
        status = 'all',
        course_id = 'all',
        sort = 'latest',
        page: pageQuery = '1'
    } = router.query;
    const [page, setPage] = useState(Number(pageQuery));

    useEffect(() => {
        setPage(Number(pageQuery));
    }, [pageQuery]);

    const { data, isLoading, isFetching } = useGetExerciseLandingPageQuery({
        page,
        limit: 6,
        status: status as string,
        course_id: course_id as string,
        sort: sort as string
    });

    const handlePageChange = (newPage: number) => {
        router.push({ query: { ...router.query, page: newPage } }, undefined, {
            shallow: true
        });
    };

    const handleStatusChange = (newStatus: string) => {
        router.push(
            { query: { ...router.query, status: newStatus, page: 1 } },
            undefined,
            {
                shallow: true
            }
        );
    };

    const handleCourseChange = (newCourseId: string) => {
        router.push(
            { query: { ...router.query, course_id: newCourseId, page: 1 } },
            undefined,
            {
                shallow: true
            }
        );
    };

    const courseFilterOptions =
        data?.course_filters?.map((course) => ({
            value: course.id,
            label: course.name
        })) || [];

    return (
        <>
            <Breadcrumb className="w-full pb-5" />

            {data?.my_exercises && (
                <MyExercisesSection myExercises={data.my_exercises} />
            )}

            <h1 className="text-xl font-bold md:text-2xl text-balance">
                Latihan
            </h1>

            <LatihanTabs
                activeStatus={status as string}
                onStatusChange={handleStatusChange}
            />

            <div className="flex gap-4 items-center my-4">
                <Filter
                    options={courseFilterOptions}
                    defaultSelected={course_id as string}
                    onChange={handleCourseChange}
                />
                <Sort
                    options={LATIHAN_SORT_OPTIONS}
                    defaultSelected={sort as string}
                />
            </div>

            <LatihanContent
                isLoading={isLoading || isFetching}
                exercises={data?.exercises || []}
                myExercises={data?.my_exercises || []}
                totalItems={data?.count_items || 0}
                currentPage={data?.current_page || 1}
                limit={data?.limit || 6}
                onPageChange={handlePageChange}
            />
        </>
    );
};

export default LatihanEntrypoint;
