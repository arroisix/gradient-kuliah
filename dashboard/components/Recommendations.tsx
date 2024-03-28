import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import AstronoteBook from 'courses/components/LearningExperience/AstroNotes/AstronoteBook';
import { useGetPublicEntrypointBooksQuery } from 'courses/redux/api/astronotesApi';
import { useGetPublicListCoursesQuery } from 'courses/redux/api/publicCourseApi';
import ClassCard from 'landing/components/RevampedSections/ClassCard';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

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
    const { data: questionBankBookData, isLoading: isLoadingQuestionBankBook } =
        useGetPublicEntrypointBooksQuery({
            major: recommendation as string,
            limit: isMobileBreakpoints ? 2 : 5,
            type: 'bank-soal',
        });
    const { data: notebookData, isLoading: isLoadingNotebook } =
        useGetPublicEntrypointBooksQuery({
            major: recommendation as string,
            limit: isMobileBreakpoints ? 2 : 5,
            type: 'astronotes',
        });

    const renderBooks = (
        categoryName: 'Bank Soal' | 'Textbook' | 'Catatan'
    ): JSX.Element => {
        const bookData = (categoryName === 'Bank Soal')? questionBankBookData?.books : notebookData?.books;
        const bookList = bookData?.filter(
            (category) => category.category_name === categoryName
        );
        const eventName = `Click ${
            categoryName === 'Textbook' ? 'Rangkuman' : categoryName
        } Card`;
        return (
            <>
                {bookList?.map((book) => (
                    <AstronoteBook
                        key={book.id}
                        eventName={eventName}
                        {...book}
                    />
                ))}
            </>
        );
    };

    useEffect(() => {
        if (!isLoadingQuestionBankBook && isLoadingNotebook && !isLoadingCourse) {
            onFinishLoading?.();
        }
    }, [isLoadingCourse, isLoadingQuestionBankBook, isLoadingNotebook, onFinishLoading]);

    return (
        <>
            <div className="space-y-4" data-tour="step-1">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Rekomendasi Video
                    </h4>
                    <Button
                        href="/kelas"
                        variant="custom"
                        eventName="Click 'Lihat Semua' in Video Section"
                        className="text-xs text-black bg-white whitespace-nowrap">
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
                                    eventPayload={{
                                        Variant: 'NOV 2023',
                                        'Accessed from': 'DASHBOARD'
                                    }}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className="space-y-4" data-tour="step-2">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Rekomendasi Latihan Soal
                    </h4>
                    <Button
                        href="/astronotes#bank-soal"
                        variant="custom"
                        eventName="Click 'Lihat Semua' in Bank Soal Section"
                        className="text-xs text-black bg-white whitespace-nowrap">
                        Lihat Semua
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 xl:gap-6">
                    {isLoadingQuestionBankBook ? (
                        <Skeleton repeat={isMobileBreakpoints ? 2 : 5} />
                    ) : (
                        renderBooks('Bank Soal')
                    )}
                </div>
            </div>
            <div className="space-y-4" data-tour="step-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Rekomendasi Rangkuman
                    </h4>
                    <Button
                        href="/astronotes"
                        variant="custom"
                        eventName="Click 'Lihat Semua' in Rangkuman Section"
                        className="text-xs text-black bg-white whitespace-nowrap">
                        Lihat Semua
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 xl:gap-6">
                    {isLoadingNotebook ? (
                        <Skeleton repeat={isMobileBreakpoints ? 2 : 5} />
                    ) : (
                        renderBooks('Catatan')
                    )}
                </div>
            </div>
        </>
    );
};

export default Recommendations;
