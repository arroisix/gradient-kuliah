import { baseApi } from 'redux/api/baseApi';

const COMMONS_BASE_URL = 'commons/';

export const commonApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadFile: builder.mutation<
            ResponseData<UploadFileResponseData>,
            UploadFileInputData
        >({
            query: (data: UploadFileInputData) => ({
                url: `${COMMONS_BASE_URL}upload-file/`,
                body: data,
                method: 'POST'
            })
        }),
        getConfig: builder.query<ConfigResponse, void>({
            query: () => ({
                url: `${COMMONS_BASE_URL}config/`
            })
        }),
        getLearningTools: builder.query<LearningToolsResponse, void>({
            query: () => ({
                url: `${COMMONS_BASE_URL}learning-tools/`
            })
        }),
        getLearningToolsContent: builder.query<
            LearningToolsContentResponse,
            {
                page?: number;
                limit?: number;
                type?: 'all' | 'quiz' | 'flashcard';
            }
        >({
            query: (params) => ({
                url: `${COMMONS_BASE_URL}learning-tools/content/`,
                params
            })
        })
    }),
    overrideExisting: false
});

export const {
    useUploadFileMutation,
    useGetConfigQuery,
    useGetLearningToolsQuery,
    useGetLearningToolsContentQuery
} = commonApi;
