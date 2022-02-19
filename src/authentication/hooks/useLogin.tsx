import { useMutation } from '@apollo/client';
import { LOGIN } from '../schema';

const useLogin = () => {
    const [login, { data, loading, error }] = useMutation(LOGIN, {
        errorPolicy: 'all'
    });

    return {
        loginAction: login,
        loginData: data,
        loginLoading: loading,
        loginError: error
    };
};

export default useLogin;
