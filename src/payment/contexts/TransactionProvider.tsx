import { useRouter } from 'next/router';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { toast } from 'react-toastify';
import useTransaction from '../hooks/useTransaction';

interface TransactionContextType {
    transaction: Transaction;
}

const TransactionContext = createContext<TransactionContextType>(
    {} as TransactionContextType
);

export function TransactionProvider({
    children,
    transactionId
}: {
    children: ReactNode;
    transactionId: string;
}): JSX.Element {
    const [transaction, setTransaction] = useState<Transaction>(
        {} as Transaction
    );
    const { data } = useTransaction(transactionId);
    const router = useRouter();

    useEffect(() => {
        if (data) {
            if (data.transaction.status === 'SUCCESS') {
                toast.success(`Pembayaran Sukses!`, {
                    position: toast.POSITION.TOP_CENTER
                });
                router.push('/checkout/sukses');
            }

            setTransaction(data.transaction);
        }
    }, [data]);

    const memoedValue = useMemo(
        () => ({
            transaction
        }),
        [transaction]
    );

    return (
        <TransactionContext.Provider value={memoedValue}>
            {children}
        </TransactionContext.Provider>
    );
}

export const useCheckout = (): TransactionContextType => {
    return useContext(TransactionContext);
};

export default TransactionContext;
