import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { useRequestEmailActivationMutation } from 'authentication/redux/api/authApi';
import LockIcon from '../../assets/LockIcon';
import EmailVerificationModal from './EmailVerificationModal';
import { useTracker } from 'tracker/tracker';

interface EmailVerificationBannerProps {
    className?: string;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
    className = ''
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = useSelector(getCurrentUser);
    const [requestEmailActivation] = useRequestEmailActivationMutation();
    const tracker = useTracker();

    const handleVerify = async () => {
        try {
            tracker?.trackButtonClick(
                'Email Verification',
                'Verifikasi Email',
                {
                    email: user.email,
                    source: 'verification_banner'
                }
            );
            await requestEmailActivation().unwrap();
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to send verification email:', error);
        }
    };

    return (
        <>
            <div
                className={`relative bg-[#03AC5C30] overflow-hidden rounded-xl w-full px-4 py-6 ${className}`}>
                <div className="relative z-10 max-w-[70%]">
                    <h2 className="text-white text-base md:text-lg font-semibold mb-3">
                        <span className="inline">Tingkatkan </span>
                        <span className="text-[#03AC5C]">keamanan akun </span>
                        <span className="block md:inline">
                            dengan verifikasi email
                        </span>
                    </h2>
                    <button
                        onClick={handleVerify}
                        className="w-fit px-6 py-2 bg-white text-black rounded-full font-medium text-sm transition-colors">
                        Verifikasi Email
                    </button>
                </div>

                <div className="absolute right-0 bottom-0">
                    <LockIcon width={120} height={129} />
                </div>
            </div>

            <EmailVerificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                email={user.email}
            />
        </>
    );
};

export default EmailVerificationBanner;
