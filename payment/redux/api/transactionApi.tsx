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
            })
        })
    })
});

export const {
    useGetAllTransactionQuery,
    useGetTransactionQuery,
    useGetAllPaymentMethodsQuery,
    useGetAllUserCardsQuery
} = transactionApi;
