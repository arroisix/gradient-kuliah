import { useGoogleLogin } from '@react-oauth/google';
import { AUTH_SECTION } from 'authentication/constants';
import { RegistrationProvider } from 'authentication/contexts/RegistrationProvider';
import useSocialLogin from 'authentication/hooks/useSocialLogin';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { removeUser } from 'authentication/redux/slices/userSlice';
import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import { AiOutlineGoogle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const AuthenticationContainer: React.FC = () => {
    const { pathname } = useRouter();
    const AuthSection = AUTH_SECTION[pathname];
    const { googleLogin } = useSocialLogin();
    const user = useSelector(getCurrentUser);
    const dispatch = useDispatch();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            await googleLogin(tokenResponse.access_token);
        },
        onError: () => {
            toast.error('Gagal login, coba beberapa saat lagi');
        }
    });

    const logout: () => void = () => dispatch(removeUser());

    return (
        <section className="flex items-center justify-center w-screen min-h-screen text-white bg-neutral-1000">
            {pathname === '/onboarding' && (
                <div className="fixed top-0 left-0 flex gap-2 px-6 py-3 font-body">
                    <span className="text-[#666666]">
                        Terdaftar sebagai {user.email}
                    </span>{' '}
                    <button
                        onClick={logout}
                        className="text-[#999999] hover:text-red-400 transition-all duration-500">
                        Sign Out
                    </button>
                </div>
            )}

            {pathname !== '/onboarding' ? (
                <div
                    className={`w-[360px] flex flex-col gap-8 justify-center items-center`}>
                    <h1 className="font-bold font-[Urbanist] text-5xl">
                        Gradient
                    </h1>
                    <div className="flex flex-col items-center justify-center w-full gap-4">
                        <div className="flex flex-col w-full gap-1 text-center">
                            <span className="text-2xl font-extrabold text-White">
                                {pathname === '/masuk' ? 'Log In' : 'Buat akun'}
                            </span>
                            <Button
                                variant="custom"
                                className="text-white bg-[#7264EB] w-full"
                                onClick={login}>
                                <div className="flex items-center justify-center ">
                                    <AiOutlineGoogle className="mr-2 text-2xl" />
                                    <span>Lanjutkan Dengan Google</span>
                                </div>
                            </Button>
                        </div>
                        <span className="font-extrabold text-[#666666]">
                            ATAU
                        </span>
                        <AuthSection />
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
