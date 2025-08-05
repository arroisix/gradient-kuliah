type PaymentMethod =
    | PaymentMethodVirtualAccount
    | PaymentMethodEwallet
    | PaymentMethodOutlet
    | 'QRIS'
    | 'VOUCHER'
    | 'OTHER'
    | 'FREE';

type PaymentMethodVirtualAccount =
    | 'VA_BNI'
    | 'VA_MANDIRI'
    | 'VA_BCA'
    | 'VA_BRI'
    | 'VA_BSI'
    | 'VA_BJB'
    | 'VA_PERMATA';

type PaymentMethodEwallet =
    | 'GOPAY'
    | 'ID_DANA'
    | 'ID_SHOPEEPAY'
    | 'ID_OVO'
    | 'ID_LINKAJA';
type PaymentMethodOutlet = 'ALFAMART' | 'INDOMARET';

type Subscription = {
    id: string;
    subscriber: User;
    subscribed_packet: Packet;
    active_from: string | Date;
    deactivate_after: string | Date;
};

type ActivePacket = {
    packet_id: string;
    subscription_id: string;
    active_from: string | Date;
    deactivate_after: string | Date;
    is_all_courses: boolean;
    courses: string[];
    is_all_features: boolean;
    features: string[];
};

type PacketFeature = {
    title: string;
    description: string;
};

type PacketOffer = {
    id: string;
    is_free: boolean;
    packet_name: string;
    active_duration: number;
    is_lifetime: boolean;
    price: string;
    price_before_discount: string;
    discount: string;
    order: number;
    benefits: {
        data: string[];
        info: string;
        feature: PacketFeature[];
    };
};

type TransactionPromo = {
    id: string;
    code: string;
    promo_type: string;
};

type Transaction = {
    created_at: string | Date;
    id: string;
    status: string;
    amount: string;
    va_number: string;
    deadline: string | Date;
    payment_method: PaymentMethod;
    subscriber: Subscription;
    payment_amount: number;
    discount_amount: number;
    promo_code: string;
    qr_string: string;
    ewallet_actions: {
        desktop_web_checkout_url: string | null;
        mobile_web_checkout_url: string | null;
        mobile_deeplink_checkout_url: string | null;
        qr_checkout_string: string | null;
    } | null;
    payment_code: string;
    user_card_id?: string;
    charge_id?: string;
    promo?: TransactionPromo;
};

interface CheckoutInputData {
    packet_id: string;
    payment_method: PaymentMethod;
    phone_number?: string;
    promo_code?: string | null;
    user_card_id?: string;
}

interface OneCourseManyPacketQuery {
    course_id: string;
    add_to_cart?: boolean;
}

type GuideContent = {
    [key: string]: {
        method: string[];
        step: {
            asset: string;
            description: string;
        }[][];
    };
};

interface PaymentMethodData {
    id: string; // UUID
    payment_name: string;
    payment_code: PaymentMethod;
    type: string;
    order: number;
    mobile_logo: string | null;
    desktop_logo: string | null;
}

interface PaymentMethodSection {
    key: string;
    name: string;
    order: number;
    payment_methods: PaymentMethodData[];
}

type CreditCard = {
    id: string;
    name: string;
    brand: string;
    card_token?: string;
    needs_refresh: boolean;
    created_at: Date;
    updated_at: Date;
};

interface CreditCardListResponse {
    cards: CreditCard[];
    count: number;
}

interface CompleteCardCheckoutInputData {
    transaction_id: string;
    authentication_id: string;
    user_card_token?: string;
}

interface AddCardRequestData {
    name?: string;
    brand: string;
    card_token: string;
}

interface CreditCardTokenizeData {
    card_number: string;
    card_exp_month: string;
    card_exp_year: string;
    card_cvn: string;
    card_holder_first_name: string;
    card_holder_last_name: string;
    card_holder_email: string;
    card_holder_phone_number: string;
}

interface EditCardRequestData {
    name?: string;
    brand?: string;
    card_token?: string;
}
