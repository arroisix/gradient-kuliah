import { baseApi } from 'redux/api/baseApi';

const LEARNING_EXPERIENCE_BASE_URL = 'learning-experiences/';

export const learningExperienceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        postQuestion: builder.mutation<QnaQuestion, QnaQuestionPostData>({
            query: ({ video_id, ...data }: QnaQuestionPostData) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}add-video-qna-question/${video_id}/`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: [{ type: 'QNA_QUESTION', id: 'LIST' }]
        }),
        postAnswer: builder.mutation<QnaAnswer, QnaAnswerPostData>({
            query: ({ question_id, ...data }: QnaAnswerPostData) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}add-video-qna-answer/${question_id}/`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, data) => [
                { type: 'QNA_ANSWER', id: 'LIST' },
                { type: 'QNA_QUESTION', id: data.question_id }
            ]
        }),
        listPostQuestion: builder.query<
            ListResponseData<QnaQuestion>,
            BaseListQueryParams & { video_id: string }
        >({
            query: ({
                video_id,
                ...params
            }: BaseListQueryParams & { video_id: string }) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}list-video-qna-question/${video_id}/`,
                params
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.data.map(
                              ({ id }) =>
                                  ({ type: 'QNA_QUESTION', id } as const)
                          ),
                          { type: 'QNA_QUESTION', id: 'LIST' }
                      ]
                    : [{ type: 'QNA_QUESTION', id: 'LIST' }]
        }),
        listPostAnswer: builder.query<
            ListResponseData<QnaAnswer>,
            BaseListQueryParams & { question_id: string }
        >({
            query: ({
                question_id,
                ...params
            }: BaseListQueryParams & { question_id: string }) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}list-video-qna-answer/${question_id}/`,
                params
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.data.map(
                              ({ id }) => ({ type: 'QNA_ANSWER', id } as const)
                          ),
                          { type: 'QNA_ANSWER', id: 'LIST' }
                      ]
                    : [{ type: 'QNA_ANSWER', id: 'LIST' }]
        })
    })
});

export const {
    usePostAnswerMutation,
    usePostQuestionMutation,
    useListPostAnswerQuery,
    useListPostQuestionQuery
} = learningExperienceApi;
