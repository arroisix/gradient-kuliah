import { useMutation } from '@apollo/client';
import { GOOGLE_LOGIN } from '../schema';

const useGoogle = () => {
    const [google, { data, loading, error }] = useMutation(GOOGLE_LOGIN, {
        errorPolicy: 'all'
    });

    return {
        googleAction: google,
        googleData: data,
        googleLoading: loading,
        googleError: error
    };
};

export default useGoogle;
