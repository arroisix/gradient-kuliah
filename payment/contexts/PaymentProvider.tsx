import React, {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState
} from 'react';
import { useGetDetailPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { sendGTMEvent } from '@next/third-parties/google';

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
    cardId?: string;
    setCardId: (data?: string) => void;
}

const PaymentContext = createContext<PaymentContextType>(
    {} as PaymentContextType
);

export function PaymentProvider({
    children,
    packetId
}: {
    children: ReactNode;
    packetId: string;
}): JSX.Element {
    const [isModalCheckoutOpen, setModalCheckoutOpen] =
        useState<boolean>(false);
    const { data: packet } = useGetDetailPacketOfferQuery(packetId);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VA_BCA');
    const [cardId, setCardId] = useState<string | undefined>();
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [phoneNumberError, setPhoneNumberError] = useState<string>('');
    const [appliedPromo, setAppliedPromo] = useState<
        ValidatePromoResponse | undefined
    >(undefined);

    const selectPaymentMethod = (to: PaymentMethod): void => {
        if (paymentMethod === 'ID_OVO') {
            setPhoneNumber('');
            setPhoneNumberError('');
        }

        if (paymentMethod === 'VOUCHER') {
            setAppliedPromo(undefined);
        }

        if (paymentMethod.startsWith('CARD_')) {
            setCardId(undefined);
        }

        setPaymentMethod(to);
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
    };

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
            cardId,
            setCardId
        }),
        [
            isModalCheckoutOpen,
            packet,
            paymentMethod,
            selectPaymentMethod,
            phoneNumber,
            phoneNumberError,
            appliedPromo,
            cardId
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
