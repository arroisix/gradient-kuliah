import { useQuery } from '@apollo/client';
import { GET_ALL_TRANSACTION } from '../schema';

const useAllTransaction = () => {
    const { loading, error, data } = useQuery(GET_ALL_TRANSACTION, {
        errorPolicy: 'all'
    });

    return { loading, error, data };
};

export default useAllTransaction;
