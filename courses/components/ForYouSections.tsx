// ...existing code...
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import {
    useGetPublicListCoursesV2Query
} from 'courses/redux/api/publicCourseV2Api';
import { PublicCourseList } from './CourseList';
import { PrivateCourseList } from './CourseList';
import { useProfileContext } from 'profile/contexts/ProfileProvider';

import ProductCard from 'commons/components/elements/ProductCard';
import { cn } from 'commons/utils';

const PAGE_SIZE = 6;

// minimal empty courses object for PublicCourseList SSR prop
const EMPTY_LIST = {
    count_items: 0,
    previous_page: null,
    next_page: null,
    data: []
} as any;

const Header: React.FC<{ title: string; subtitle?: string }> = ({
    title,
    subtitle
}) => (
    <div className="mb-4">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
);

const ForYouSections = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();
    const { profile } = useProfileContext();
    const { search } = router.query as {
        search?: string;
    };
    const major = profile?.major || 'Jurusanmu';

    // Pilihan untuk Mahasiswa (private query)
    const { data: pilihanData, isLoading: pilihanLoading } =
        useGetPrivateListCoursesV2Query(
            {
                section: 'all',
                sort: 'latest',
                page: 1,
                limit: PAGE_SIZE,
                major: major
            } as any,
            {
                skip: !isAuthenticated
            }
        );

    const { data: eksplorData, isLoading: eksplorLoading } =
        useGetPublicListCoursesV2Query({
            section: 'all',
            sort: 'latest',
            page: 1,
            limit: PAGE_SIZE
        } as any);

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

    return (
        <div className="px-4 md:px-6 lg:px-8 mt-6">
            {/* Kelas Terbaru section - header differs when authenticated */}
            <div className="mb-6">
                <Header
                    title={
                        isAuthenticated
                            ? 'Kelas Terbaru yang Cocok Untukmu'
                            : 'Kelas Terbaru'
                    }
                />
                {/* Use existing wrappers - pass empty SSR data for public */}
                {isAuthenticated ? (
                    <PrivateCourseList search={search} />
                ) : (
                    <PublicCourseList courses={EMPTY_LIST} search={search} />
                )}
            </div>

            {/* For authenticated users show Pilihan untuk Mahasiswa {major} */}
            {isAuthenticated && (
                <div className="mt-8">
                    <Header title={`Pilihan untuk Mahasiswa ${major}`} />
                    <div
                        className={cn(
                            'grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6'
                        )}>
                        {pilihanLoading && (
                            <p className="text-gray-400">Memuat...</p>
                        )}
                        {!pilihanLoading && pilihanData?.data?.length === 0 && (
                            <p className="text-gray-400">
                                Tidak ada rekomendasi untuk jurusan ini.
                            </p>
                        )}
                        {!pilihanLoading &&
                            pilihanData?.data?.map((c: Course) => (
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
                        <p className="text-gray-400">Memuat...</p>
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
            </div>
        </div>
    );
};

export default ForYouSections;
