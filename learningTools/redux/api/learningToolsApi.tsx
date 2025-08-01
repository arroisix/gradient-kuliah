import { baseApi } from 'redux/api/baseApi';

const LEARNING_TOOLS_BASE_URL = 'learning-tools/';

export const learningToolsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getLearningTools: builder.query<LearningToolsResponse, void>({
            query: () => ({
                url: `${LEARNING_TOOLS_BASE_URL}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
        }),

        getLearningToolsContent: builder.query<
            LearningToolsContentResponse,
            {
                page?: number;
                limit?: number;
                type?: 'all' | 'quiz' | 'flashcard';
                sort?: 'latest' | 'popularity' | 'trending';
            }
        >({
            query: (params) => ({
                url: `${LEARNING_TOOLS_BASE_URL}content/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                params
            })
        }),

        // Public endpoints
        getPublicLearningTools: builder.query<LearningToolsResponse, void>({
            query: () => ({
                url: `${LEARNING_TOOLS_BASE_URL}public/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
        }),

        getPublicLearningToolsContent: builder.query<
            LearningToolsContentResponse,
            {
                page?: number;
                limit?: number;
                type?: 'all' | 'quiz' | 'flashcard';
                sort?: 'latest' | 'popularity' | 'trending';
            }
        >({
            query: (params) => ({
                url: `${LEARNING_TOOLS_BASE_URL}public/content/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                params
            })
        }),

        getDownloadDevices: builder.query<DevicesResponse, void>({
            query: () => ({
                url: `${LEARNING_TOOLS_BASE_URL}download/devices/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
        }),

        getDownloadHistory: builder.query<
            DownloadHistoryResponse,
            DownloadHistoryParams
        >({
            query: (params) => ({
                url: `${LEARNING_TOOLS_BASE_URL}download/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                params
            })
        })
    }),
    overrideExisting: false
});

export const {
    useGetLearningToolsQuery,
    useGetLearningToolsContentQuery,
    useGetPublicLearningToolsQuery,
    useGetPublicLearningToolsContentQuery,
    useGetDownloadDevicesQuery,
    useGetDownloadHistoryQuery
} = learningToolsApi;
