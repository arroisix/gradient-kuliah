// ...existing code...
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';

import ProductCard from 'commons/components/elements/ProductCard';
import { cn } from 'commons/utils';

import usePublicCourseInfiniteScroll from 'courses/hooks/usePublicCourseInfiniteScroll';
import { CourseList } from './CourseList';
import Skeleton from 'commons/components/elements/Skeleton';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import CarouselSection from 'dashboard/components/CarouselSection';

const PAGE_SIZE = 6;

const Header: React.FC<{ title: string; subtitle?: string }> = ({
    title,
    subtitle
}) => (
    <div className="mb-4">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
);

const ForYouSections = ({ search }: { search?: string }): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed: isSubscribed } = useCourseSubscription();

    // Kelas Terbaru - fetch directly depending on auth state
    const {
        data: kelasTerbaruPrivateData,
        isLoading: kelasTerbaruPrivateLoading
    } = useGetPrivateListCoursesV2Query(
        {
            section: 'for-you-new-release',
            sort: 'latest',
            page: 1,
            limit: PAGE_SIZE * 2
        } as any,
        {
            skip: !isAuthenticated
        }
    );

    const major = kelasTerbaruPrivateData?.major ?? '';

    const {
        data: kelasTerbaruPublicData,
        isLoading: kelasTerbaruPublicLoading
    } = useGetPublicListCoursesV2Query(
        {
            section: 'for-you-new-release',
            sort: 'latest',
            page: 1,
            limit: PAGE_SIZE * 2
        } as any,
        {
            skip: isAuthenticated
        }
    );

    // Pilihan untuk Mahasiswa (private query)
    const { data: pilihanData, isLoading: pilihanLoading } =
        useGetPrivateListCoursesV2Query(
            {
                section: 'for-you',
                sort: 'latest',
                page: 1,
                limit: PAGE_SIZE,
                search: search
            } as any,
            {
                skip: !isAuthenticated
            }
        );

    const eksplor = usePublicCourseInfiniteScroll({
        section: 'all',
        sort: 'latest',
        limit: PAGE_SIZE,
        search
    });
    const eksplorData = eksplor.allData;
    const eksplorLoading = eksplor.isAllLoading || eksplor.isLoading;

    const getProduct = (course: Course): Product => ({
        title: course.course_name,
        thumbnail: course.thumbnail,
        inProgress: false,
        latestProgress: 0,
        isComingSoon: course?.is_coming_soon,
        isNew: course?.is_new,
        isFree: course?.is_free
    });

    const getHref = (course: Course): string => {
        if (course.is_coming_soon && !course.slug) return '';
        if (course.is_only_notebook) return `/kelas/${course.slug}/astronotes`;
        return `/kelas/${course.slug}`;
    };

    const renderKelasTerbaruItem = (course: Course) => (
        <ProductCard
            key={course.id}
            heading="h3"
            orientation="vertical"
            category="kelas"
            eventName="Click Class Card"
            href={getHref(course)}
            product={getProduct(course)}
        />
    );

    return (
        <div className="px-4 md:px-6 lg:px-8 mt-6">
            {/* Kelas Terbaru section - header differs when authenticated */}
            <div className="mb-6">
                <CarouselSection
                    title={
                        isAuthenticated
                            ? 'Kelas Terbaru yang Cocok Untukmu'
                            : 'Kelas Terbaru'
                    }
                    items={
                        isAuthenticated
                            ? kelasTerbaruPrivateData?.data ?? []
                            : kelasTerbaruPublicData?.data ?? []
                    }
                    isLoading={
                        isAuthenticated
                            ? kelasTerbaruPrivateLoading
                            : kelasTerbaruPublicLoading
                    }
                    itemsPerPage={4}
                    renderItem={(item) =>
                        renderKelasTerbaruItem(item as Course)
                    }
                    eventCategory="KelasTerbaru"
                />
            </div>

            {/* For authenticated users show Pilihan untuk Mahasiswa {major} */}
            {isAuthenticated && (
                <div className="mt-8">
                    <Header title={`Pilihan untuk Mahasiswa ${major}`} />
                    <CourseList
                        courses={pilihanData}
                        isLoading={pilihanLoading}
                        section="for-you"
                    />
                </div>
            )}

            {/* Eksplor Kelas Lain di Gradient */}
            <div className="mt-8">
                <Header title="Eksplor Kelas Lain di Gradient" />
                <div
                    className={cn(
                        'grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6'
                    )}>
                    {eksplorLoading && (
                        <div
                            className={cn(
                                'grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6',
                                !isSubscribed && 'lg:grid-cols-3'
                            )}>
                            <Skeleton
                                repeat={3}
                                className="w-full h-56 !mb-0"
                            />
                        </div>
                    )}
                    {!eksplorLoading && eksplorData?.data?.length === 0 && (
                        <p className="text-gray-400">
                            Tidak ada kelas untuk ditampilkan.
                        </p>
                    )}
                    {!eksplorLoading &&
                        eksplorData?.data?.map((c: Course) => (
                            <ProductCard
                                key={c.id}
                                heading="h3"
                                orientation="vertical"
                                category="kelas"
                                eventName="Click Class Card"
                                href={getHref(c)}
                                product={getProduct(c)}
                            />
                        ))}
                </div>
                <div ref={eksplor.anchor} />
            </div>
        </div>
    );
};

export default ForYouSections;
