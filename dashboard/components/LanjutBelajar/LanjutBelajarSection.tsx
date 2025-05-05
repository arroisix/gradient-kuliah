import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useTracker } from 'tracker/tracker';
import TabNavigation from './TabNavigation';
import LearningCardGrid from './LearningCardGrid';
import {
    useGetUserClassesQuery,
    useGetUserBooksQuery,
    useGetUserFlashcardsQuery,
    useGetUserQuizQuery
} from 'dashboard/redux/api/dashboardApi';
import {
    UserBook,
    UserClass,
    UserFlashcard,
    UserQuiz
} from 'dashboard/types/dashboard';
import NoContentIcon from '../../assets/NoContentIcon';

export const TABS = {
    KELAS: 'kelas',
    BUKU: 'buku',
    KUIS: 'kuis',
    FLASHCARD: 'flashcard',
    PLAYLIST: 'playlist'
} as const;

export type TabType = typeof TABS[keyof typeof TABS];

export interface CardData {
    id: string;
    title: string;
    subtitle?: string;
    progress: number;
    thumbnail: string | null;
    category: string;
    href: string;
    courseBadge: string | null;
    chapterBadge: string | null;
    badgeColor?: string;
    authorName?: string;
    authorPhoto?: string;
    cardCount?: number;
}

type BookType = 'astronotes' | 'bank_soal' | 'textbook';

const EmptyState = ({ type }: { type: TabType }) => {
    const messages = {
        [TABS.KELAS]:
            'Belum ada riwayat. Video yang kamu tonton akan muncul di sini',
        [TABS.BUKU]:
            'Belum ada riwayat. Buku yang kamu baca akan muncul di sini',
        [TABS.KUIS]:
            'Belum ada riwayat. Kuis yang kamu kerjakan akan muncul di sini',
        [TABS.FLASHCARD]:
            'Belum ada riwayat. Flashcard yang kamu pelajari akan muncul di sini',
        [TABS.PLAYLIST]:
            'Belum ada riwayat. Playlist yang kamu buat akan muncul di sini'
    };

    return (
        <div className="flex flex-col items-center justify-center py-6">
            <p className="text-center text-gray-500">{messages[type]}</p>
            <div className="mt-4">
                <NoContentIcon />
            </div>
        </div>
    );
};

const LanjutBelajarSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>(TABS.KELAS);
    const [cardData, setCardData] = useState<CardData[]>([]);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const tracker = useTracker();

    const { data: classData, isLoading: isLoadingClass } =
        useGetUserClassesQuery(
            { page: 1, limit: 6 },
            { skip: !isAuthenticated || activeTab !== TABS.KELAS }
        );

    const { data: bookData, isLoading: isLoadingBook } = useGetUserBooksQuery(
        { page: 1, limit: 6 },
        { skip: !isAuthenticated || activeTab !== TABS.BUKU }
    );

    const { data: quizData, isLoading: isLoadingQuiz } = useGetUserQuizQuery(
        { page: 1, limit: 6 },
        { skip: !isAuthenticated || activeTab !== TABS.KUIS }
    );

    const { data: flashcardData, isLoading: isLoadingFlashcard } =
        useGetUserFlashcardsQuery(
            { page: 1, limit: 6 },
            { skip: !isAuthenticated || activeTab !== TABS.FLASHCARD }
        );

    const handleTabChange = (tab: TabType): void => {
        setCardData([]);
        setActiveTab(tab);
        tracker?.genericTrack('Click Tab on Continue Learning Section', {
            tab
        });
    };

    useEffect(() => {
        setCardData(getCardDataForActiveTab());
    }, [
        activeTab,
        classData,
        bookData,
        quizData,
        flashcardData,
        isLoadingClass,
        isLoadingBook,
        isLoadingQuiz,
        isLoadingFlashcard
    ]);

    const getCardDataForActiveTab = (): CardData[] => {
        if (activeTab === TABS.KELAS && classData?.data) {
            return classData.data.map((item: UserClass) => ({
                id: item.id,
                title: item.subchapter_name,
                subtitle: item.course_name,
                progress: item.progress_percentage,
                thumbnail: item.thumbnail,
                category: 'Video',
                href: `/kelas/${item.course_slug}/${item.subchapter_slug}`,
                courseBadge: item.course_name,
                chapterBadge: null,
                badgeColor: 'bg-purple-600'
            }));
        }

        if (activeTab === TABS.BUKU && bookData?.data) {
            return bookData.data.map((item: UserBook) => ({
                id: item.id,
                title: item.book_title,
                subtitle: item.course_name,
                progress: item.progress_percentage,
                thumbnail: item.cover_url,
                category: getCategoryFromType(item.type as BookType),
                href: getBookUrl(item),
                courseBadge: item.course_name,
                chapterBadge: item.latest_chapter || null,
                badgeColor: getColorForType(item.type as BookType)
            }));
        }

        if (activeTab === TABS.KUIS && quizData?.data) {
            return quizData.data.map((item: UserQuiz) => ({
                id: item.slug,
                title: item.title,
                subtitle: item.course_name,
                progress: parseInt(item.progress_percentage),
                thumbnail: null,
                category: 'Exercise',
                href: `/latihan/${item.slug}`,
                courseBadge: item.course_name,
                chapterBadge: `${
                    item.total_questions || item.problem_count
                } Soal`,
                badgeColor: 'bg-blue-500'
            }));
        }

        if (activeTab === TABS.FLASHCARD && flashcardData?.data) {
            return flashcardData.data.map((item: UserFlashcard) => ({
                id: item.id,
                title: item.title,
                subtitle: item.course_name,
                progress: item.progress_percentage,
                thumbnail: null,
                category: 'Flashcard',
                href: `/flashcards/${item.slug}`,
                authorName: item.created_by,
                authorPhoto: item.photo_profile,
                cardCount: item.card_count || parseInt(item.total_questions),
                courseBadge: null,
                chapterBadge: null,
                badgeColor: 'bg-orange-500'
            }));
        }

        return [];
    };

    const getCategoryFromType = (type: BookType): string => {
        const typeMap: Record<BookType, string> = {
            astronotes: 'Astronotes',
            bank_soal: 'Bank Soal',
            textbook: 'Textbook Solution'
        };
        return typeMap[type] || type;
    };

    const getColorForType = (type: BookType): string => {
        const colorMap: Record<BookType, string> = {
            astronotes: 'bg-[#CC009E]',
            bank_soal: 'bg-[#0083FF]',
            textbook: 'bg-[#00B78B]'
        };
        return colorMap[type] || 'bg-neutral-700';
    };

    const getBookUrl = (item: UserBook): string => {
        const baseUrlMap: Record<BookType, string> = {
            astronotes: '/astronotes',
            bank_soal: '/bank-soal',
            textbook: '/textbook'
        };

        const baseUrl = baseUrlMap[item.type as BookType] || '/perpustakaan';

        if (item.latest_problem) {
            return `${baseUrl}/${item.book_slug}/${item.latest_problem}`;
        } else if (item.latest_page) {
            return `${baseUrl}/${item.book_slug}/${item.latest_page}`;
        }
        return `${baseUrl}/${item.book_slug}`;
    };

    const isLoading =
        (activeTab === TABS.KELAS && isLoadingClass) ||
        (activeTab === TABS.BUKU && isLoadingBook) ||
        (activeTab === TABS.KUIS && isLoadingQuiz) ||
        (activeTab === TABS.FLASHCARD && isLoadingFlashcard);

    const handleCardClick = (card: CardData): void => {
        tracker?.genericTrack('Click Card on Continue Learning Section', {
            tab: activeTab,
            cardId: card.id,
            title: card.title
        });
    };

    return (
        <div className="w-full pb-8">
            <h2 className="text-xl font-extrabold mb-4">
                Lanjut Belajar, Yuk!
            </h2>

            <TabNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                </div>
            ) : cardData.length > 0 ? (
                <LearningCardGrid
                    cardData={cardData}
                    isLoading={false}
                    onCardClick={handleCardClick}
                />
            ) : (
                <EmptyState type={activeTab} />
            )}
        </div>
    );
};

export default LanjutBelajarSection;
