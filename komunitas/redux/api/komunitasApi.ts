import { baseApi } from 'redux/api/baseApi';

const KOMUNITAS_BASE_URL = 'communities/';

export const komunitasApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubjectCategories: builder.query<SubjectCategoriesResponse, void>({
            query: () => ({ url: `${KOMUNITAS_BASE_URL}subject-category/` })
        }),
        getCommunityNotification: builder.query<CommunityNotification, void>({
            query: () => ({ url: `${KOMUNITAS_BASE_URL}notification/` }),
            providesTags: ['COMMUNITIES']
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
            invalidatesTags: ['COMMUNITIES']
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
            serializeQueryArgs: ({ queryArgs, endpointName }) => {
                return endpointName + queryArgs.category_id + queryArgs.sort_by;
            },
            merge: (currentCache, newItems) => {
                currentCache.community_posts.push(...newItems.community_posts);
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
            providesTags: ['COMMUNITIES']
        }),
        getMyQuestionList: builder.query<
            MyQuestionListResponse,
            { user_id: string }
        >({
            query: ({ user_id }) => ({
                url: `${KOMUNITAS_BASE_URL}post/list/${user_id}/`
            }),
            providesTags: ['COMMUNITIES']
        }),
        getExploreQuestion: builder.query<
            ExploreQuestionResponse,
            { category_id?: string }
        >({
            query: ({ category_id }) => ({
                url: `${KOMUNITAS_BASE_URL}post/list/`,
                params: { category_id }
            }),
            providesTags: ['COMMUNITIES']
        }),
        getCommunityPostDetail: builder.query<
            CommunityPostDetailResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${KOMUNITAS_BASE_URL}post/${slug}/`
            }),
            providesTags: ['COMMUNITIES']
        }),
        getCommunityPostCommentDetail: builder.query<
            CommunityPostCommentDetailResponse & {
                count_items: number;
                next_page?: number;
                previous_page?: number;
            },
            BaseListQueryParams & { post_id: string }
        >({
            query: ({ post_id, ...params }) => ({
                url: `${KOMUNITAS_BASE_URL}post/${post_id}/comment/`,
                params
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems) => {
                currentCache.comments.push(...newItems.comments);
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
            providesTags: ['COMMUNITIES']
        })
    })
});

export const {
    useGetSubjectCategoriesQuery,
    useGetCommunityNotificationQuery,
    usePostQuestionAnswerMutation,
    useGetCommunityPostQuery,
    useGetMyQuestionListQuery,
    useGetExploreQuestionQuery,
    useGetCommunityPostDetailQuery,
    useGetCommunityPostCommentDetailQuery,
    useLazyGetCommunityPostQuery
} = komunitasApi;
