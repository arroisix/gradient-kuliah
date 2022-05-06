type PaymentMethod = 'VA_BNI' | 'VA_MANDIRI' | 'VA_BCA' | 'VA_BRI' | 'QRIS';

type Subscription = {
    id: string;
    subscriber: User;
    subscribed_packet: Packet;
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
