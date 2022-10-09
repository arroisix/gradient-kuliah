import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import usePacket from '../hooks/usePacket';

interface PaymentContextType {
    isModalCheckoutOpen: 1 | 0;
    setModalCheckoutOpen: (status: 1 | 0) => void;
    packet?: Packet;
    packets: Packet[];
    setPacket: (packet?: Packet) => void;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
}

const PaymentContext = createContext<PaymentContextType>(
    {} as PaymentContextType
);

export function PaymentProvider({
    children,
    courseId
}: {
    children: ReactNode;
    courseId: string;
}): JSX.Element {
    const [isModalCheckoutOpen, setModalCheckoutOpen] = useState<1 | 0>(0);
    const [packets, setPackets] = useState<Packet[]>([]);
    const [packet, setPacket] = useState<Packet>();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VA_BNI');
    const { data } = usePacket(courseId);

    useEffect(() => {
        if (data?.data) {
            setPackets(data.data as unknown as Packet[]);
        }
    }, [data]);

    const memoedValue = useMemo(
        () => ({
            isModalCheckoutOpen,
            setModalCheckoutOpen,
            packet,
            packets,
            setPacket,
            paymentMethod,
            setPaymentMethod
        }),
        [isModalCheckoutOpen, packet, packets, paymentMethod]
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
