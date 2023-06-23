type PaymentMethod =
    | 'VA_BNI'
    | 'VA_MANDIRI'
    | 'VA_BCA'
    | 'VA_BRI'
    | 'VA_BSI'
    | 'VA_BJB'
    | 'VA_PERMATA'
    | 'QRIS';

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

type Transaction = {
    created_at: string | Date;
    id: string;
    status: string;
    amount: string;
    va_number: string;
    deadline: string | Date;
    payment_method: PaymentMethod;
    subscriber: Subscription;
};

interface CheckoutInputData {
    packet_id: string;
    payment_method: PaymentMethod;
    phone_number?: string;
}

interface OneCourseManyPacketQuery {
    course_id: string;
    add_to_cart?: boolean;
}
