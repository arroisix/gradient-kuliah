import {
    ChatInput,
    ChatHistoryResponse,
    ChangeRatingInput,
    ToggleBookmarkInput,
    ContentRecommendationResponse,
    ContextRecommendationResponse,
    TextbookChaptersResponse,
    TextbookSectionsResponse,
    TextbookProblemsResponse,
    CourseChaptersResponse,
    CourseSubchaptersResponse,
    AstronotesChaptersResponse,
    AstronotesSubchaptersResponse,
    AstronotesTopicsResponse,
    BankSoalChaptersResponse,
    BankSoalSectionsResponse,
    BankSoalProblemsResponse,
    ContentSearchResponse
} from '../../types/copilot';
import config from 'redux/api/config';
import { baseApi } from 'redux/api/baseApi';

const BASE_URL = config.API_BASE_URL;
const COPILOT_BASE_URL = `${BASE_URL}copilots/`;

interface ContextRecommendationParams {
    q: string;
    page?: number;
    per_page?: number;
    content_type?: string;
    is_search?: boolean;
}

interface StreamCallbacks {
    onContent?: (content: string) => void;
    onComplete?: (
        messageId: string,
        sessionId: string,
        sessionName: string | null,
        keyword: string | null
    ) => void;
    onError?: (error: any) => void;
}

async function processStream(
    reader: ReadableStreamDefaultReader<string>,
    callbacks: StreamCallbacks
) {
    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;
        const parts = buffer.split('\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
            if (part.trim()) {
                try {
                    const jsonValue = JSON.parse(part);
                    if (jsonValue.type === 'CONTENT' && jsonValue.content) {
                        callbacks.onContent?.(jsonValue.content);
                    } else if (jsonValue.type === 'INFO') {
                        callbacks.onComplete?.(
                            jsonValue.message_id,
                            jsonValue.session_id,
                            jsonValue.session_name,
                            jsonValue.keyword
                        );
                    }
                } catch (err) {
                    callbacks.onError?.(err);
                    console.error('Error parsing JSON:', err);
                }
            }
        }
    }
}

