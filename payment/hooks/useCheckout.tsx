import { useTopupCreditMutation } from 'copilot/redux/api/copilotApi';
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
    const [topup, { isLoading: topupLoading }] = useTopupCreditMutation();

    return {
        checkout,
        data,
        loading,
        error,
        freeCheckout,
        freeLoading,
        freeError,
        extendCheckout,
        extendLoading,
        topup,
        topupLoading
    };
};

export default useCheckout;
