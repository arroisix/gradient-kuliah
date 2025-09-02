import {
    useCheckoutMutation,
    useExtendCheckoutMutation,
    useFreeCheckoutMutation
} from 'payment/redux/api/subscriptionApi';

const useCheckout = () => {
    const [checkout, { data, isLoading: loading, error }] =
        useCheckoutMutation();
    const [freeCheckout, { isLoading: freeLoading, error: freeError }] =
        useFreeCheckoutMutation();
    const [extendCheckout, { isLoading: extendLoading }] =
        useExtendCheckoutMutation();

    return {
        checkout,
        data,
        loading,
        error,
        freeCheckout,
        freeLoading,
        freeError,
        extendCheckout,
        extendLoading
    };
};

export default useCheckout;
