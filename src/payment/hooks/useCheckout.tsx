import { useMutation } from '@apollo/client';
import { CHECKOUT } from '../schema';

const useCheckout = () => {
    const [checkout, { data, loading, error }] = useMutation(CHECKOUT, {
        errorPolicy: 'all'
    });

    return {
        checkout,
        data,
        loading,
        error
    };
};

export default useCheckout;
