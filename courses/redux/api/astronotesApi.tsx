import { baseApi } from 'redux/api/baseApi';

const BOOK_BASE_URL = 'books/';

export const astronotesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAstronotesContent: builder.query<
            GetAstronotesContentResponse,
            { slug: string; page?: number; specialToken?: string }
        >({
            query: ({ slug, page, specialToken }) => ({
                url: `${BOOK_BASE_URL}${slug}`,
                params: {
                    page: page
                },
                headers: {
                    'X-Special-Request': specialToken
                }
            }),
            providesTags: [{ type: 'ASTRONOTES', id: 'ALL' }]
        }),
        getEntrypointBooks: builder.query<
            AstronoteBooksResponse,
            AstronotesBooksQueryParams | undefined
        >({
            query: (params) => ({
                url: `${BOOK_BASE_URL}v2/entrypoint/`,
                params
            }),
            providesTags: [{ type: 'ASTRONOTES', id: 'ENTRYPOINT' }]
        }),
        getPublicEntrypointBooks: builder.query<
            AstronoteBooksResponse,
            AstronotesBooksQueryParams | undefined
        >({
            query: (params) => ({
                url: `${BOOK_BASE_URL}v2/public/entrypoint/`,
                params
            }),
            providesTags: [{ type: 'ASTRONOTES', id: 'PUBLIC_ENTRYPOINT' }]
        }),
        getPublicBookPreview: builder.query<
            GetAstronotesContentResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${BOOK_BASE_URL}public/${slug}/preview/`
            }),
            providesTags: [{ type: 'ASTRONOTES', id: 'PUBLIC_PREVIEW' }]
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
                url: `${BOOK_BASE_URL}${slug}`,
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'ASTRONOTES', id: 'ALL' }]
        }),
        getBookDetail: builder.query<GetBookDetailResponse, { slug: string }>({
            query: ({ slug }) => ({
                url: `${BOOK_BASE_URL}${slug}/detail/`
            }),
            providesTags: [{ type: 'ASTRONOTES', id: 'DETAILS' }]
        }),
        getTextbookSolution: builder.query<
            TextbookSolution,
            { slug: string; problemSlug: string; specialToken?: string }
        >({
            query: ({ slug, problemSlug, specialToken }) => ({
                url: `${BOOK_BASE_URL}textbook/${slug}/problems/${problemSlug}/`,
                headers: {
                    'X-Special-Request': specialToken
                }
            }),
            providesTags: [{ type: 'ASTRONOTES', id: 'TEXTBOOK-SOLUTION' }]
        }),
        getBankSoal: builder.query<
            BankSoal,
            { slug: string; problemSlug: string; specialToken?: string }
        >({
            query: ({ slug, problemSlug, specialToken }) => ({
                url: `${BOOK_BASE_URL}bank-soal/${slug}/problems/${problemSlug}/`,
                headers: {
                    'X-Special-Request': specialToken
                }
            }),
            providesTags: [{ type: 'ASTRONOTES', id: 'BANK-SOAL' }]
        }),
        getTableContents: builder.query<
            GetBookChapterResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${BOOK_BASE_URL}${slug}/chapters/`
            })
        }),
        getTableContentSubchapters: builder.query<
            ResponseData<BookSubchapter>,
            { slug: string; chapter_id: string }
        >({
            query: ({ slug, chapter_id }) => ({
                url: `${BOOK_BASE_URL}${slug}/chapters/${chapter_id}/subchapters/`
            })
        }),
        getPublicTableContents: builder.query<
            GetBookChapterResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${BOOK_BASE_URL}public/${slug}/chapters/`
            })
        }),
        getPublicTableContentSubchapters: builder.query<
            ResponseData<BookSubchapter>,
            { slug: string; chapter_id: string }
        >({
            query: ({ slug, chapter_id }) => ({
                url: `${BOOK_BASE_URL}public/${slug}/chapters/${chapter_id}/subchapters/`
            })
        }),
        getHighlight: builder.query<getHighlightReponse, { slug: string }>({
            query: ({ slug }) => ({
                url: `${BOOK_BASE_URL}${slug}/highlight`
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
                url: `${BOOK_BASE_URL}${slug}/highlight`,
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
                url: `${BOOK_BASE_URL}${slug}/highlight?highlight_id=${highlight_id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [
                { type: 'ASTRONOTES', id: 'HIGHLIGHT' },
                { type: 'ASTRONOTES', id: 'ALL' }
            ]
        }),
        getBookmarks: builder.query<ResponseData<Bookmark>, { slug: string }>({
            query: ({ slug }) => ({
                url: `${BOOK_BASE_URL}${slug}/bookmark`
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
                url: `${BOOK_BASE_URL}${slug}/bookmark`,
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
                url: `${BOOK_BASE_URL}${slug}/rating`,
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
                url: `${BOOK_BASE_URL}${slug}/feedback`,
                method: 'POST',
                body
            })
        }),
        postTextbookFeedback: builder.mutation<
            void,
            {
                slug: string;
                problemSlug: string;
                category: string;
                rating: number;
                comment: string;
            }
        >({
            query: ({ slug, problemSlug, category, ...body }) => ({
                url: `${BOOK_BASE_URL}${
                    category == 'Bank Soal' ? 'bank-soal/' : 'textbook/'
                }${slug}/problems/${problemSlug}/rating/`,
                method: 'PUT',
                body
            }),
            invalidatesTags: [{ type: 'ASTRONOTES', id: 'TEXTBOOK-SOLUTION' }]
        }),
        getLandingPopularBooks: builder.query<
            GetLandingPopularBooksResponseData,
            GetLandingPopularBooksQueryParam
        >({
            query: (params: GetLandingPopularBooksQueryParam) => ({
                url: `${BOOK_BASE_URL}landing/popular/`,
                params: { ...params }
            })
        })
    })
});

export const {
    useGetEntrypointBooksQuery,
    useGetPublicEntrypointBooksQuery,
    useGetAstronotesContentQuery,
    useLazyGetAstronotesContentQuery,
    useGetPublicBookPreviewQuery,
    usePostBookProgressMutation,
    useGetBookDetailQuery,
    useGetTableContentsQuery,
    useGetTableContentSubchaptersQuery,
    useGetPublicTableContentsQuery,
    useGetPublicTableContentSubchaptersQuery,
    useGetHighlightQuery,
    usePostHighlightMutation,
    useDeleteHighlightMutation,
    useGetBookmarksQuery,
    usePostBookmarksMutation,
    usePostRatingMutation,
    usePostFeedbackMutation,
    usePostTextbookFeedbackMutation,
    useGetTextbookSolutionQuery,
    useGetLandingPopularBooksQuery,
    useGetBankSoalQuery
} = astronotesApi;

export const {
    getBookDetail,
    getTextbookSolution,
    getBankSoal,
    getAstronotesContent,
    getPublicBookPreview
} = astronotesApi.endpoints;
