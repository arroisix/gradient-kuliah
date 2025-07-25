interface GetReferralResponse {
    referral_code: string;
    voucher_count: number;
    referee_count: number;
    config: {
        voucher_cashback_amount: string;
        referral_instruction: string;
    };
}

interface Voucher {
    id: string;
    code: string;
    expired_at: timestamp;
    label: string;
}

interface GetVoucherResponse {
    vouchers: Voucher[];
    count_items: number;
    next_page: number | null;
    previous_page: number | null;
}

interface Referee {
    id: string;
    photo_url: string;
    full_name: string;
    referred_at: string;
}

interface GetRefereeResponse {
    referees: Referee[];
    count_items: number;
    next_page: number | null;
    previous_page: number | null;
}

interface ValidatePromoResponse {
    promo_id: string | null;
    promo_type: string | null;
    promo_code: string | null;
    packet_id: string | null;
    packet_name: string | null;
    is_valid: boolean;
    message: string;
    expired_at: datetime;
    amount: number;
    payment_amount: number;
    discount_amount: number;
    discount_amount_original: string;
}

interface CouponResponse {
    promo_id: string;
    promo_code: string;
    promo_type: string;
    special_campaign_type: string;
    expired_at: datetime | null;
    usage_count: number;
    max_usage: number;
    packet_name: string | null;
    packet_id: string | null;
    discount_amount_original: string;
    discount_amount: number;
    amount: number;
    payment_amount: number;
}

interface GetCouponsResponse {
    coupons: CouponResponse[];
    count: number;
}
