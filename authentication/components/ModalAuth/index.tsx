import { useEffect, useState } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';

import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import RegisterSection from './registerSection';
import { toast } from 'react-toastify';
import useSocialLogin from 'authentication/hooks/useSocialLogin';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGoogleLogin } from '@react-oauth/google';

export interface SectionProps {
    changePage: (status: boolean) => void;
    closeModal: () => void;
}

const ModalAuth = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    const [isLogin, setIsLogin] = useState(false);
    const { isPermanent } = useAuth();

    const { googleLogin, isSuccess } = useSocialLogin();
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            await googleLogin(tokenResponse.access_token);
            setOpen(0);
        },
        onError: () => {
            toast.error('Gagal login, coba beberapa saat lagi');
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setOpen(0);
        }
    }, [isSuccess]);

    return (
        <Modal
            isOpen={isOpen ? 1 : 0}
            setOpen={() => setOpen(0)}
            permanent={isPermanent}>
            <div className="flex flex-col w-full">
                <h1 className="mb-8 text-3xl font-bold text-center">
                    {isLogin ? 'Masuk' : 'Buat akun'}
                </h1>
                <Button
                    variant="custom"
                    className="text-white bg-primary-blue"
                    onClick={login}>
                    <div className="flex items-center justify-center">
                        <AiOutlineGoogle className="mr-2 text-2xl" />
                        <span>Lanjutkan Dengan Google</span>
                    </div>
                </Button>
                <div className="flex items-center justify-center my-4">
                    <div className="w-full bg-neutral-400 h-[1px]" />
                    <span className="mx-4 text-xs text-neutral-400">ATAU</span>
                    <div className="w-full bg-neutral-400 h-[1px]" />
                </div>
                {isLogin ? (
                    <></>
                ) : (
                    <RegisterSection
                        changePage={setIsLogin}
                        closeModal={() => setOpen(0)}
                    />
                )}
            </div>
        </Modal>
    );
};

export default ModalAuth;
