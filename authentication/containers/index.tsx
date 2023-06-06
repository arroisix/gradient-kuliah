import { useGoogleLogin } from '@react-oauth/google';
import { AUTH_SECTION } from 'authentication/constants';
import useSocialLogin from 'authentication/hooks/useSocialLogin';
import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import { AiOutlineGoogle } from 'react-icons/ai';
import { toast } from 'react-toastify';

export const AuthenticationContainer: React.FC = () => {
    const router = useRouter();
    const AuthSection = AUTH_SECTION[router.pathname];
    const { googleLogin } = useSocialLogin();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            await googleLogin(tokenResponse.access_token);
        },
        onError: () => {
            toast.error('Gagal login, coba beberapa saat lagi');
        }
    });

    return (
        <section className="flex items-center justify-center w-screen min-h-screen text-white bg-neutral-1000">
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
