import { useQuery } from '@apollo/client';
import { GET_TRANSACTION } from '../schema';

const useTransaction = (id: string) => {
    const { loading, error, data } = useQuery(GET_TRANSACTION, {
        variables: {
            id
        },
        errorPolicy: 'all',
        pollInterval: 3000
    });

    return { loading, error, data };
};

export default useTransaction;
