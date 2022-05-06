import { useGetAllTransactionQuery } from 'payment/redux/api/transactionApi';

const useAllTransaction = () => {
    const { isLoading: loading, error, data } = useGetAllTransactionQuery();
    return { loading, error, data };
};

export default useAllTransaction;
