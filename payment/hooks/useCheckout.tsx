import { useCheckoutMutation } from 'payment/redux/api/subscriptionApi';

const useCheckout = () => {
    const [checkout, { data, isLoading: loading, error }] =
        useCheckoutMutation();

    return {
        checkout,
        data,
        loading,
        error
    };
};

export default useCheckout;
