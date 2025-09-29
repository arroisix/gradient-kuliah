import { baseApi } from 'redux/api/baseApi';

const KOMUNITAS_BASE_URL = 'communities/';
const LEARNING_EXPERIENCE_BASE_URL = 'learning-experiences/';

export const komunitasApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubjectCategories: builder.query<SubjectCategoriesResponse, void>({
            query: () => ({ url: `${KOMUNITAS_BASE_URL}subject-category/` })
        }),
        getPublicSubjectCategories: builder.query<
            SubjectCategoriesResponse,
            void
        >({
            query: () => ({
                url: `${KOMUNITAS_BASE_URL}public/subject-category/`
            })
        }),
        getCommunityNotification: builder.query<CommunityNotification, void>({
            query: () => ({ url: `${KOMUNITAS_BASE_URL}notification/` })
        }),
        postQuestionAnswer: builder.mutation<
            PostQuestionAnswerResponse,
            PostQuestionAnswerPayload
        >({
            query: (payload: PostQuestionAnswerPayload) => ({
                url: `${KOMUNITAS_BASE_URL}post/`,
                method: 'POST',
                body: { ...payload }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'COMMUNITIES', id: 'LIST' },
                { type: 'COMMUNITIES', id: arg.post_id as string },
                'COMMUNITIES'
            ]
        }),
        getCommunityPost: builder.query<
            CommunityPostResponse & {
                count_items: number;
                next_page?: number;
                previous_page?: number;
            },
            BaseListQueryParams & CommunityPostQuery
        >({
            query: ({ sort_by = 'LATEST', ...params }) => ({
                url: `${KOMUNITAS_BASE_URL}post/`,
                params: { sort_by, ...params }
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.community_posts.map(
                              ({ id }) => ({ type: 'COMMUNITIES', id }) as const
                          ),
                          { type: 'COMMUNITIES', id: 'LIST' },
                          'COMMUNITIES'
                      ]
                    : [{ type: 'COMMUNITIES', id: 'LIST' }]
        }),
        getPublicCommunityPost: builder.query<
            CommunityPostResponse & {
                count_items: number;
                next_page?: number;
                previous_page?: number;
            },
            BaseListQueryParams & CommunityPostQuery
        >({
            query: ({ sort_by = 'LATEST', ...params }) => ({
                url: `${KOMUNITAS_BASE_URL}public/post/`,
                params: { sort_by, ...params }
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.community_posts.map(
                              ({ id }) => ({ type: 'COMMUNITIES', id }) as const
                          ),
                          { type: 'COMMUNITIES', id: 'PUBLIC_LIST' },
                          'COMMUNITIES'
                      ]
                    : [{ type: 'COMMUNITIES', id: 'PUBLIC_LIST' }]
        }),
        getMyQuestionList: builder.query<
            MyQuestionListResponse,
            { user_id: string }
        >({
            query: ({ user_id }) => ({
                url: `${KOMUNITAS_BASE_URL}post/list/${user_id}/`
            }),
            providesTags: [{ type: 'COMMUNITIES', id: 'LIST' }]
        }),
        getExploreQuestion: builder.query<
            ExploreQuestionResponse,
            { category_id?: string; current_post?: string }
        >({
            query: ({ category_id, current_post }) => ({
                url: `${KOMUNITAS_BASE_URL}post/list/`,
                params: { category_id, current_post }
            }),
            providesTags: [{ type: 'COMMUNITIES', id: 'LIST' }]
        }),
        getPublicExploreQuestion: builder.query<
            ExploreQuestionResponse,
            { category_id?: string; current_post?: string }
        >({
            query: ({ category_id, current_post }) => ({
                url: `${KOMUNITAS_BASE_URL}public/post/list/`,
                params: { category_id, current_post }
            }),
            providesTags: [{ type: 'COMMUNITIES', id: 'PUBLIC_LIST' }]
        }),
        getCommunityPostDetail: builder.query<
            CommunityPostDetailResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${KOMUNITAS_BASE_URL}post/${slug}/`
            }),
            providesTags: (result) => [
                { type: 'COMMUNITIES', id: result?.id } as const,
                'COMMUNITIES'
            ]
        }),
        getPublicCommunityPostDetail: builder.query<
            CommunityPostDetailResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${KOMUNITAS_BASE_URL}public/post/${slug}/`
            }),
            providesTags: (result) => [
                { type: 'COMMUNITIES', id: result?.id } as const,
                'COMMUNITIES'
            ]
        }),
        getCommunityPostCommentDetail: builder.query<
            CommunityPostCommentDetailResponse & {
                count_items: number;
                next_page?: number;
                previous_page?: number;
            },
            BaseListQueryParams & { post_id: string; isAuthenticated?: boolean }
        >({
            query: (args) => {
                const { post_id, isAuthenticated: _, ...params } = args;
                return {
                    url: `${KOMUNITAS_BASE_URL}post/${post_id}/comment/`,
                    params
                };
            },
            serializeQueryArgs: ({ queryArgs, endpointName }) => {
                return endpointName + queryArgs.post_id;
            },
            merge: (currentCache, newItems, other) => {
                if (other.arg.page > 1) {
                    currentCache.comments.push(...newItems.comments);
                    currentCache.next_page = newItems.next_page;
                    currentCache.previous_page = newItems.previous_page;
                } else {
                    currentCache.comments = newItems.comments;
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    if (arg.isAuthenticated) {
                        await queryFulfilled;
                        const getCommunityNotification = dispatch(
                            komunitasApi.endpoints.getCommunityNotification.initiate()
                        );
                        getCommunityNotification.refetch();
                    }
                } catch {}
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                          ...result.comments.map(
                              () =>
                                  ({
                                      type: 'COMMUNITIES',
                                      id: arg.post_id
                                  }) as const
                          ),
                          ...result.comments.map(
                              (value) =>
                                  ({
                                      type: 'COMMUNITIES',
                                      id: value.id
                                  }) as const
                          ),
                          'COMMUNITIES'
                      ]
                    : [{ type: 'COMMUNITIES', id: 'LIST' }]
        }),
        getCommunityPostRecommendations: builder.query<
            GetCommunityPostRecommendationResponse,
            { slug: string }
        >({
            query: ({ slug }: { slug: string }) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}recommendations/communities/${slug}/`
            })
        })
    })
});

export const {
    useGetSubjectCategoriesQuery,
    useGetPublicSubjectCategoriesQuery,
    useGetCommunityNotificationQuery,
    usePostQuestionAnswerMutation,
    useGetCommunityPostQuery,
    useGetPublicCommunityPostQuery,
    useGetMyQuestionListQuery,
    useGetExploreQuestionQuery,
    useGetPublicExploreQuestionQuery,
    useGetCommunityPostDetailQuery,
    useGetPublicCommunityPostDetailQuery,
    useGetCommunityPostCommentDetailQuery,
    useLazyGetCommunityPostQuery
} = komunitasApi;

export const {
    getPublicCommunityPost,
    getPublicCommunityPostDetail,
    getCommunityPostCommentDetail,
    getCommunityPostRecommendations
} = komunitasApi.endpoints;
