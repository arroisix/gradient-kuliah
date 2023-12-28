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
            providesTags: [{ type: 'TRANSACTION', id: 'DETAIL' }]
        })
    })
});

export const { useGetAllTransactionQuery, useGetTransactionQuery } =
    transactionApi;
