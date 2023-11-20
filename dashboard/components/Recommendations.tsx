import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import AstronoteBook from 'courses/components/LearningExperience/AstroNotes/AstronoteBook';
import { useGetPublicEntrypointBooksQuery } from 'courses/redux/api/astronotesApi';
import { useGetPublicListCoursesQuery } from 'courses/redux/api/publicCourseApi';
import ClassCard from 'landing/components/RevampedSections/ClassCard';
import { useRouter } from 'next/router';
import React from 'react';

const Recommendations = (): JSX.Element => {
    const router = useRouter();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const { recommendation } = router.query;

    const { data: courseData, isLoading: isLoadingCourse } =
        useGetPublicListCoursesQuery({
            major: recommendation as string,
            limit: isMobileBreakpoints ? 2 : 4
        });
    const { data: bookData, isLoading: isLoadingBook } =
        useGetPublicEntrypointBooksQuery({
            major: recommendation as string,
            limit: isMobileBreakpoints ? 2 : 5
        });

    const renderBooks = (
        categoryName: 'Bank Soal' | 'Textbook'
    ): JSX.Element => {
        const bookList = bookData?.find(
            (category) => category.category_name === categoryName
        );
        return (
            <>
                {bookList?.books.map((book) => (
                    <AstronoteBook key={book.id} {...book} />
                ))}
            </>
        );
    };

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Rekomendasi Video
                    </h4>
                    <Button
                        href="/kelas"
                        variant="custom"
                        size={isMobileBreakpoints ? 'small' : 'normal'}
                        className="text-black bg-white whitespace-nowrap">
                        Lihat Semua
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:gap-6">
                    {isLoadingCourse ? (
                        <Skeleton repeat={isMobileBreakpoints ? 2 : 4} />
                    ) : (
                        <>
                            {courseData?.data.map((course) => (
                                <ClassCard
                                    key={course.id}
                                    cover={course.thumbnail}
                                    slug={course.slug}
                                    title={course.course_name}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Rekomendasi Latihan Soal
                    </h4>
                    <Button
                        href="/astronotes#bank-soal"
                        variant="custom"
                        size={isMobileBreakpoints ? 'small' : 'normal'}
                        className="text-black bg-white whitespace-nowrap">
                        Lihat Semua
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 xl:gap-6">
                    {isLoadingBook ? (
                        <Skeleton repeat={isMobileBreakpoints ? 2 : 5} />
                    ) : (
                        renderBooks('Bank Soal')
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Rekomendasi Rangkuman
                    </h4>
                    <Button
                        href="/astronotes"
                        variant="custom"
                        size={isMobileBreakpoints ? 'small' : 'normal'}
                        className="text-black bg-white whitespace-nowrap">
                        Lihat Semua
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 xl:gap-6">
                    {isLoadingBook ? (
                        <Skeleton repeat={isMobileBreakpoints ? 2 : 5} />
                    ) : (
                        renderBooks('Textbook')
                    )}
                </div>
            </div>
        </>
    );
};

export default Recommendations;
