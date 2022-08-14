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
        }),
        freeCheckout: builder.mutation<
            string,
            Omit<CheckoutInputData, 'payment_method'>
        >({
            query: (data: Omit<CheckoutInputData, 'payment_method'>) => ({
                url: `${SUBSCRIPTION_BASE_URL}checkout-free-packet/`,
                method: 'POST',
                body: data
            })
        })
    })
});

export const {
    useCheckoutMutation,
    useGetOnePacketOneCourseQuery,
    useFreeCheckoutMutation
} = subscriptionApi;
