import { baseApi } from 'redux/api/baseApi';

const TRANSACTION_BASE_URL = 'financials/';

export const transactionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTransaction: builder.query<ResponseData<Transaction>, void>({
            query: () => ({
                url: `${TRANSACTION_BASE_URL}transaction/`
            }),
            providesTags: [{ type: 'TRANSACTION', id: 'LIST' }]
        }),
        getTransaction: builder.query<Transaction, string>({
            query: (id: string) => ({
                url: `${TRANSACTION_BASE_URL}transaction/${id}`
            }),
            providesTags: (transaction) => [
                { type: 'TRANSACTION', id: transaction?.id }
            ]
        }),
        getAllPaymentMethods: builder.query<
            ResponseData<PaymentMethodSection>,
            void
        >({
            query: () => ({
                url: `${TRANSACTION_BASE_URL}payment-methods/`
            })
        }),
        getAllUserCards: builder.query<CreditCardListResponse, void>({
            query: () => ({
                url: `${TRANSACTION_BASE_URL}user-cards/`
            }),
            providesTags: [{ type: 'USER_CARDS', id: 'LIST' }]
        }),
        getUserCard: builder.query<CreditCard, string>({
            query: (id: string) => ({
                url: `${TRANSACTION_BASE_URL}user-cards/${id}`
            })
        }),
        addUserCard: builder.mutation<CreditCard, AddCardRequestData>({
            query: (body) => ({
                url: `${TRANSACTION_BASE_URL}user-cards/`,
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'USER_CARDS', id: 'LIST' }]
        }),
        deleteUserCard: builder.mutation<CreditCard, string>({
            query: (id: string) => ({
                url: `${TRANSACTION_BASE_URL}user-cards/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'USER_CARDS', id: 'LIST' }]
        }),
        checkUserCardNameAvailability: builder.query<
            boolean,
            { card_name: string }
        >({
            query: (params) => ({
                url: `${TRANSACTION_BASE_URL}user-cards/availability/`,
                method: 'HEAD',
                validateStatus: (response) =>
                    response.status === 204 || response.status === 409,
                responseHandler: (response) => Promise.resolve(response.status),
                params
            }),
            transformResponse: (status: number) => {
                return status === 204;
            }
        })
    })
});

export const {
    useGetAllTransactionQuery,
    useGetTransactionQuery,
    useGetAllPaymentMethodsQuery,
    useGetAllUserCardsQuery,
    useGetUserCardQuery,
    useAddUserCardMutation,
    useDeleteUserCardMutation,
    useLazyCheckUserCardNameAvailabilityQuery
} = transactionApi;
