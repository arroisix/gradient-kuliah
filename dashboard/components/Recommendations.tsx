import React, { useEffect } from 'react';
import DashboardUpdatesBanner from './DashboardBanner';
import CarouselSection from './CarouselSection';
import ContentCard from './ContentCard';
import FlashcardCard from 'flashcard/components/Entrypoint/FlashcardCard';
import LatihanCard from 'exercises/components/Entrypoint/LatihanCard';
import { useTracker } from 'tracker/tracker';

import {
    useGetPopularClassesPublicQuery,
    useGetNewlyReleasedPublicQuery,
    useGetPublicBooksQuery,
    useGetPublicQuizQuery,
    useGetPublicFlashcardsQuery
} from 'dashboard/redux/api/dashboardApi';
import {
    NewlyReleasedForYouItem,
    MajorFlashcardItem,
    MajorQuizItem
} from 'dashboard/types/dashboard';

const Recommendations = ({
    onFinishLoading
}: {
    onFinishLoading?: () => void;
}): JSX.Element => {
    const tracker = useTracker();

    // Data sources (public)
    const { data: popularClasses, isLoading: isLoadingPopularClasses } =
        useGetPopularClassesPublicQuery({ page: 1, limit: 12 });

    const { data: newlyReleased, isLoading: isLoadingNewlyReleased } =
        useGetNewlyReleasedPublicQuery({ page: 1, limit: 6 });

    const { data: publicBooks, isLoading: isLoadingPublicBooks } =
        useGetPublicBooksQuery({ page: 1, limit: 12 });

    const { data: publicQuiz, isLoading: isLoadingPublicQuiz } =
        useGetPublicQuizQuery({ page: 1, limit: 12 });

    const { data: publicFlashcards, isLoading: isLoadingPublicFlashcards } =
        useGetPublicFlashcardsQuery({ page: 1, limit: 12 });

    useEffect(() => {
        if (
            !isLoadingPopularClasses &&
            !isLoadingNewlyReleased &&
            !isLoadingPublicBooks &&
            !isLoadingPublicQuiz &&
            !isLoadingPublicFlashcards
        ) {
            onFinishLoading?.();
        }
    }, [
        isLoadingPopularClasses,
        isLoadingNewlyReleased,
        isLoadingPublicBooks,
        isLoadingPublicQuiz,
        isLoadingPublicFlashcards,
        onFinishLoading
    ]);

    const checkForTwoLineTitles = (items: any[]) => {
        if (!items || !items.length) return false;
        const TITLE_WRAP_THRESHOLD = 40;
        return items.some((item) => {
            const title =
                item?.title ||
                item?.book_title ||
                item?.course_name ||
                item?.page_title ||
                '';
            return (title as string).length > TITLE_WRAP_THRESHOLD;
        });
    };

    // Popular classes
    const popularClassesHasTwoLineCards = checkForTwoLineTitles(
        popularClasses?.data || []
    );

    const renderPopularClassItem = (course: {
        id: string;
        course_slug: string;
        course_name: string;
        thumbnail: string;
    }): JSX.Element => {
        return (
            <ContentCard
                id={course.course_slug}
                title={course.course_name}
                category="Kelas"
                thumbnail={course.thumbnail}
                href={`/kelas/${course.course_slug}`}
                isMajorClass={true}
                hasTwoLineCards={popularClassesHasTwoLineCards}
                onClick={() => {
                    tracker?.genericTrack('Click Dashboard Content Card', {
                        section: 'Rekomendasi Kelas Populer',
                        cardTitle: course.course_name,
                        cardCategory: 'Kelas'
                    });
                }}
                className="bg-[#181818]"
            />
        );
    };

    // Newly Released (public ContentDataClass)
    const prepareNewlyReleasedItemData = (item: NewlyReleasedForYouItem) => {
        let title = item.title || item.book_title || item.course_name || '';
        let href = '#';
        let category = item.type;

        const typeLower = (item.type || '').toLowerCase();

        if (typeLower === 'course' || typeLower === 'kelas') {
            href = `/kelas/${item.course_slug}`;
            category = 'Kelas';
            title = item.title || item.course_name || '';
        } else if (typeLower === 'bank soal' || typeLower === 'bank-soal') {
            href = `/perpustakaan/bank-soal/${item.book_slug}`;
            category = 'Bank Soal';
            title = item.book_title || title;
        } else if (typeLower === 'textbook') {
            href = `/perpustakaan/textbook/${item.book_slug}`;
            category = 'Textbook Solution';
            title = item.book_title || title;
        } else if (typeLower === 'catatan' || typeLower === 'astronotes') {
            href = `/astronotes/${item.book_slug}/`;
            category = 'Astronotes';
            title = item.book_title || title;
        }

        return {
            id: item.id,
            title,
            category,
            thumbnail: item.thumbnail,
            href
        };
    };

    const newlyReleasedHasTwoLineCards = checkForTwoLineTitles(
        newlyReleased?.data || []
    );

    const renderNewlyReleasedItem = (item: NewlyReleasedForYouItem) => {
        const card = prepareNewlyReleasedItemData(item);
        return (
            <ContentCard
                {...card}
                hasTwoLineCards={newlyReleasedHasTwoLineCards}
                isBaru={true}
                onClick={() => {
                    tracker?.genericTrack('Click Dashboard Content Card', {
                        section: 'Terbaru Untukmu',
                        cardTitle: card.title,
                        cardCategory: card.category
                    });
                }}
                className="bg-[#181818]"
            />
        );
    };

    // Public Books (ContentDataClass)
    const publicBooksHasTwoLineCards = checkForTwoLineTitles(
        publicBooks?.data || []
    );
    const renderPublicBookItem = (item: NewlyReleasedForYouItem) => {
        const typeLower = (item.type || '').toLowerCase();
        const title = item.book_title || item.title || '';
        let href = '#';
        let category = 'Buku';

        if (typeLower === 'bank soal' || typeLower === 'bank-soal') {
            category = 'Bank Soal';
            href = `/perpustakaan/bank-soal/${item.book_slug}`;
        } else if (typeLower === 'textbook') {
            category = 'Textbook Solution';
            href = `/perpustakaan/textbook/${item.book_slug}`;
        } else if (typeLower === 'catatan' || typeLower === 'astronotes') {
            category = 'Astronotes';
            href = `/astronotes/${item.book_slug}/`;
        }

        return (
            <ContentCard
                id={item.id}
                title={title}
                category={category}
                thumbnail={item.thumbnail}
                href={href}
                hasTwoLineCards={publicBooksHasTwoLineCards}
                onClick={() => {
                    tracker?.genericTrack('Click Dashboard Content Card', {
                        section: 'Rekomendasi Buku dan Kumpulan Soal',
                        cardTitle: title,
                        cardCategory: category
                    });
                }}
                className="bg-[#181818]"
            />
        );
    };

    // Quiz (public)
    const renderPublicQuizItem = (item: MajorQuizItem) => {
        const exercise = {
            id: item.id,
            slug: item.slug,
            title: item.title,
            icon: item.icon || '🧪',
            subject: item.subject,
            total_questions: item.total_questions,
            progress: undefined,
            status: undefined,
            progress_percentage: undefined,
            is_free: item.is_free ?? undefined
        };
        return (
            <LatihanCard
                key={item.id}
                exercise={exercise as any}
                cardType="allExercises"
                onClick={() => {
                    tracker?.genericTrack('Click Dashboard Content Card', {
                        section: 'Rekomendasi Kuis',
                        cardTitle: item.title,
                        cardCategory: 'Kuis'
                    });
                }}
            />
        );
    };

    // Flashcards (public)
    const renderPublicFlashcardItem = (item: MajorFlashcardItem) => {
        const title = item.title || '';
        return (
            <FlashcardCard
                key={item.id}
                slug={item.slug}
                title={title}
                totalCards={item.card_count ?? 0}
                author={
                    item.created_by
                        ? {
                              name: item.created_by.name,
                              photo_profile: item.created_by.photo_profile || ''
                          }
                        : undefined
                }
                cardType="allFlashcards"
                createdByMe={item.created_by_me}
            />
        );
    };

    return (
        <>
            <div className="space-y-6">
                <CarouselSection
                    title="Rekomendasi Kelas Populer"
                    items={popularClasses?.data}
                    isLoading={isLoadingPopularClasses}
                    renderItem={renderPopularClassItem}
                    eventCategory="PublicPopularClasses"
                />

                <CarouselSection
                    title="Terbaru Untukmu"
                    items={newlyReleased?.data}
                    isLoading={isLoadingNewlyReleased}
                    renderItem={renderNewlyReleasedItem}
                    eventCategory="PublicNewlyReleasedForYou"
                />

                <DashboardUpdatesBanner />

                <CarouselSection
                    title="Rekomendasi Buku dan Kumpulan Soal"
                    items={publicBooks?.data}
                    isLoading={isLoadingPublicBooks}
                    renderItem={renderPublicBookItem}
                    eventCategory="PublicMajorBooks"
                />

                <CarouselSection
                    title="Rekomendasi Kuis"
                    items={publicQuiz?.data}
                    isLoading={isLoadingPublicQuiz}
                    renderItem={renderPublicQuizItem}
                    eventCategory="PublicMajorQuiz"
                />

                <CarouselSection
                    title="Flashcard dari Mahasiswa Lain"
                    items={publicFlashcards?.data}
                    isLoading={isLoadingPublicFlashcards}
                    renderItem={renderPublicFlashcardItem}
                    eventCategory="PublicMajorFlashcards"
                />
            </div>
        </>
    );
};

export default Recommendations;
