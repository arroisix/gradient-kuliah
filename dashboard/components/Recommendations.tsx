import ProductCard from 'commons/components/elements/ProductCard';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useGetPublicEntrypointBooksQuery } from 'courses/redux/api/astronotesApi';
import { useGetPublicListCoursesQuery } from 'courses/redux/api/publicCourseApi';
import { getBookBaseHref } from 'courses/utils';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import DashboardSection from './DashboardSection';

const Recommendations = ({
    onFinishLoading
}: {
    onFinishLoading?: () => void;
}): JSX.Element => {
    const router = useRouter();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const { recommendation } = router.query;

    const { data: courseData, isLoading: isLoadingCourse } =
        useGetPublicListCoursesQuery({
            major: recommendation as string,
            limit: isMobileBreakpoints ? 2 : 4
        });
    const { data: bankSoal, isLoading: isLoadingQuestionBankBook } =
        useGetPublicEntrypointBooksQuery({
            major: recommendation as string,
            limit: 4,
            type: 'bank-soal'
        });
    const { data: astronotes, isLoading: isLoadingNotebook } =
        useGetPublicEntrypointBooksQuery({
            major: recommendation as string,
            limit: 4,
            type: 'astronotes'
        });

    useEffect(() => {
        if (
            !isLoadingQuestionBankBook &&
            isLoadingNotebook &&
            !isLoadingCourse
        ) {
            onFinishLoading?.();
        }
    }, [
        isLoadingCourse,
        isLoadingQuestionBankBook,
        isLoadingNotebook,
        onFinishLoading
    ]);

    const getCourseProduct = (course: Course): Product => ({
        title: course.course_name,
        thumbnail: course.thumbnail,
        inProgress: false,
        latestProgress: 0
    });

    const getBookProduct = (book: Astronote): Product => ({
        title: book.title,
        thumbnail: book.book_cover_url,
        inProgress: book?.in_progress ?? false,
        latestProgress: book?.percentage_progress ?? 0,
        latestChapter: book.last_chapter_read,
        authors: book.authors,
        rating: book.rating
    });

    const getHref = (book: Astronote): string =>
        `${getBookBaseHref(book.category_name)}/${book.slug}${
            book.in_progress ? `/${book.latest_page || 1}` : ''
        }`;

    return (
        <>
            <div className="space-y-4" data-tour="step-1">
                <DashboardSection
                    header="Rekomendasi Video"
                    isLoading={isLoadingCourse}
                    showButton
                    btnHref="/kelas"
                    items={courseData?.data}>
                    {(item) => {
                        const course = item as Course;
                        return (
                            <ProductCard
                                category="video"
                                href={`/kelas/${course.slug}`}
                                orientation="vertical"
                                product={getCourseProduct(course)}
                                className="w-full"
                                eventName="Click Class Card on Dashboard Recommendation"
                                eventPayload={{
                                    Variant: 'JUL 2024',
                                    'Accessed from': 'DASHBOARD',
                                    'Course Slug': course.slug
                                }}
                            />
                        );
                    }}
                </DashboardSection>
            </div>
            <div className="space-y-4" data-tour="step-2">
                <DashboardSection
                    header="Rekomendasi Latihan Soal"
                    isLoading={isLoadingQuestionBankBook}
                    showButton
                    btnHref="/perpustakaan/bank-soal"
                    items={bankSoal?.data}>
                    {(item, i) => (
                        <ProductCard
                            category="Bank Soal"
                            href={getHref(item as Astronote)}
                            orientation="vertical"
                            product={getBookProduct(item as Astronote)}
                            className="w-full"
                            eventName="Click Book Item on Dashboard Recommendation"
                            eventPayload={{
                                'Book Slug': bankSoal?.data[i].slug
                            }}
                        />
                    )}
                </DashboardSection>
            </div>
            <div className="space-y-4" data-tour="step-3">
                <DashboardSection
                    header="Rekomendasi Rangkuman"
                    isLoading={isLoadingNotebook}
                    showButton
                    btnHref="/perpustakaan/astronotes"
                    items={astronotes?.data}>
                    {(item, i) => (
                        <ProductCard
                            category="Astronotes"
                            href={getHref(item as Astronote)}
                            orientation="vertical"
                            product={getBookProduct(item as Astronote)}
                            className="w-full"
                            eventName="Click Book Item on Dashboard Recommendation"
                            eventPayload={{
                                'Book Slug': astronotes?.data[i].slug
                            }}
                        />
                    )}
                </DashboardSection>
            </div>
        </>
    );
};

export default Recommendations;
