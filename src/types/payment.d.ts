type PaymentMethod = 'VA_BNI' | 'VA_MANDIRI' | 'VA_BCA' | 'VA_BRI' | 'QRIS';

type Subscription = {
    id: string;
    subscriber: User;
    subscribedPacket: Packet;
};

type Transaction = {
    createdAt: string | Date;
    id: string;
    status: string;
    amount: string;
    vaNumber: string;
    deadline: string | Date;
    paymentMethod: PaymentMethod;
    subscriber: Subscription;
};
