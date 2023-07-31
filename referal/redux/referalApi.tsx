import { baseApi } from 'redux/api/baseApi';

const REFERAL_BASE_URL = 'promos/';

export const referalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReferral: builder.query<GetReferralResponse, void>({
            query: () => ({ url: `${REFERAL_BASE_URL}referral/` })
        }),
        getVoucher: builder.query<GetVoucherResponse, void>({
            query: () => ({ url: `${REFERAL_BASE_URL}voucher/` })
        }),
        getReferee: builder.query<GetRefereeResponse, void>({
            query: () => ({ url: `${REFERAL_BASE_URL}referee/` })
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
        })
    })
});

export const {
    useGetReferralQuery,
    useGetVoucherQuery,
    useGetRefereeQuery,
    useValidatePromoMutation
} = referalApi;
