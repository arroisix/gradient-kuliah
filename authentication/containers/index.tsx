import { useGoogleLogin } from '@react-oauth/google';
import { AUTH_SECTION } from 'authentication/constants';
import { RegistrationProvider } from 'authentication/contexts/RegistrationProvider';
import { useLastLogin } from 'authentication/hooks/useLastLogin';
import useSocialLogin from 'authentication/hooks/useSocialLogin';
import { useLogoutMutation } from 'authentication/redux/api/authApi';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import { AiOutlineGoogle } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const AuthenticationContainer: React.FC = () => {
    const { pathname, push } = useRouter();
    const AuthSection = AUTH_SECTION[pathname];
    const { googleLogin } = useSocialLogin();
    const [logout] = useLogoutMutation();
    const user = useSelector(getCurrentUser);
    const { setLastLogin } = useLastLogin();

    const login =
        typeof window !== 'undefined' &&
        useGoogleLogin({
            onSuccess: async (tokenResponse) => {
                const res = await googleLogin(tokenResponse.access_token);
                if ('data' in res) {
                    setLastLogin({
                        email: res.data.user.email,
                        method: 'google'
                    });
                }
            },
            onError: () => {
                toast.error('Gagal login, coba beberapa saat lagi');
            }
        });

    const isLogin = pathname === '/masuk';

    return (
        <section className="flex items-stretch justify-center w-screen min-h-screen text-white bg-neutral-1000">
            {pathname === '/onboarding' && (
                <div className="fixed top-6 flex justify-center px-[16px] md:px-0 w-full md:w-[400px]">
                    <p className="text-[#666666]">
                        Terdaftar sebagai {user.email}
                    </p>
                </div>
            )}

            {pathname !== '/onboarding' ? (
                <div className="max-w-[360px] w-full px-[18px] py-12 flex flex-col gap-10 justify-center items-center">
                    <div className="flex flex-grow items-end">
                        <span className="font-bold font-[Urbanist] text-[28px] text-5xl">
                            Gradient
                        </span>
                    </div>
                    <div className="flex flex-grow flex-col items-center justify-start w-full gap-4">
                        <div className="flex flex-col w-full gap-[18px] text-center">
                            <span className="text-2xl font-extrabold text-white">
                                {pathname === '/masuk' ? 'Log In' : 'Buat akun'}
                            </span>
                            <Button
                                variant="custom"
                                className="text-white bg-[#7264EB] w-full"
                                onClick={() => (login ? login() : undefined)}
                                eventName={`Attempts to ${
                                    isLogin ? 'Login' : 'Register'
                                } with Google`}>
                                <div className="flex items-center justify-center">
                                    <AiOutlineGoogle className="mr-2 text-2xl" />
                                    <span className="font-bold">
                                        Lanjutkan Dengan Google
                                    </span>
                                </div>
                            </Button>
                        </div>
                        <span className="font-extrabold text-[#666666]">
                            ATAU
                        </span>
                        <div className="flex-grow w-full">
                            <AuthSection />
                        </div>
                    </div>
                </div>
            ) : (
                <RegistrationProvider>
                    <AuthSection />
                </RegistrationProvider>
            )}
        </section>
    );
};
