import { baseApi } from 'redux/api/baseApi';

const AUTH_BASE_URL = 'identities/';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponseData, LoginInputData>({
            query: (data: LoginInputData) => ({
                url: `${AUTH_BASE_URL}login/`,
                method: 'POST',
                body: data
            })
        }),
        socialLogin: builder.mutation<LoginResponseData, SocialLoginInputData>({
            query: (data: SocialLoginInputData) => ({
                url: `${AUTH_BASE_URL}social/${data.provider}/`,
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation<LoginResponseData, RegisterInputData>({
            query: (data: RegisterInputData) => ({
                url: `${AUTH_BASE_URL}register/`,
                method: 'POST',
                body: data
            })
        }),
        updateUser: builder.mutation<User, UpdateUserInputData>({
            query: (data: UpdateUserInputData) => ({
                url: `${AUTH_BASE_URL}user-update/`,
                method: 'PUT',
                body: data
            })
        })
    })
});

export const {
    useLoginMutation,
    useSocialLoginMutation,
    useRegisterMutation,
    useUpdateUserMutation
} = authApi;
