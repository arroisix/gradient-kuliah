import { useEffect, useState } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';
import { GoogleLogin } from 'react-google-login';

import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import LoginSection from './loginSection';
import RegisterSection from './registerSection';
import { toast } from 'react-toastify';
import useSocialLogin from 'authentication/hooks/useSocialLogin';
import { useAuth } from 'authentication/contexts/AuthProvider';

export interface SectionProps {
    changePage: (status: boolean) => void;
    closeModal: () => void;
}

const ModalAuth = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    const [isLogin, setIsLogin] = useState(false);
    const { isPermanent } = useAuth();

    const { googleLogin, isSuccess } = useSocialLogin();

    useEffect(() => {
        if (isSuccess) {
            setOpen(0);
        }
    }, [isSuccess]);

    const onGoogleSuccess = async (res: any): Promise<void> => {
        await googleLogin(res.tokenId);
        setOpen(0);
    };

    const onGoogleFailure = (): void => {
        toast.error('Gagal login, coba beberapa saat lagi');
    };

    return (
        <Modal
            isOpen={isOpen ? 1 : 0}
            setOpen={() => setOpen(0)}
            permanent={isPermanent}>
            <div className="w-full flex flex-col">
                <h1 className="text-3xl text-center font-bold mb-8">
                    {isLogin ? 'Masuk' : 'Buat akun'}
                </h1>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <GoogleLogin
                    clientId="3688986116-g7dlt8prm1gimh870k4h0trds8njq4rj.apps.googleusercontent.com"
                    buttonText="Masuk dengan Google"
                    render={(renderProps) => (
                        <Button
                            variant="custom"
                            className="bg-primary-blue text-white"
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}>
                            <div className="flex items-center justify-center">
                                <AiOutlineGoogle className="text-2xl mr-2" />
                                <span>Lanjutkan Dengan Google</span>
                            </div>
                        </Button>
                    )}
                    onSuccess={onGoogleSuccess}
                    onFailure={onGoogleFailure}
                />
                <div className="my-4 flex items-center justify-center">
                    <div className="w-full bg-neutral-400 h-[1px]" />
                    <span className="mx-4 text-neutral-400 text-xs">ATAU</span>
                    <div className="w-full bg-neutral-400 h-[1px]" />
                </div>
                {isLogin ? (
                    <LoginSection
                        changePage={setIsLogin}
                        closeModal={() => setOpen(0)}
                    />
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
