import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import {
    useRequestEmailActivationMutation,
    useGetProfileQuery
} from 'authentication/redux/api/authApi';

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
    isOpen,
    onClose,
    email
}) => {
    const [countdown, setCountdown] = useState<number>(30);
    const [canResend, setCanResend] = useState<boolean>(false);
    const [requestEmailActivation] = useRequestEmailActivationMutation();

    const { data: profile } = useGetProfileQuery(
        {},
        {
            pollingInterval: 5000,
            skip: !isOpen
        }
    );

    useEffect(() => {
        if (profile?.is_email_verified) {
            onClose();
        }
    }, [profile?.is_email_verified, onClose]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        if (countdown === 0) {
            setCanResend(true);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isOpen, countdown]);

    const handleResend = async () => {
        try {
            await requestEmailActivation().unwrap();
            setCountdown(30);
            setCanResend(false);
        } catch (error) {
            console.error('Failed to resend verification email:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#181818] z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-xl p-6 flex flex-col min-h-[500px]">
                <button
                    onClick={onClose}
                    className="fixed md:absolute right-4 top-4 md:top-0 text-white/60 hover:text-white">
                    <IoClose size={24} />
                </button>

                <div className="flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold text-white mb-3">
                        Verifikasi email
                    </h2>
                    <p className="text-gray-400">
                        Demi keamanan akun, klik link verifikasi yang kami kirim
                        ke <span className="text-white">{email}</span>
                    </p>

                    <div className="mt-4">
                        {canResend ? (
                            <button
                                onClick={handleResend}
                                className="text-[#B6A6F3] font-semibold">
                                Kirim Ulang
                            </button>
                        ) : (
                            <p className="text-white">
                                <span className="font-bold">
                                    {countdown} detik
                                </span>{' '}
                                <span className="text-gray-400">
                                    sebelum mengirim ulang
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() =>
                        window.open('https://mail.google.com', '_blank')
                    }
                    className="w-full py-3 bg-[#5F2BCE] hover:bg-[#4F24A8] font-bold text-white rounded-full transition-colors mt-auto">
                    Periksa Inbox
                </button>
            </div>
        </div>
    );
};

export default EmailVerificationModal;
