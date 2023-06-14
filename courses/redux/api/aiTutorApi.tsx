import { baseApi } from 'redux/api/baseApi';

const AI_TUTOR_BASE_URL = 'ai-tutor/';

export const aiTutorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChatRoom: builder.query<ChatRoomResponse, string>({
            query: (videoId: string) => ({
                url: `${AI_TUTOR_BASE_URL}video-chat-room/${videoId}/`
            }),
            providesTags: ['AI_TUTOR']
        }),
        askTutor: builder.mutation<TutorAnswerResponse, AskTutorInput>({
            query: (body: AskTutorInput) => ({
                url: `${AI_TUTOR_BASE_URL}ask-tutor/`,
                body,
                method: 'POST'
            }),
            invalidatesTags: ['AI_TUTOR']
        })
    })
});

export const { useAskTutorMutation, useGetChatRoomQuery } = aiTutorApi;
