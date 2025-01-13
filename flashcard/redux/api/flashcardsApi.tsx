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
            })
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
            })
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
            })
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
            })
        }),

        getFlashcardDetail: builder.query<
            FlashcardDetail,
            { flashcard_id: string }
        >({
            query: ({ flashcard_id }) => ({
                url: `${FLASHCARD_BASE_URL}${flashcard_id}/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }),
            providesTags: (result, error, { flashcard_id }) => [
                { type: 'FLASHCARD' as const, id: flashcard_id },
                ...(result?.cards?.map((card) => ({
                    type: 'FLASHCARD_CARD' as const,
                    id: card.id
                })) || [])
            ]
        }),

        editFlashcard: builder.mutation<
            FlashcardDetail,
            {
                flashcard_id: string;
                title: string;
                description: string;
                is_private: boolean;
            }
        >({
            query: ({ flashcard_id, ...body }) => ({
                url: `${FLASHCARD_BASE_URL}${flashcard_id}/`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body
            })
        }),

        deleteFlashcard: builder.mutation<
            { message: string },
            { flashcard_id: string }
        >({
            query: ({ flashcard_id }) => ({
                url: `${FLASHCARD_BASE_URL}${flashcard_id}/`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
        }),

        getLastSeenFlashcards: builder.query<FlashcardListResponse, void>({
            query: () => ({
                url: `${FLASHCARD_BASE_URL}last-seen/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
        }),

        addCard: builder.mutation<
            Card,
            {
                flashcard_id: string;
                question: string;
                answer: string;
            }
        >({
            query: ({ flashcard_id, ...body }) => ({
                url: `${FLASHCARD_BASE_URL}${flashcard_id}/cards/`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body
            })
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
            })
        }),

        deleteCard: builder.mutation<{ message: string }, { card_id: string }>({
            query: ({ card_id }) => ({
                url: `${FLASHCARD_BASE_URL}cards/${card_id}/`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
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
        })
    })
});

export const {
    useGetPublicFlashcardsQuery,
    useGetFlashcardsQuery,
    useCreateFlashcardMutation,
    useCreateFlashcardCopilotMutation,
    useGetFlashcardDetailQuery,
    useDeleteFlashcardMutation,
    useEditFlashcardMutation,
    useGetLastSeenFlashcardsQuery,
    useAddCardMutation,
    useEditCardMutation,
    useDeleteCardMutation,
    useToggleFavoriteCardMutation
} = flashcardApi;
