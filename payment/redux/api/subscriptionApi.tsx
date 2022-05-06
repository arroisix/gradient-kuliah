import { baseApi } from 'redux/api/baseApi';

const SUBSCRIPTION_BASE_URL = 'subscriptions/';

export const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        checkout: builder.mutation<Transaction, CheckoutInputData>({
            query: (data: CheckoutInputData) => ({
                url: `${SUBSCRIPTION_BASE_URL}checkout/`,
                method: 'POST',
                body: data
            })
        }),
        getOnePacketOneCourse: builder.query<Packet, string>({
            query: (packetId: string) => ({
                url: `${SUBSCRIPTION_BASE_URL}one-packet-one-course/${packetId}`
            })
        })
    })
});

export const { useCheckoutMutation, useGetOnePacketOneCourseQuery } =
    subscriptionApi;
