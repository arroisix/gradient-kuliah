import { baseApi } from 'redux/api/baseApi';

const COURSE_BASE_URL = 'books/';

export const astronotesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBookProgress: builder.query<
            getBookProgressResponse,
            { slug: string; page?: number }
        >({
            query: ({ slug, page }) => ({
                url: `${COURSE_BASE_URL}${slug}`,
                params: {
                    page: page
                }
            }),
            providesTags: [{ type: 'ASTRONOTES', id: 'ALL' }]
        }),
        postBookProgress: builder.mutation<
            {
                message: string;
            },
            {
                slug: string;
                next_page_order: number;
            }
        >({
            query: ({ slug, ...body }) => ({
                url: `${COURSE_BASE_URL}${slug}`,
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'ASTRONOTES', id: 'ALL' }]
        }),
        getTableContents: builder.query<
            GetBookChapterResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${COURSE_BASE_URL}${slug}/chapters/`
            })
        }),
        getTableContentSubchapters: builder.query<
            ResponseData<BookSubchapter>,
            { slug: string; chapter_id: string }
        >({
            query: ({ slug, chapter_id }) => ({
                url: `${COURSE_BASE_URL}${slug}/chapters/${chapter_id}/subchapters/`
            })
        }),
        getHighlight: builder.query<getHighlightReponse, { slug: string }>({
            query: ({ slug }) => ({
                url: `${COURSE_BASE_URL}${slug}/highlight`
            }),
            providesTags: [{ type: 'ASTRONOTES', id: 'HIGHLIGHT' }]
        }),
        postHighlight: builder.mutation<
            {
                message: string;
            },
            postHighlightBody
        >({
            query: ({ slug, ...body }) => ({
                url: `${COURSE_BASE_URL}${slug}/highlight`,
                method: 'POST',
                body
            }),
            invalidatesTags: [
                { type: 'ASTRONOTES', id: 'HIGHLIGHT' },
                { type: 'ASTRONOTES', id: 'ALL' }
            ]
        }),
        deleteHighlight: builder.mutation<
            {
                message: string;
            },
            { slug: string; highlight_id: string }
        >({
            query: ({ slug, highlight_id }) => ({
                url: `${COURSE_BASE_URL}${slug}/highlight?highlight_id=${highlight_id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [
                { type: 'ASTRONOTES', id: 'HIGHLIGHT' },
                { type: 'ASTRONOTES', id: 'ALL' }
            ]
        }),
        getBookmarks: builder.query<getBookmarksReponse, { slug: string }>({
            query: ({ slug }) => ({
                url: `${COURSE_BASE_URL}${slug}/bookmark`
            }),
            providesTags: [{ type: 'ASTRONOTES', id: 'BOOKMARK' }]
        }),
        postBookmarks: builder.mutation<
            {
                message: string;
            },
            { slug: string; page_order: number; is_active: boolean }
        >({
            query: ({ slug, ...body }) => ({
                url: `${COURSE_BASE_URL}${slug}/bookmark`,
                method: 'POST',
                body
            }),
            invalidatesTags: [
                { type: 'ASTRONOTES', id: 'BOOKMARK' },
                { type: 'ASTRONOTES', id: 'ALL' }
            ]
        }),
        postRating: builder.mutation<
            {
                message: string;
            },
            { slug: string; rate: number }
        >({
            query: ({ slug, ...body }) => ({
                url: `${COURSE_BASE_URL}${slug}/rating`,
                method: 'POST',
                body
            })
        }),
        postFeedback: builder.mutation<
            {
                message: string;
            },
            { slug: string; feedback: string }
        >({
            query: ({ slug, ...body }) => ({
                url: `${COURSE_BASE_URL}${slug}/feedback`,
                method: 'POST',
                body
            })
        })
    })
});

export const {
    useGetBookProgressQuery,
    useLazyGetBookProgressQuery,
    usePostBookProgressMutation,
    useGetTableContentsQuery,
    useGetTableContentSubchaptersQuery,
    useGetHighlightQuery,
    usePostHighlightMutation,
    useDeleteHighlightMutation,
    useGetBookmarksQuery,
    usePostBookmarksMutation,
    usePostRatingMutation,
    usePostFeedbackMutation
} = astronotesApi;
