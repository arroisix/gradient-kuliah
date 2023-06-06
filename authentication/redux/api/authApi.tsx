import { baseApi } from 'redux/api/baseApi';

const AUTH_BASE_URL = 'identities/';
const STUDENT_BASE_URL = 'students/';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponseData, AuthInputData>({
            query: (data: AuthInputData) => ({
                url: `${AUTH_BASE_URL}login/`,
                method: 'POST',
                body: data
            })
        }),
        socialLogin: builder.mutation<LoginResponseData, SocialAuthInputData>({
            query: (data: SocialAuthInputData) => ({
                url: `${AUTH_BASE_URL}social/${data.provider}/`,
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation<LoginResponseData, AuthInputData>({
            query: (data: AuthInputData) => ({
                url: `${AUTH_BASE_URL}register/`,
                method: 'POST',
                body: data
            })
        }),
        updateUser: builder.mutation<LoginResponseData, UpdateUserInputData>({
            query: (data: UpdateUserInputData) => ({
                url: `${STUDENT_BASE_URL}onboarding/`,
                method: 'PUT',
                body: data
            })
        }),
        getRegisterReference: builder.query<
            { data: RegisterReference[] },
            Record<string, never>
        >({
            query: () => ({
                url: `${STUDENT_BASE_URL}register-references/`
            })
        }),
        getProfile: builder.query<ProfileData, Record<string, never>>({
            query: () => ({
                url: `${STUDENT_BASE_URL}profile/`
            })
        })
    })
});

export const {
    useLoginMutation,
    useSocialLoginMutation,
    useRegisterMutation,
    useUpdateUserMutation,
    useGetRegisterReferenceQuery,
    useGetProfileQuery
} = authApi;
