import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import {
    useGetMajorClassesQuery,
    useGetMajorRecommendationQuery,
    useGetLearnRecommendationQuery
} from 'dashboard/redux/api/dashboardApi';
import CarouselSection from './CarouselSection';
import ContentCard from './ContentCard';
import { useTracker } from 'tracker/tracker';
import {
    MajorRecommendationItem,
    VideoRecommendationItem,
    BookRecommendationItem,
    QuizRecommendationItem,
    FlashcardRecommendationItem
} from 'dashboard/types/dashboard';
import DashboardUpdatesBanner from './DashboardBanner';

const PrivateDashboardContent = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const tracker = useTracker();

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

    const checkForTwoLineTitles = (items: any[]) => {
        if (!items || !items.length) return false;

        const TITLE_WRAP_THRESHOLD = 40;

        return items.some((item) => {
            let itemTitle = '';

            if (item.type === 'video') {
                itemTitle = item.subchapter_name || item.chapter_name || '';
            } else if (
                item.type === 'textbook' ||
                item.type === 'bank_soal' ||
                item.type === 'astronotes'
            ) {
                itemTitle = item.book_title || '';
            } else if (item.type === 'quiz' || item.type === 'flashcard') {
                itemTitle = item.title || '';
            } else {
                itemTitle =
                    item.title ||
                    item.book_title ||
                    item.course_name ||
                    item.subchapter_name ||
                    item.chapter_name ||
                    '';
            }

            return itemTitle.length > TITLE_WRAP_THRESHOLD;
        });
    };

    const majorClassesHasTwoLineCards = checkForTwoLineTitles(
        majorClasses?.data || []
    );

    const renderMajorClassItem = (item: any) => {
        return (
            <ContentCard
                id={item.course_slug}
                title={item.course_name}
                category="Kelas"
                thumbnail={item.thumbnail}
                href={`/kelas/${item.course_slug}`}
                isMajorClass={true}
                hasTwoLineCards={majorClassesHasTwoLineCards}
                onClick={() => {
                    tracker?.genericTrack('Click Dashboard Content Card', {
                        section: 'Kelas yang Diambil Mahasiswa',
                        sectionMajor: majorClasses?.major,
                        cardTitle: item.course_name,
                        cardCategory: 'Kelas'
                    });
                }}
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
            problemCount,
            authorName;

        switch (item.type) {
            case 'video':
                const videoItem = item as VideoRecommendationItem;
                title = videoItem.subchapter_name;
                href = `/kelas/${videoItem.course_slug}/${videoItem.subchapter_slug}`;
                category = 'Video';
                courseName = videoItem.course_name;
                chapterName = videoItem.subchapter_name;
                break;

            case 'textbook':
                const textbookItem = item as BookRecommendationItem;
                title = textbookItem.book_title;
                href = `perpustakaan/textbook/${textbookItem.book_slug}`;
                category = 'Textbook Solution';
                courseName = textbookItem.course_name;
                break;

            case 'bank_soal':
                const bankSoalItem = item as BookRecommendationItem;
                title = bankSoalItem.book_title;
                href = `perpustakaan/bank-soal/${bankSoalItem.book_slug}`;
                category = 'Bank Soal';
                courseName = bankSoalItem.course_name;
                break;

            case 'astronotes':
                const notesItem = item as BookRecommendationItem;
                title = notesItem.page_title;
                href = `/astronotes/${notesItem.book_slug}/${notesItem.page_number}`;
                category = 'Astronotes';
                courseName = notesItem.book_title;
                break;

            case 'quiz':
                const quizItem = item as QuizRecommendationItem;
                title = quizItem.title;
                href = `/latihan/${quizItem.slug}`;
                category = 'Kuis';
                courseName = quizItem.course_name;
                problemCount = quizItem.total_questions;
                break;

            case 'flashcard':
                const flashcardItem = item as FlashcardRecommendationItem;
                title = flashcardItem.title;
                href = `/flashcards/${flashcardItem.slug}`;
                category = 'Flashcard';
                courseName = flashcardItem.course_name;
                cardCount = flashcardItem.card_count;
                authorName = flashcardItem.created_by;
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
            problemCount,
            authorName
        };
    };

    const majorRecommendationHasTwoLineCards = checkForTwoLineTitles(
        majorRecommendation?.data || []
    );

    const renderTrendingItem = (item: MajorRecommendationItem): JSX.Element => {
        const itemData = prepareItemData(item);
        return (
            <ContentCard
                {...itemData}
                isTrending={true}
                hasTwoLineCards={majorRecommendationHasTwoLineCards}
                onClick={() => {
                    tracker?.genericTrack('Click Dashboard Content Card', {
                        section: 'Trending untuk Mahasiswa',
                        sectionMajor: majorRecommendation?.major,
                        cardTitle: itemData.title,
                        cardCategory: itemData.category
                    });
                }}
            />
        );
    };

    return (
        <>
            <CarouselSection
                title={`Dipelajari Mahasiswa Jurusan Kamu`}
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

            <h2 className="text-lg font-extrabold md:text-xl">
                Jangan Sampai Ketinggalan!
            </h2>
            <DashboardUpdatesBanner />

            {learnRecommendation?.data?.map((courseRec, index) => {
                const courseRecommendationHasTwoLineCards =
                    checkForTwoLineTitles(courseRec.recommendations || []);

                return (
                    <CarouselSection
                        key={`learn-rec-${index}-${courseRec.course_name}`}
                        title={`Karena Kamu Belajar ${courseRec.course_name}`}
                        items={courseRec.recommendations}
                        isLoading={isLoadingLearnRecommendation}
                        renderItem={(item) => {
                            const itemData = prepareItemData(
                                item as MajorRecommendationItem
                            );
                            return (
                                <ContentCard
                                    {...itemData}
                                    hasTwoLineCards={
                                        courseRecommendationHasTwoLineCards
                                    }
                                    onClick={() => {
                                        tracker?.genericTrack(
                                            'Click Dashboard Content Card',
                                            {
                                                section: 'Karena Kamu Belajar',
                                                sectionCourse:
                                                    courseRec.course_name,
                                                cardTitle: itemData.title,
                                                cardCategory: itemData.category
                                            }
                                        );
                                    }}
                                />
                            );
                        }}
                        eventCategory={`LearnRecommendation-${courseRec.course_name}`}
                    />
                );
            })}
        </>
    );
};

export default PrivateDashboardContent;
