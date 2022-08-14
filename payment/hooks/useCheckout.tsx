import {
    useCheckoutMutation,
    useFreeCheckoutMutation
} from 'payment/redux/api/subscriptionApi';

const useCheckout = () => {
    const [checkout, { data, isLoading: loading, error }] =
        useCheckoutMutation();
    const [freeCheckout, { isLoading: freeLoading }] =
        useFreeCheckoutMutation();

    return {
        checkout,
        data,
        loading,
        error,
        freeCheckout,
        freeLoading
    };
};

export default useCheckout;
