import React, {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState
} from 'react';

interface PaymentContextType {
    isModalCheckoutOpen: 1 | 0;
    setModalCheckoutOpen: (status: 1 | 0) => void;
}

const PaymentContext = createContext<PaymentContextType>(
    {} as PaymentContextType
);

export function PaymentProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const [isModalCheckoutOpen, setModalCheckoutOpen] = useState<1 | 0>(0);

    const memoedValue = useMemo(
        () => ({
            isModalCheckoutOpen,
            setModalCheckoutOpen
        }),
        [isModalCheckoutOpen]
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
