import { baseApi } from 'redux/api/baseApi';

const REFERAL_BASE_URL = 'promos/';

export const referalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReferral: builder.query<GetReferralResponse, void>({
            query: () => ({ url: `${REFERAL_BASE_URL}referral/` })
        }),
        getVoucher: builder.query<GetVoucherResponse, BaseListQueryParams>({
            query: (params) => ({ url: `${REFERAL_BASE_URL}voucher/`, params }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems) => {
                currentCache.vouchers.push(...newItems.vouchers);
                currentCache.next_page = newItems.next_page;
                currentCache.previous_page = newItems.previous_page;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            }
        }),
        getReferee: builder.query<GetRefereeResponse, BaseListQueryParams>({
            query: (params) => ({
                url: `${REFERAL_BASE_URL}referees/`,
                params
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems) => {
                currentCache.referees.push(...newItems.referees);
                currentCache.next_page = newItems.next_page;
                currentCache.previous_page = newItems.previous_page;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            }
        }),
        validatePromo: builder.mutation<
            ValidatePromoResponse,
            {
                promo_code: string;
                packet_id: string;
            }
        >({
            query: (body) => ({
                url: `${REFERAL_BASE_URL}validate/`,
                method: 'POST',
                body
            })
        }),
        getAllCoupons: builder.query<
            GetCouponsResponse,
            {
                packet_id: string;
            }
        >({
            query: (params) => ({
                url: `${REFERAL_BASE_URL}coupons/`,
                params
            })
        })
    })
});

export const {
    useGetReferralQuery,
    useGetVoucherQuery,
    useGetRefereeQuery,
    useValidatePromoMutation,
    useGetAllCouponsQuery
} = referalApi;
