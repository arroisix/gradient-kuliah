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
    phoneNumberError: boolean;
    setPhoneNumberError: (isError: boolean) => void;
    promoCode?: string;
    setPromoCode: (code: string) => void;
    appliedPromoData?: ValidatePromoResponse;
    setAppliedPromoData: (data: ValidatePromoResponse) => void;
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
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
    const [promoCode, setPromoCode] = useState<string>('');
    const [appliedPromoData, setAppliedPromoData] =
        useState<ValidatePromoResponse>();

    const selectPaymentMethod = (to: PaymentMethod): void => {
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
            promoCode,
            setPromoCode,
            appliedPromoData,
            setAppliedPromoData
        }),
        [
            isModalCheckoutOpen,
            packet,
            paymentMethod,
            phoneNumber,
            phoneNumberError,
            promoCode,
            appliedPromoData
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
