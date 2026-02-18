import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useGetDetailPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { sendGTMEvent } from '@next/third-parties/google';
import { useRouter } from 'next/router';

interface PaymentContextType {
    isModalCheckoutOpen: boolean;
    setModalCheckoutOpen: (status: boolean) => void;
    packet?: PacketOffer;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
    phoneNumber?: string;
    setPhoneNumber: (number: string) => void;
    phoneNumberError?: string;
    setPhoneNumberError: (isError: string) => void;
    appliedPromo?: ValidatePromoResponse;
    setAppliedPromo: (data?: ValidatePromoResponse) => void;
    promoAppliedManually: boolean;
    setPromoAppliedManually: (x: boolean) => void;
    cardId?: string;
    setCardId: (data?: string) => void;
    tempCard?: CreditCard;
    setTempCard: (data?: CreditCard) => void;
    topupAmount: number;
    setTopupAmount: (amount: number) => void;
}

const PaymentContext = createContext<PaymentContextType>(
    {} as PaymentContextType
);

export function PaymentProvider({
    children,
    packetId
}: {
    children: ReactNode;
    packetId?: string;
}): JSX.Element {
    const [isModalCheckoutOpen, setModalCheckoutOpen] =
        useState<boolean>(false);
    const { data: packet } = useGetDetailPacketOfferQuery(packetId as string, {
        skip: !packetId
    });
    const router = useRouter();
    const { amount } = router.query;
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VA_BCA');
    const [cardId, setCardId] = useState<string | undefined>();
    const [tempCard, setTempCard] = useState<CreditCard | undefined>();
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [phoneNumberError, setPhoneNumberError] = useState<string>('');
    const [topupAmount, setTopupAmount] = useState<number>(0);
    const [appliedPromo, setAppliedPromo] = useState<
        ValidatePromoResponse | undefined
    >(undefined);
    const [promoAppliedManually, setPromoAppliedManually] = useState(false);

    const selectPaymentMethod = (to: PaymentMethod): void => {
        if (paymentMethod === 'ID_OVO') {
            setPhoneNumber('');
            setPhoneNumberError('');
        }

        if (paymentMethod === 'VOUCHER') {
            setAppliedPromo(undefined);
        }

        if (
            to === 'VOUCHER' &&
            appliedPromo &&
            appliedPromo.promo_type != 'OFFLINE VOUCHER'
        ) {
            setAppliedPromo(undefined);
        }

        if (paymentMethod.startsWith('CARD_')) {
            setCardId(undefined);
        }

        setPaymentMethod(to);
        if (packetId) {
            sendGTMEvent({
                event: 'add_payment_info',
                ecommerce: {
                    currency: 'IDR',
                    value: parseInt(packet?.price ?? ''),
                    payment_type: to,
                    items: [
                        {
                            item_id: packet?.packet_name,
                            price: parseInt(packet?.price ?? '')
                        }
                    ]
                }
            });
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem('tempCard');
        if (stored) {
            try {
                const temp: CreditCard = JSON.parse(stored);
                setTempCard(temp);
                selectPaymentMethod(
                    `CARD_${temp.brand.toUpperCase()}` as PaymentMethod
                );
                setCardId(temp.id);
            } catch {
                // invalid JSON, skip
            } finally {
                localStorage.removeItem('tempCard');
            }
        }
    }, []);

    useEffect(() => {
        if (amount) {
            const numericAmount = parseInt(amount as string, 10);
            if (!isNaN(numericAmount)) {
                setTopupAmount(numericAmount);
            }
        }
    }, [amount]);

    const memoedValue = useMemo(
        () => ({
            isModalCheckoutOpen,
            setModalCheckoutOpen,
            packet,
            paymentMethod,
            setPaymentMethod: selectPaymentMethod,
            phoneNumber,
            setPhoneNumber,
            phoneNumberError,
            setPhoneNumberError,
            appliedPromo,
            setAppliedPromo,
            promoAppliedManually,
            setPromoAppliedManually,
            cardId,
            setCardId,
            tempCard,
            setTempCard,
            topupAmount,
            setTopupAmount
        }),
        [
            isModalCheckoutOpen,
            packet,
            paymentMethod,
            phoneNumber,
            phoneNumberError,
            appliedPromo,
            promoAppliedManually,
            cardId,
            tempCard,
            topupAmount
        ]
    );

    return (
        <PaymentContext.Provider value={memoedValue}>
            {children}
        </PaymentContext.Provider>
    );
}

export const usePayment = (): PaymentContextType => {
    return useContext(PaymentContext);
};

export default PaymentContext;
