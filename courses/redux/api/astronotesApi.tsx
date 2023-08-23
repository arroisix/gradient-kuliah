import { baseApi } from 'redux/api/baseApi';

const COURSE_BASE_URL = 'courses/';

export const astronotesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBookProgress: builder.query<
            getBookProgressResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${COURSE_BASE_URL}book/${slug}`
            }),
            providesTags: ['ASTRONOTES']
        }),
        postBookProgress: builder.mutation<
            {
                message: string;
            },
            {
                user_id: string;
                slug: string;
                page_id: string;
                next_page_order?: number;
            }
        >({
            query: ({ user_id, ...body }) => ({
                url: `${COURSE_BASE_URL}book/${user_id}/progress`,
                body
            }),
            invalidatesTags: ['ASTRONOTES']
        }),
        getTableContents: builder.query<
            getTableContentsResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${COURSE_BASE_URL}book/${slug}/contents`
            })
        }),
        getHighlight: builder.query<getHighlightReponse, { slug: string }>({
            query: ({ slug }) => ({
                url: `${COURSE_BASE_URL}book/${slug}/highlight`
            })
        }),
        postHighlight: builder.mutation<
            {
                message: string;
            },
            postHighlightBody
        >({
            query: ({ slug, ...body }) => ({
                url: `${COURSE_BASE_URL}book/${slug}/highlight`,
                body
            }),
            invalidatesTags: ['ASTRONOTES']
        }),
        getBookmarks: builder.query<getBookmarksReponse, { slug: string }>({
            query: ({ slug }) => ({
                url: `${COURSE_BASE_URL}book/${slug}/bookmark`
            })
        }),
        postBookmarks: builder.mutation<
            {
                message: string;
            },
            { slug: string; page_id: string }
        >({
            query: ({ slug, ...body }) => ({
                url: `${COURSE_BASE_URL}book/${slug}/bookmark`,
                body
            }),
            invalidatesTags: ['ASTRONOTES']
        }),
        postRating: builder.mutation<
            {
                message: string;
            },
            { slug: string; rate: number }
        >({
            query: ({ slug, ...body }) => ({
                url: `${COURSE_BASE_URL}book/${slug}/rating`,
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
                url: `${COURSE_BASE_URL}book/${slug}/feedback`,
                body
            })
        })
    })
});

export const {
    useGetBookProgressQuery,
    usePostBookProgressMutation,
    useGetTableContentsQuery,
    useGetHighlightQuery,
    usePostHighlightMutation,
    useGetBookmarksQuery,
    usePostBookmarksMutation,
    usePostRatingMutation,
    usePostFeedbackMutation
} = astronotesApi;
