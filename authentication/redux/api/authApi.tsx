import { baseApi } from 'redux/api/baseApi';

const AUTH_BASE_URL = 'identities/';
const STUDENT_BASE_URL = 'students/';

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
        })
    })
});

export const {
    useLoginMutation,
    useSocialLoginMutation,
    useRegisterMutation,
    useUpdateUserMutation,
    useGetRegisterReferenceQuery
} = authApi;
