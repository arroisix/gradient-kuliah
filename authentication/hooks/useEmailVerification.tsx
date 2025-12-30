import {
    useGetProfileQuery,
    useRequestEmailActivationMutation
} from 'authentication/redux/api/authApi';
import { useEffect, useState } from 'react';

export const useEmailVerification = ({
    countdownValue,
    onEmailVerified,
    disable = false
}: {
    countdownValue: number;
    onEmailVerified: () => void;
    disable?: boolean;
}) => {
    const [countdown, setCountdown] = useState<number>(countdownValue);
    const [canResend, setCanResend] = useState<boolean>(false);
    const [requestEmailActivation, { isLoading }] =
        useRequestEmailActivationMutation();

    const { data: profile } = useGetProfileQuery(
        {},
        {
            pollingInterval: 5000,
            skip: disable
        }
    );

    useEffect(() => {
        if (profile?.is_email_verified) {
            onEmailVerified();
        }
    }, [profile?.is_email_verified, onEmailVerified]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!disable && countdown > 0) {
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
    }, [disable, countdown]);

    const handleResend = async () => {
        try {
            await requestEmailActivation().unwrap();
            setCountdown(30);
            setCanResend(false);
        } catch (error) {
            console.error('Failed to resend verification email:', error);
        }
    };

    return {
        countdown,
        canResend,
        handleResend,
        isLoadingResend: isLoading
    };
};
