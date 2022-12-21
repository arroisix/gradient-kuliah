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
    freePacket?: Packet;
    isFreePacket: () => boolean;
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
    const [freePacket, setFreePacket] = useState<Packet>();

    useEffect(() => {
        if (data?.data) {
            setPackets(data.data as unknown as Packet[]);

            const checkFreePacket = data.data.filter((p: Packet) => p.is_free);
            if (checkFreePacket.length > 0) {
                setFreePacket(checkFreePacket[0]);
            }
        }
    }, [data]);

    const isFreePacket = (): boolean => freePacket !== undefined;

    const memoedValue = useMemo(
        () => ({
            isModalCheckoutOpen,
            setModalCheckoutOpen,
            packet,
            packets,
            setPacket,
            paymentMethod,
            setPaymentMethod,
            freePacket,
            isFreePacket
        }),
        [isModalCheckoutOpen, packet, packets, paymentMethod, freePacket]
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
