import React, {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState
} from 'react';
import { useGetDetailPacketOfferQuery } from 'payment/redux/api/subscriptionApi';

interface PaymentContextType {
    isModalCheckoutOpen: boolean;
    setModalCheckoutOpen: (status: boolean) => void;
    packet?: PacketOffer;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
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
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VA_BNI');

    const memoedValue = useMemo(
        () => ({
            isModalCheckoutOpen,
            setModalCheckoutOpen,
            packet,
            paymentMethod,
            setPaymentMethod
        }),
        [isModalCheckoutOpen, packet, paymentMethod]
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
