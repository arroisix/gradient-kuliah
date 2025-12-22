import { baseApi } from 'redux/api/baseApi';

const SUBSCRIPTION_BASE_URL = 'subscriptions/';

async function utbkLanggananStub(): Promise<{ data: PacketOfferUTBK[] }> {
    return await new Promise((resolve) => {
        const data = {
            data: [
                {
                    id: 'random1',
                    packet_name: '1 Bulan Hanya Try Out',
                    price: 39000.0,
                    is_free: false,
                    benefits: {
                        subtitle: 'Paket latihan saja.',
                        try_out_count: 4,
                        try_out_discussion: true,
                        copilot: true,
                        subtest_material: false
                    },
                    order: 0,
                    active_duration: 30
                },
                {
                    id: 'random2',
                    packet_name: '3 Bulan Hanya Try Out',
                    price: 99000.0,
                    is_free: false,
                    benefits: {
                        subtitle: 'Paket latihan saja.',
                        try_out_count: 12,
                        try_out_discussion: true,
                        copilot: true,
                        subtest_material: false
                    },
                    order: 1,
                    active_duration: 90
                },
                {
                    id: 'random3',
                    packet_name: 'Full Access',
                    price: 79000.0,
                    is_free: false,
                    benefits: {
                        subtitle: 'Paket komplit materi + latihan.',
                        try_out_count: 4,
                        try_out_discussion: true,
                        copilot: true,
                        subtest_material: true
                    },
                    order: 2,
                    active_duration: 30
                },
                {
                    id: 'random4',
                    packet_name: 'Full Access',
                    price: 199000.0,
                    is_free: false,
                    benefits: {
                        subtitle: 'Paket komplit materi + latihan.',
                        try_out_count: 4,
                        try_out_discussion: true,
                        copilot: true,
                        subtest_material: true,
                        best_value: true
                    },
                    order: 3,
                    active_duration: 90
                }
            ]
        };
        resolve(data);
    });
}

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
        getActiveSubscription: builder.query<ActivePacket, void>({
            query: () => ({
                url: `${SUBSCRIPTION_BASE_URL}active-packet/`
            })
        }),
        getPacketOffer: builder.query<ResponseData<PacketOffer>, void>({
            query: () => ({
                url: `${SUBSCRIPTION_BASE_URL}packet-offer/`
            })
        }),
        getPacketOfferUTBK: builder.query<ResponseData<PacketOfferUTBK>, void>({
            queryFn: async () => {
                return { data: await utbkLanggananStub() };
            }
        }),
        getDetailPacketOffer: builder.query<PacketOffer, string>({
            query: (packet_id: string) => ({
                url: `${SUBSCRIPTION_BASE_URL}packet-detail/${packet_id}/`
            })
        }),
        getActiveSubscriptionBySlug: builder.query<Subscription, string>({
            query: (slug: string) => ({
                url: `${SUBSCRIPTION_BASE_URL}active-subscription-by-slug/${slug}`
            })
        }),
        completeCardCheckout: builder.mutation<
            { status: string },
            CompleteCardCheckoutInputData
        >({
            query: (body) => ({
                url: `${SUBSCRIPTION_BASE_URL}complete-card-checkout/`,
                method: 'POST',
                body
            })
        })
    })
});

export const {
    useCheckoutMutation,
    useGetOnePacketOneCourseQuery,
    useFreeCheckoutMutation,
    useGetActiveSubscriptionQuery,
    useGetOneCourseManyPacketQuery,
    useExtendCheckoutMutation,
    useGetDetailPacketOfferQuery,
    useGetPacketOfferQuery,
    useCompleteCardCheckoutMutation,
    useGetPacketOfferUTBKQuery
} = subscriptionApi;
