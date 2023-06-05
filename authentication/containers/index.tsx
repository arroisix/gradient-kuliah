import { useGoogleLogin } from '@react-oauth/google';
import { AUTH_SECTION } from 'authentication/constants';
import useSocialLogin from 'authentication/hooks/useSocialLogin';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const AuthenticationContainer: React.FC = () => {
    const router = useRouter();
    const AuthSection = AUTH_SECTION[router.pathname];
    const { googleLogin } = useSocialLogin();
    const user = useSelector(getCurrentUser);

    useEffect(() => {
        if (Object.keys(user).length > 0 && router.pathname === '/masuk') {
            router.push('/');
        }
    }, [user, router]);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            await googleLogin(tokenResponse.access_token);
        },
        onError: () => {
            toast.error('Gagal login, coba beberapa saat lagi');
        }
    });

    return (
        <section>
            <div className="w-[324px] flex flex-col gap-8 justify-center items-center">
                <h1 className="font-bold font-[Urbanist] text-5xl">Gradient</h1>
                <div className="flex flex-col items-center justify-center gap-4">
                    <Button
                        variant="custom"
                        className="text-white bg-[#7264EB] w-full"
                        onClick={login}>
                        <div className="flex items-center justify-center ">
                            <AiOutlineGoogle className="mr-2 text-2xl" />
                            <span>Lanjutkan Dengan Google</span>
                        </div>
                    </Button>
                    <span className="font-extrabold text-[#666666]">ATAU</span>
                    <AuthSection />
                </div>
            </div>
        </section>
    );
};
