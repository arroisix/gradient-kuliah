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
import { queryParamBuilder } from 'commons/utils';

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
    const { data } = useTransaction(transactionId, true);
    const router = useRouter();

    useEffect(() => {
        if (data) {
            if (data.status === 'SUCCESS') {
                toast.success(`Pembayaran Sukses!`, {
                    position: toast.POSITION.TOP_CENTER
                });
                router.push(
                    `/checkout/sukses/${data.id}?${queryParamBuilder({
                        redirect: router.query.redirect as string
                    })}`
                );
            }

            setTransaction(data);
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
