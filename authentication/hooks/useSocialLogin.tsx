import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useSocialLoginMutation } from 'authentication/redux/api/authApi';

type SocialLoginHook = {
    googleLogin: (access_token: string) => Promise<
        | {
              data: LoginResponseData;
          }
        | {
              error: FetchBaseQueryError | SerializedError;
          }
    >;
    data?: LoginResponseData;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
};

const useSocialLogin = (): SocialLoginHook => {
    const [socialLogin, { data, isLoading, isSuccess, isError }] =
        useSocialLoginMutation();

    const googleLogin = async (access_token: string) => {
        return await socialLogin({
            access_token: access_token,
            provider: 'google'
        });
    };

    return { googleLogin, data, isLoading, isError, isSuccess };
};

export default useSocialLogin;
