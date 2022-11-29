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
        getOneCourseManyPacket: builder.query<
            ResponseData<Packet>,
            OneCourseManyPacketQuery
        >({
            query: (data: OneCourseManyPacketQuery) => ({
                url: `${SUBSCRIPTION_BASE_URL}one-course-many-packet/${data.course_id}`,
                params: {
                    add_to_cart: data.add_to_cart ?? false
                }
            })
        }),
        extendCheckout: builder.mutation<
            Transaction,
            { inputData: CheckoutInputData; subscriptionId: string }
        >({
            query: (data: {
                inputData: CheckoutInputData;
                subscriptionId: string;
            }) => ({
                url: `${SUBSCRIPTION_BASE_URL}extend-checkout/${data.subscriptionId}`,
                method: 'POST',
                body: data.inputData
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
        }),
        getActiveSubscription: builder.query<Subscription, string>({
            query: (course_id: string) => ({
                url: `${SUBSCRIPTION_BASE_URL}active-subscription/${course_id}`
            })
        }),
        getActiveSubscriptionBySlug: builder.query<Subscription, string>({
            query: (slug: string) => ({
                url: `${SUBSCRIPTION_BASE_URL}active-subscription-by-slug/${slug}`
            })
        })
    })
});

export const {
    useCheckoutMutation,
    useGetOnePacketOneCourseQuery,
    useFreeCheckoutMutation,
    useGetActiveSubscriptionQuery,
    useGetActiveSubscriptionBySlugQuery,
    useGetOneCourseManyPacketQuery,
    useExtendCheckoutMutation
} = subscriptionApi;
