import { baseApi } from 'redux/api/baseApi';

const KOMUNITAS_BASE_URL = 'communities/';

export const komunitasApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubjectCategories: builder.query<SubjectCategoriesResponse, void>({
            query: () => ({ url: `${KOMUNITAS_BASE_URL}subject-category/` })
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
            })
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
            })
        }),
        getMyQuestionList: builder.query<
            MyQuestionListResponse,
            { user_id: string }
        >({
            query: ({ user_id }) => ({
                url: `${KOMUNITAS_BASE_URL}post/list/${user_id}/`
            })
        }),
        getExploreQuestion: builder.query<
            ExploreQuestionResponse,
            { category_id?: string }
        >({
            query: ({ category_id }) => ({
                url: `${KOMUNITAS_BASE_URL}post/list/`,
                params: { category_id }
            })
        }),
        getCommunityPostDetail: builder.query<
            CommunityPostDetailResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${KOMUNITAS_BASE_URL}post/${slug}/`
            })
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
            })
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
    useGetCommunityPostCommentDetailQuery
} = komunitasApi;