export const chatApi = {
    chat: async (input: ChatInput, callbacks: StreamCallbacks) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${COPILOT_BASE_URL}chat/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                },
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body
                ?.pipeThrough(new TextDecoderStream())
                .getReader();

            if (reader) {
                await processStream(reader, callbacks);
            }
        } catch (error) {
            callbacks.onError?.(error);
            console.error('Chat error:', error);
        }
    },

    chatSingle: async (input: ChatInput, callbacks: StreamCallbacks) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${COPILOT_BASE_URL}chat/single/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                },
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body
                ?.pipeThrough(new TextDecoderStream())
                .getReader();

            if (reader) {
                await processStream(reader, callbacks);
            }
        } catch (error) {
            callbacks.onError?.(error);
            console.error('Chat error:', error);
        }
    },

    getChatHistory: async (
        sessionId?: string
    ): Promise<ChatHistoryResponse> => {
        const token = localStorage.getItem('token');
        const url = sessionId
            ? `${COPILOT_BASE_URL}chat/history/${sessionId}/`
            : `${COPILOT_BASE_URL}chat/history/single/`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
                Accept: '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getChatHistorySingle: async (): Promise<ChatHistoryResponse> => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}chat/history/single/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    changeMessageRating: async (
        input: ChangeRatingInput
    ): Promise<{ message: string }> => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}change-message-rating/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                },
                body: JSON.stringify(input)
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    toggleBookmark: async (
        input: ToggleBookmarkInput
    ): Promise<{ message: string }> => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}toggle-chat-bookmark/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                },
                body: JSON.stringify(input)
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getBookmarkedChats: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${COPILOT_BASE_URL}chat/bookmarked/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
                Accept: '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getSessionHistory: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${COPILOT_BASE_URL}session/history/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
                Accept: '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getContentSessionHistory: async (params: {
        book_slug?: string;
        chapter_id?: string;
    }) => {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams();

        if (params.book_slug) {
            queryParams.append('book_slug', params.book_slug);
        }
        if (params.chapter_id) {
            queryParams.append('chapter_id', params.chapter_id);
        }

        const response = await fetch(
            `${COPILOT_BASE_URL}session/history/?${queryParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    renameSession: async (input: {
        session_id: string;
        name: string;
    }): Promise<{ message: string }> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${COPILOT_BASE_URL}session/rename/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
                Accept: '*/*'
            },
            body: JSON.stringify(input)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    deleteSession: async (sessionId: string): Promise<{ message: string }> => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}session/${sessionId}/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    searchChat: async (keyword: string, type = 'all', page = 1, limit = 10) => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}chat/search/?keyword=${encodeURIComponent(
                keyword
            )}&type=${type}&page=${page}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getContentRecommendation: async (
        query: string
    ): Promise<ContentRecommendationResponse> => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}chat/content-recommendation/?q=${encodeURIComponent(
                query
            )}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    searchSummary: async (
        input: { input_text: string },
        callbacks: StreamCallbacks
    ) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${COPILOT_BASE_URL}search-summary/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                },
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body
                ?.pipeThrough(new TextDecoderStream())
                .getReader();

            if (reader) {
                await processStream(reader, callbacks);
            }
        } catch (error) {
            callbacks.onError?.(error);
            console.error('Search summary error:', error);
        }
    },

    getTemplates: async (
        contentType?:
            | 'course_video'
            | 'textbook_problem'
            | 'bank_soal_problem'
            | 'astronotes_content'
            | null
    ): Promise<{ templates: string[] }> => {
        const token = localStorage.getItem('token');

        let url = `${COPILOT_BASE_URL}chat/template/`;
        if (contentType !== undefined) {
            const params = new URLSearchParams();
            if (contentType === null) {
                params.append('content_type', '');
            } else {
                params.append('content_type', contentType);
            }
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
};

export const copilotApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getContentRecommendation: builder.query<
            ContextRecommendationResponse,
            ContextRecommendationParams
        >({
            query: (params: ContextRecommendationParams) => ({
                url: `${COPILOT_BASE_URL}context-recommendation/`,
                method: 'GET',
                params: {
                    ...params,
                    is_search: params.is_search ? 'True' : 'False'
                }
            }),
            providesTags: ['CONTEXT_RECOMMENDATION']
        }),
        getTextbookChapters: builder.query<TextbookChaptersResponse, string>({
            query: (bookSlug: string) => ({
                url: `${COPILOT_BASE_URL}textbook/chapter/${bookSlug}/`,
                method: 'GET'
            }),
            providesTags: ['TEXTBOOK_CHAPTERS']
        }),
        getTextbookSections: builder.query<TextbookSectionsResponse, string>({
            query: (chapterId: string) => ({
                url: `${COPILOT_BASE_URL}textbook/section/${chapterId}/`,
                method: 'GET'
            }),
            providesTags: ['TEXTBOOK_SECTIONS']
        }),
        getTextbookProblems: builder.query<
            TextbookProblemsResponse,
            { sectionId?: string; chapterId?: string }
        >({
            query: ({ sectionId, chapterId }) => ({
                url: `${COPILOT_BASE_URL}textbook/problem/`,
                method: 'GET',
                params: {
                    ...(sectionId && { section_id: sectionId }),
                    ...(chapterId && { chapter_id: chapterId })
                }
            }),
            providesTags: ['TEXTBOOK_PROBLEMS']
        }),
        getCourseChapters: builder.query<CourseChaptersResponse, string>({
            query: (courseSlug: string) => ({
                url: `${COPILOT_BASE_URL}course/chapter/${courseSlug}/`,
                method: 'GET'
            }),
            providesTags: ['COURSE_CHAPTERS']
        }),
        getCourseSubchapters: builder.query<CourseSubchaptersResponse, string>({
            query: (chapterId: string) => ({
                url: `${COPILOT_BASE_URL}course/subchapter/${chapterId}/`,
                method: 'GET'
            }),
            providesTags: ['COURSE_SUBCHAPTERS']
        }),
        getAstronotesChapters: builder.query<
            AstronotesChaptersResponse,
            string
        >({
            query: (bookSlug: string) => ({
                url: `${COPILOT_BASE_URL}astronotes/chapter/${bookSlug}/`,
                method: 'GET'
            }),
            providesTags: ['ASTRONOTES_CHAPTERS']
        }),
        getAstronotesSubchapters: builder.query<
            AstronotesSubchaptersResponse,
            { bookSlug: string; pageOrder: number; chapterId: string }
        >({
            query: ({ bookSlug, pageOrder, chapterId }) => ({
                url: `${COPILOT_BASE_URL}astronotes/subchapter/${bookSlug}/${pageOrder}/${chapterId}/`,
                method: 'GET'
            }),
            providesTags: ['ASTRONOTES_SUBCHAPTERS']
        }),
        getAstronotesTopics: builder.query<
            AstronotesTopicsResponse,
            { bookSlug: string; pageOrder: number; subchapterId: string }
        >({
            query: ({ bookSlug, pageOrder, subchapterId }) => ({
                url: `${COPILOT_BASE_URL}astronotes/topic/${bookSlug}/${pageOrder}/${subchapterId}/`,
                method: 'GET'
            }),
            providesTags: ['ASTRONOTES_TOPICS']
        }),
        getBankSoalChapters: builder.query<BankSoalChaptersResponse, string>({
            query: (bookSlug: string) => ({
                url: `${COPILOT_BASE_URL}bank-soal/chapter/${bookSlug}/`,
                method: 'GET'
            }),
            providesTags: ['BANKSOAL_CHAPTERS']
        }),
        getBankSoalSections: builder.query<BankSoalSectionsResponse, string>({
            query: (chapterId: string) => ({
                url: `${COPILOT_BASE_URL}bank-soal/section/${chapterId}/`,
                method: 'GET'
            }),
            providesTags: ['BANKSOAL_SECTIONS']
        }),
        getBankSoalProblems: builder.query<
            BankSoalProblemsResponse,
            { sectionId?: string; chapterId?: string }
        >({
            query: ({ sectionId, chapterId }) => ({
                url: `${COPILOT_BASE_URL}bank-soal/problem/${sectionId || ''}/`,
                method: 'GET',
                params: sectionId ? {} : { chapter_id: chapterId }
            }),
            providesTags: ['BANKSOAL_PROBLEMS']
        }),
        searchContent: builder.query<
            ContentSearchResponse,
            {
                q?: string;
                content_type:
                    | 'textbook_problem'
                    | 'astronotes_content'
                    | 'course_video'
                    | 'bank_soal_problem';
                book_slug?: string;
                course_slug?: string;
            }
        >({
            query: (params) => ({
                url: `${COPILOT_BASE_URL}context/search/`,
                method: 'GET',
                params: {
                    q: params.q || null,
                    content_type: params.content_type,
                    ...(params.book_slug && { book_slug: params.book_slug }),
                    ...(params.course_slug && {
                        course_slug: params.course_slug
                    })
                }
            }),
            providesTags: ['CONTENT_SEARCH']
        })
    }),
    overrideExisting: false
});

export const {
    useGetContentRecommendationQuery,
    useGetTextbookChaptersQuery,
    useGetTextbookSectionsQuery,
    useGetTextbookProblemsQuery,
    useGetCourseChaptersQuery,
    useGetCourseSubchaptersQuery,
    useGetAstronotesChaptersQuery,
    useGetAstronotesSubchaptersQuery,
    useGetAstronotesTopicsQuery,
    useGetBankSoalChaptersQuery,
    useGetBankSoalSectionsQuery,
    useGetBankSoalProblemsQuery,
    useLazySearchContentQuery
} = copilotApi;
