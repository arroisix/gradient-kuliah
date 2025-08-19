// ...existing code...
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';

import ProductCard from 'commons/components/elements/ProductCard';
import { cn } from 'commons/utils';

import usePublicCourseInfiniteScroll from 'courses/hooks/usePublicCourseInfiniteScroll';

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

const ForYouSections = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();
    const { search } = router.query as {
        search?: string;
    };

    // Kelas Terbaru - fetch directly depending on auth state
    const {
        data: kelasTerbaruPrivateData,
        isLoading: kelasTerbaruPrivateLoading
    } = useGetPrivateListCoursesV2Query(
        {
            section: 'for-you-new-release',
            sort: 'latest',
            page: 1,
            limit: PAGE_SIZE
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
            limit: PAGE_SIZE,
            search
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
                limit: PAGE_SIZE
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
                <div
                    className={cn(
                        'grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6'
                    )}>
                    {(isAuthenticated
                        ? kelasTerbaruPrivateLoading
                        : kelasTerbaruPublicLoading) && (
                        <p className="text-gray-400">Memuat...</p>
                    )}

                    {!(isAuthenticated
                        ? kelasTerbaruPrivateLoading
                        : kelasTerbaruPublicLoading) &&
                        (isAuthenticated
                            ? kelasTerbaruPrivateData
                            : kelasTerbaruPublicData
                        )?.data?.length === 0 && (
                            <p className="text-gray-400">
                                Tidak ada kelas terbaru.
                            </p>
                        )}

                    {!(isAuthenticated
                        ? kelasTerbaruPrivateLoading
                        : kelasTerbaruPublicLoading) &&
                        (isAuthenticated
                            ? kelasTerbaruPrivateData
                            : kelasTerbaruPublicData
                        )?.data?.map((c: Course) => (
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
                <div ref={eksplor.anchor} />
            </div>
        </div>
    );
};

export default ForYouSections;
