import { useGetTransactionQuery } from 'payment/redux/api/transactionApi';

const useTransaction = (id: string, withPooling?: boolean) => {
    const { isLoading, error, data } = useGetTransactionQuery(id, {
        pollingInterval: withPooling ? 3000 : undefined
    });

    return { isLoading, error, data };
};

export default useTransaction;
