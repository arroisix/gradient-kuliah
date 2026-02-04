import { baseApi } from 'redux/api/baseApi';

const LIVE_CLASS_PUBLIC_BASE_URL = 'live-classes/public/';
const LIVE_CLASS_PRIVATE_BASE_URL = 'live-classes/private/';

export const liveClassApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getListLiveClassPublic: builder.query<
            ListResponseData<LiveClass>,
            BaseListQueryParams & { type?: '' | 'ongoing' }
        >({
            query: (params) => ({
                url: `${LIVE_CLASS_PUBLIC_BASE_URL}live-class/`,
                params
            })
        }),
        getListLiveClassPrivate: builder.query<
            ListResponseData<LiveClassAuthenticated>,
            BaseListQueryParams & { type?: '' | 'ongoing' }
        >({
            query: (params) => ({
                url: `${LIVE_CLASS_PRIVATE_BASE_URL}live-class/`,
                params
            })
        }),
        registerLiveClass: builder.mutation<
            { message: string },
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${LIVE_CLASS_PRIVATE_BASE_URL}register/`,
                method: 'POST',
                body: { slug }
            })
        }),
        unregisterLiveClass: builder.mutation<
            { message: string },
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${LIVE_CLASS_PRIVATE_BASE_URL}unregister/`,
                method: 'POST',
                body: { slug }
            })
        })
    })
});

export const {
    useGetListLiveClassPublicQuery,
    useGetListLiveClassPrivateQuery,
    useRegisterLiveClassMutation,
    useUnregisterLiveClassMutation
} = liveClassApi;