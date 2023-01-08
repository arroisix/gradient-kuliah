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
        })
    }),
    overrideExisting: false
});

export const { useUploadFileMutation } = commonApi;
