import { baseApi } from '../../../redux/api/baseApi';
import {
    FlashcardListResponse,
    FlashcardDetail,
    Card
} from '../../types/flashcards';

const FLASHCARD_BASE_URL = 'flashcards/';

export const flashcardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPublicFlashcards: builder.query<
            FlashcardListResponse,
            {
                page?: number;
                limit?: number;
                sort_by?: 'trending' | 'view' | 'like';
            }
        >({
            query: (params) => ({
                url: `${FLASHCARD_BASE_URL}public/`,
                params
            }),
            providesTags: ['FLASHCARD_LIST']
        }),

        getFlashcards: builder.query<
            FlashcardListResponse,
            {
                page?: number;
                limit?: number;
                type?: 'all' | 'user';
                sort_by?: 'trending' | 'view' | 'like';
            }
        >({
            query: (params) => ({
                url: FLASHCARD_BASE_URL,
                params
            }),
            providesTags: ['FLASHCARD_LIST']
        }),

        createFlashcard: builder.mutation<
            FlashcardDetail,
            {
                title: string;
                description: string;
                is_private: boolean;
            }
        >({
            query: (body) => ({
                url: FLASHCARD_BASE_URL,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body
            }),
            invalidatesTags: ['FLASHCARD_LIST', 'LAST_SEEN_FLASHCARDS']
        }),

        createFlashcardCopilot: builder.mutation<
            FlashcardDetail,
            {
                title: string;
                description: string;
                is_private: boolean;
                file_sources: string[];
            }
        >({
            query: (body) => ({
                url: `${FLASHCARD_BASE_URL}copilots/`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body
            }),
            invalidatesTags: ['FLASHCARD_LIST', 'LAST_SEEN_FLASHCARDS']
        }),

        getFlashcardDetail: builder.query<
            FlashcardDetail,
            { flashcard_slug: string }
        >({
            query: ({ flashcard_slug }) => ({
                url: `${FLASHCARD_BASE_URL}${flashcard_slug}/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }),
            providesTags: (result, error, { flashcard_slug }) => [
                { type: 'FLASHCARD' as const, id: flashcard_slug },
                ...(result?.cards?.map((card) => ({
                    type: 'FLASHCARD_CARD' as const,
                    id: card.id
                })) || [])
            ]
        }),

        getPublicFlashcardDetail: builder.query<
            FlashcardDetail,
            { flashcard_slug: string }
        >({
            query: ({ flashcard_slug }) => ({
                url: `${FLASHCARD_BASE_URL}public/${flashcard_slug}/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }),
            providesTags: (result, error, { flashcard_slug }) => [
                { type: 'FLASHCARD' as const, id: flashcard_slug },
                ...(result?.cards?.map((card) => ({
                    type: 'FLASHCARD_CARD' as const,
                    id: card.id
                })) || [])
            ]
        }),

        editFlashcard: builder.mutation<
            FlashcardDetail,
            {
                flashcard_slug: string;
                title: string;
                description: string;
                is_private: boolean;
            }
        >({
            query: ({ flashcard_slug, ...body }) => ({
                url: `${FLASHCARD_BASE_URL}${flashcard_slug}/`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body
            }),
            invalidatesTags: (result, error, { flashcard_slug }) => [
                { type: 'FLASHCARD', id: flashcard_slug },
                'FLASHCARD_LIST',
                'LAST_SEEN_FLASHCARDS'
            ]
        }),

        deleteFlashcard: builder.mutation<
            { message: string },
            { flashcard_slug: string }
        >({
            query: ({ flashcard_slug }) => ({
                url: `${FLASHCARD_BASE_URL}${flashcard_slug}/`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }),
            invalidatesTags: ['FLASHCARD_LIST', 'LAST_SEEN_FLASHCARDS']
        }),

        getLastSeenFlashcards: builder.query<FlashcardListResponse, void>({
            query: () => ({
                url: `${FLASHCARD_BASE_URL}last-seen/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }),
            providesTags: ['LAST_SEEN_FLASHCARDS']
        }),

        addCard: builder.mutation<
            Card,
            {
                flashcard_slug: string;
                question: string;
                answer: string;
            }
        >({
            query: ({ flashcard_slug, ...body }) => ({
                url: `${FLASHCARD_BASE_URL}${flashcard_slug}/cards/`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body
            }),
            invalidatesTags: (result, error, { flashcard_slug }) => [
                { type: 'FLASHCARD', id: flashcard_slug }
            ]
        }),

        editCard: builder.mutation<
            Card,
            {
                card_id: string;
                question: string;
                answer: string;
            }
        >({
            query: ({ card_id, ...body }) => ({
                url: `${FLASHCARD_BASE_URL}cards/${card_id}/`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body
            }),
            invalidatesTags: (result, error, { card_id }) => [
                { type: 'FLASHCARD_CARD' as const, id: card_id }
            ]
        }),

        deleteCard: builder.mutation<{ message: string }, { card_id: string }>({
            query: ({ card_id }) => ({
                url: `${FLASHCARD_BASE_URL}cards/${card_id}/`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }),
            invalidatesTags: (result, error, { card_id }) => [
                { type: 'FLASHCARD_CARD' as const, id: card_id }
            ]
        }),
        toggleFavoriteCard: builder.mutation<Card, { card_id: string }>({
            query: ({ card_id }) => ({
                url: `${FLASHCARD_BASE_URL}cards/${card_id}/toggle-favorite/`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }),
            invalidatesTags: (result, error, { card_id }) => [
                { type: 'FLASHCARD_CARD' as const, id: card_id }
            ]
        }),
        likeFlashcard: builder.mutation<
            { message: string },
            { flashcard_slug: string }
        >({
            query: ({ flashcard_slug }) => ({
                url: `${FLASHCARD_BASE_URL}${flashcard_slug}/like/`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }),
            invalidatesTags: (result, error, { flashcard_slug }) => [
                { type: 'FLASHCARD', id: flashcard_slug }
            ]
        }),

        dislikeFlashcard: builder.mutation<
            { message: string },
            { flashcard_slug: string }
        >({
            query: ({ flashcard_slug }) => ({
                url: `${FLASHCARD_BASE_URL}${flashcard_slug}/dislike/`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }),
            invalidatesTags: (result, error, { flashcard_slug }) => [
                { type: 'FLASHCARD', id: flashcard_slug }
            ]
        })
    })
});

export const {
    useGetPublicFlashcardsQuery,
    useGetFlashcardsQuery,
    useCreateFlashcardMutation,
    useCreateFlashcardCopilotMutation,
    useGetFlashcardDetailQuery,
    useGetPublicFlashcardDetailQuery,
    useDeleteFlashcardMutation,
    useEditFlashcardMutation,
    useGetLastSeenFlashcardsQuery,
    useAddCardMutation,
    useEditCardMutation,
    useDeleteCardMutation,
    useToggleFavoriteCardMutation,
    useLikeFlashcardMutation,
    useDislikeFlashcardMutation
} = flashcardApi;
