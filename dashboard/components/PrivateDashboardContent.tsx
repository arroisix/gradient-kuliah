import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import {
    useGetDashboardContentQuery,
    useGetMajorClassesQuery,
    useGetMajorRecommendationQuery,
    useGetLearnRecommendationQuery
} from 'dashboard/redux/api/dashboardApi';
import MyClassesAccordion from './MyClassesSection';
import DashboardSection from './DashboardSection';
import CarouselSection from './CarouselSection';
import { getBookBaseHref } from 'courses/utils';
import ProductCard from 'commons/components/elements/ProductCard';
import ContentCard from './ContentCard';
import {
    MajorRecommendationItem,
    VideoRecommendationItem,
    BookRecommendationItem,
    QuizRecommendationItem,
    FlashcardRecommendationItem,
    LearningMaterial
} from 'dashboard/types/dashboard';

const PrivateDashboardContent = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);

    const { data: justReleased, isLoading: isLoadingJustReleased } =
        useGetDashboardContentQuery(
            { type: 'just_released' },
            { skip: !isAuthenticated }
        );
    const {
        data: myClass,
        isLoading: isLoadingMyClass,
        isFetching: isFetchingMyClass
    } = useGetDashboardContentQuery(
        { type: 'user_classes' },
        { skip: !isAuthenticated }
    );
    // const { data: bookRecommendation, isLoading: isLoadingBookRecommendation } =
    //     useGetDashboardContentQuery(
    //         { type: 'book_recommendation' },
    //         { skip: !isAuthenticated }
    //     );
    // const {
    //     data: classRecommendation,
    //     isLoading: isLoadingClassRecommendation
    // } = useGetDashboardContentQuery(
    //     { type: 'class_recommendation' },
    //     { skip: !isAuthenticated }
    // );

    const { data: majorClasses, isLoading: isLoadingMajorClasses } =
        useGetMajorClassesQuery({ limit: 12 }, { skip: !isAuthenticated });

    const {
        data: majorRecommendation,
        isLoading: isLoadingMajorRecommendation
    } = useGetMajorRecommendationQuery(
        { limit: 24 },
        { skip: !isAuthenticated }
    );

    const {
        data: learnRecommendation,
        isLoading: isLoadingLearnRecommendation
    } = useGetLearnRecommendationQuery(
        { limit: 24 },
        { skip: !isAuthenticated }
    );

    const getHref = (item: LearningMaterial): string => {
        const baseHref = `${getBookBaseHref(item.type)}/${item.book_slug}`;

        if (item.type === 'Video' || item.type === 'Kelas') {
            if (item?.chapter_id && item.subchapter_id)
                return `/kelas/${item.course_slug}/${item.subchapter_slug}`;
            return `/kelas/${item.course_slug}`;
        } else {
            if (item.in_progress && !!item.latest_page) {
                if (item.type === 'Astronotes' && !!item.latest_page) {
                    return `${baseHref}/${item.latest_page}`;
                }

                if (
                    (item.type === 'Bank Soal' || item.type === 'Textbook') &&
                    !!item.latest_problem
                ) {
                    return `${baseHref}/${item.latest_problem}`;
                }
            }
            return baseHref;
        }
    };

    const getProduct = (item: LearningMaterial): Product => ({
        title: item.title,
        thumbnail: item.thumbnail,
        inProgress: false,
        latestProgress: 0
    });

    const renderMajorClassItem = (item: any) => {
        return (
            <ContentCard
                id={item.course_slug}
                title={item.course_name}
                category="Kelas"
                thumbnail={item.thumbnail}
                href={`/kelas/${item.course_slug}`}
                isMajorClass={true}
            />
        );
    };

    const prepareItemData = (item: MajorRecommendationItem) => {
        let title,
            href,
            category,
            courseName,
            chapterName,
            cardCount,
            problemCount;

        switch (item.type) {
            case 'video':
                const videoItem = item as VideoRecommendationItem;
                title = videoItem.subchapter_name || videoItem.chapter_name;
                href = `/kelas/${videoItem.course_slug}/${videoItem.chapter_slug}`;
                category = 'Video';
                courseName = videoItem.course_name;
                chapterName = videoItem.chapter_name;
                break;

            case 'textbook':
                const textbookItem = item as BookRecommendationItem;
                title = textbookItem.book_title;
                href = `/textbook/${textbookItem.book_slug}`;
                category = 'Textbook Solution';
                courseName = textbookItem.course_name;
                break;

            case 'bank_soal':
                const bankSoalItem = item as BookRecommendationItem;
                title = bankSoalItem.book_title;
                href = `/bank-soal/${bankSoalItem.book_slug}`;
                category = 'Bank Soal';
                courseName = bankSoalItem.course_name;
                break;

            case 'astronotes':
                const notesItem = item as BookRecommendationItem;
                title = notesItem.book_title;
                href = `/astronotes/${notesItem.book_slug}`;
                category = 'Astronotes';
                courseName = notesItem.course_name;
                break;

            case 'quiz':
                const quizItem = item as QuizRecommendationItem;
                title = quizItem.exercise_title;
                href = `/latihan/${quizItem.exercise_slug}`;
                category = 'Kuis';
                courseName = quizItem.course_name;
                problemCount = quizItem.problem_count;
                break;

            case 'flashcard':
                const flashcardItem = item as FlashcardRecommendationItem;
                title = flashcardItem.title;
                href = `/flashcard/${flashcardItem.slug}`;
                category = 'Flashcard';
                courseName = flashcardItem.course_name;
                cardCount = flashcardItem.total_questions;
                break;

            default:
                title = 'Unknown content';
                href = '#';
                category = 'Other';
        }

        return {
            id: item.id,
            title,
            category,
            thumbnail: item.thumbnail,
            href,
            courseName,
            chapterName,
            cardCount,
            problemCount
        };
    };

    const renderTrendingItem = (item: MajorRecommendationItem) => {
        const itemData = prepareItemData(item);
        return <ContentCard {...itemData} isTrending={true} />;
    };

    return (
        <>
            {justReleased?.just_released.length !== 0 && (
                <DashboardSection
                    isLoading={isLoadingJustReleased}
                    header="Baru Rilis"
                    items={justReleased?.just_released}>
                    {(item, i) => (
                        <ProductCard
                            key={justReleased?.just_released[i].id}
                            orientation="vertical"
                            category={(item as LearningMaterial).type}
                            href={getHref(item as LearningMaterial)}
                            product={getProduct(item as LearningMaterial)}
                            eventName='User click Items on "Baru Rilis" Section'
                            className="w-full"
                        />
                    )}
                </DashboardSection>
            )}

            <CarouselSection
                title={`Kelas yang Diambil Mahasiswa ${majorClasses?.major}`}
                items={majorClasses?.data}
                isLoading={isLoadingMajorClasses}
                renderItem={renderMajorClassItem}
                eventCategory="MajorClasses"
            />

            <CarouselSection
                title={`Trending untuk Mahasiswa ${majorRecommendation?.major}`}
                items={majorRecommendation?.data}
                isLoading={isLoadingMajorRecommendation}
                renderItem={renderTrendingItem}
                eventCategory="TrendingRecommendation"
            />

            <MyClassesAccordion
                isLoading={isLoadingMyClass || isFetchingMyClass}
                courses={myClass?.my_class}
            />

            {learnRecommendation?.data?.map((courseRec, index) => (
                <CarouselSection
                    key={`learn-rec-${index}-${courseRec.course_name}`}
                    title={`Karena Kamu Belajar ${courseRec.course_name}`}
                    items={courseRec.recommendations}
                    isLoading={isLoadingLearnRecommendation}
                    renderItem={(item) => {
                        const itemData = prepareItemData(
                            item as MajorRecommendationItem
                        );
                        return <ContentCard {...itemData} />;
                    }}
                    eventCategory={`LearnRecommendation-${courseRec.course_name}`}
                />
            ))}

            {/*<DashboardSection*/}
            {/*    isLoading={isLoadingBookRecommendation}*/}
            {/*    header="Bacaan Untukmu"*/}
            {/*    items={bookRecommendation?.book_recommendation}*/}
            {/*    showButton*/}
            {/*    btnHref="/perpustakaan">*/}
            {/*    {(item) => (*/}
            {/*        <ProductCard*/}
            {/*            key={(item as LearningMaterial).id}*/}
            {/*            orientation="vertical"*/}
            {/*            category={(item as LearningMaterial)?.type}*/}
            {/*            href={getHref(item as LearningMaterial)}*/}
            {/*            product={getProduct(item as LearningMaterial)}*/}
            {/*            eventName='User click Book Items on "Bacaan Untukmu" Section'*/}
            {/*            className="w-full"*/}
            {/*        />*/}
            {/*    )}*/}
            {/*</DashboardSection>*/}

            {/*<DashboardSection*/}
            {/*    isCourse*/}
            {/*    isLoading={isLoadingClassRecommendation}*/}
            {/*    header="Kelas Untukmu"*/}
            {/*    items={classRecommendation?.class_recommendation}*/}
            {/*    showButton*/}
            {/*    btnHref="/kelas">*/}
            {/*    {(item) => (*/}
            {/*        <ProductCard*/}
            {/*            key={(item as LearningMaterial).id}*/}
            {/*            orientation="vertical"*/}
            {/*            category="kelas"*/}
            {/*            href={`/kelas/${*/}
            {/*                (item as LearningMaterial).course_slug*/}
            {/*            }`}*/}
            {/*            product={getProduct(item as LearningMaterial)}*/}
            {/*            eventName='User click Class Items on "Kelas Untukmu" Section'*/}
            {/*            className="w-full"*/}
            {/*        />*/}
            {/*    )}*/}
            {/*</DashboardSection>*/}
        </>
    );
};

export default PrivateDashboardContent;
