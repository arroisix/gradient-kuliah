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
        logout: builder.mutation<void, void>({
            query: () => ({
                url: `${AUTH_BASE_URL}logout/`,
                method: 'POST'
            })
        }),
        updateUser: builder.mutation<
            UpdateUserResponseData,
            UpdateUserInputData
        >({
            query: (data: UpdateUserInputData) => ({
                url: `${STUDENT_BASE_URL}new-update-profile/`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['PROFILE']
        }),
        getRegisterReference: builder.query<
            { data: RegisterReference[] },
            Record<string, never>
        >({
            query: () => ({
                url: `${STUDENT_BASE_URL}register-references/`
            })
        }),
        getProfile: builder.query<
            UpdateUserResponseData,
            Record<string, never>
        >({
            query: () => ({
                url: `${STUDENT_BASE_URL}profile/`
            }),
            providesTags: ['PROFILE']
        }),
        checkUsernameAvailability: builder.mutation<
            CheckUsernameAvailabilityResponseData,
            CheckUsernameAvailabilityInputData
        >({
            query: (data: CheckUsernameAvailabilityInputData) => ({
                url: `${STUDENT_BASE_URL}check-username-availability/`,
                method: 'POST',
                body: data
            })
        }),
        passwordResetValidateToken: builder.mutation<
            { status: string },
            { token: string }
        >({
            query: (body) => ({
                url: `${AUTH_BASE_URL}password-reset/validate-token/`,
                method: 'POST',
                body
            })
        }),
        passwordResetConfirm: builder.mutation<
            { status: string },
            { token: string; password: string }
        >({
            query: (body) => ({
                url: `${AUTH_BASE_URL}password-reset/confirm/`,
                method: 'POST',
                body
            })
        }),
        passwordReset: builder.mutation<{ status: string }, { email: string }>({
            query: (body) => ({
                url: `${AUTH_BASE_URL}password-reset/`,
                method: 'POST',
                body
            })
        }),
        removeOtherDevice: builder.mutation<void, void>({
            query: () => ({
                url: `${AUTH_BASE_URL}remove-other-devices/`,
                method: 'POST'
            }),
            invalidatesTags: ['PROFILE', 'CONNECTED_DEVICES']
        }),
        getDeviceTypes: builder.query<DeviceTypeResponse[], void>({
            query: () => ({
                url: `${AUTH_BASE_URL}device-types/`
            })
        }),
        getConnectedDevices: builder.query<UserDeviceResponse[], void>({
            query: () => ({
                url: `${AUTH_BASE_URL}connected-devices/`
            }),
            providesTags: ['CONNECTED_DEVICES']
        }),
        getCurrentConnectedDevice: builder.query<UserDeviceResponse, void>({
            query: () => ({
                url: `${AUTH_BASE_URL}connected-devices/current/`
            }),
            providesTags: (result) => [
                { type: 'CONNECTED_DEVICES', id: result?.id }
            ]
        }),
        getStudentRecommendation: builder.query<
            RecommendationResponse[],
            { fieldName: string; input: string }
        >({
            query: ({ fieldName, input }) => ({
                url: `students/recommendation/${fieldName}`,
                params: { name: input }
            }),
            transformResponse: (resp: { data: RecommendationResponse[] }) =>
                resp.data
        })
    })
});

export const {
    useLoginMutation,
    useSocialLoginMutation,
    useRegisterMutation,
    useUpdateUserMutation,
    useGetRegisterReferenceQuery,
    useGetProfileQuery,
    useCheckUsernameAvailabilityMutation,
    usePasswordResetValidateTokenMutation,
    usePasswordResetConfirmMutation,
    usePasswordResetMutation,
    useRemoveOtherDeviceMutation,
    useLogoutMutation,
    useGetConnectedDevicesQuery,
    useGetDeviceTypesQuery,
    useGetCurrentConnectedDeviceQuery,
    useGetStudentRecommendationQuery
} = authApi;
