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
        })
    }),
    overrideExisting: false
});

export const { useUploadFileMutation, useGetConfigQuery } = commonApi;
