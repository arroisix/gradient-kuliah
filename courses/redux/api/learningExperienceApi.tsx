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
        }),
        getLearningProgress: builder.query<LearningProgress, string>({
            query: (slug: string) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}learning-progress/${slug}/`
            }),
            providesTags: ['WATCH_PROGRESS']
        }),
        trackSubchapterProgress: builder.mutation<
            SubchapterProgress,
            TrackSubchapterProgressInputData
        >({
            query: (data: TrackSubchapterProgressInputData) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}track-subchapter/`,
                method: 'POST',
                body: {
                    ...data
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'WATCH_PROGRESS', id: arg.video_progress?.video_id },
                { type: 'WATCH_PROGRESS', id: 'LIST' }
            ]
        }),
        getExamExerciseWorksheet: builder.query<
            ExamWorksheet,
            ExamWorksheetInputData
        >({
            query: (data: ExamWorksheetInputData) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}exam-exercise/worksheet/${data.packet_id}/${data.learning_progress_id}/${data.exercise_id}/`
            })
        }),
        getExamQuestion: builder.query<
            ExamQuestionResponse,
            ExamQuestionInputData
        >({
            query: (data: ExamQuestionInputData) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}exam-exercise/question/${data.exercise_id}/${data.worksheet_id}/${data.question_id}/`
            })
        }),
        getExamListQuestionSequence: builder.query<
            ListQuestionSequenceResponse,
            { worksheetId: string; exerciseId: string }
        >({
            query: ({
                worksheetId,
                exerciseId
            }: {
                worksheetId: string;
                exerciseId: string;
            }) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}exam-exercise/list-question/${exerciseId}/${worksheetId}/`
            }),
            providesTags: ['EXAM_QUESTION']
        }),
        submitExamAnswer: builder.mutation<
            ExamAnswerResponse,
            ExamAnswerInputData
        >({
            query: (data: ExamAnswerInputData) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}exam-exercise/submit-answer/`,
                method: 'POST',
                body: {
                    ...data
                }
            }),
            invalidatesTags: ['EXAM_QUESTION']
        }),
        finishExam: builder.mutation<FinishExamResponse, string>({
            query: (worksheetId: string) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}exam-exercise/finish-exam/${worksheetId}/`,
                method: 'POST'
            }),
            invalidatesTags: ['EXAM_QUESTION']
        }),
        getCodingProgress: builder.query<
            CodingProgress,
            GetCodingProgressInputData
        >({
            query: ({
                watch_progress_id,
                code_editor_id
            }: GetCodingProgressInputData) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}coding-progress/${watch_progress_id}/${code_editor_id}/`
            }),
            providesTags: ['CODING_PROGRESS']
        }),
        trackCodingProgress: builder.mutation<
            string,
            TrackCodingProgressInputData
        >({
            query: (data: TrackCodingProgressInputData) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}coding-progress/`,
                method: 'POST',
                body: {
                    ...data
                }
            }),
            invalidatesTags: ['CODING_PROGRESS']
        }),
        getBookRecommendations: builder.query<
            GetBookRecommendationResponse,
            GetBookRecommendationRequest
        >({
            query: (params: GetBookRecommendationRequest) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}recommendations/${params.category}/${params.slug}/`,
                params: { astronotes_only: params.astronotes_only }
            })
        }),
        getVideoRecommendations: builder.query<
            GetVideoRecommendationResponse,
            { slug: string }
        >({
            query: ({ slug }: { slug: string }) => ({
                url: `${LEARNING_EXPERIENCE_BASE_URL}recommendations/videos/${slug}/`
            })
        })
    }),
    overrideExisting: false
});

export const {
    usePostAnswerMutation,
    usePostQuestionMutation,
    useListPostAnswerQuery,
    useLazyListPostAnswerQuery,
    useListPostQuestionQuery,
    useLazyListPostQuestionQuery,
    useGetLearningProgressQuery,
    useTrackSubchapterProgressMutation,
    useGetExamExerciseWorksheetQuery,
    useGetExamQuestionQuery,
    useGetExamListQuestionSequenceQuery,
    useSubmitExamAnswerMutation,
    useFinishExamMutation,
    useGetCodingProgressQuery,
    useTrackCodingProgressMutation,
    useGetBookRecommendationsQuery,
    useGetVideoRecommendationsQuery
} = learningExperienceApi;

export const { getBookRecommendations } = learningExperienceApi.endpoints;
