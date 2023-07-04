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
                              ({ id }) => ({ type: 'COMMUNITIES', id } as const)
                          ),
                          { type: 'COMMUNITIES', id: 'LIST' },
                          'COMMUNITIES'
                      ]
                    : [{ type: 'COMMUNITIES', id: 'LIST' }]
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
            { category_id?: string }
        >({
            query: ({ category_id }) => ({
                url: `${KOMUNITAS_BASE_URL}post/list/`,
                params: { category_id }
            }),
            providesTags: [{ type: 'COMMUNITIES', id: 'LIST' }]
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
            providesTags: (result, error, arg) =>
                result
                    ? [
                          ...result.comments.map(
                              () =>
                                  ({
                                      type: 'COMMUNITIES',
                                      id: arg.post_id
                                  } as const)
                          ),
                          ...result.comments.map(
                              (value) =>
                                  ({
                                      type: 'COMMUNITIES',
                                      id: value.id
                                  } as const)
                          ),
                          'COMMUNITIES'
                      ]
                    : [{ type: 'COMMUNITIES', id: 'LIST' }]
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
