import { useAuth } from 'authentication/contexts/AuthProvider';
import { useUpdateUserMutation } from 'authentication/redux/api/authApi';
import { cn } from 'commons/utils';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingBackdrop from './elements/LoadingBackdrop';

interface UTBKSubscriptionBannerProps {
    isUsedInLanding?: boolean;
}

function UTBKSubscriptionBanner({
    isUsedInLanding = true
}: UTBKSubscriptionBannerProps): JSX.Element {
    const [isNavigating, setIsNavigating] = useState(false);
    const [updateUser, { isLoading: isUpdatingRole }] = useUpdateUserMutation();
    const { profile } = useAuth();

    // switch role when user click UTBK packets
    const handleSwitchRole = async () => {
        if (profile) {
            setIsNavigating(true);
            try {
                await updateUser({
                    ...profile,
                    phone_number: profile.phone_number.replace(/\+/g, ''),
                    current_role: 'K12'
                }).unwrap();
            } catch (error) {
                console.error(
                    new Error('failed to update user role', { cause: error })
                );
                toast.error('Gagal menampilkan paket UTBK, mohon coba lagi', {
                    position: 'top-center',
                    theme: 'colored',
                    hideProgressBar: true
                });
            } finally {
                setIsNavigating(false);
            }
        }
    };

    if (isUpdatingRole || isNavigating) {
        return <LoadingBackdrop />;
    }

    return (
        <div
            className={cn(
                'w-full mx-auto p-6 rounded-2xl space-y-4 bg-gradient-to-br from-[#9333ea]/30 to-[#4f46e5]/20',
                'lg:bg-gradient-to-r lg:max-w-[878px] lg:flex lg:justify-between lg:items-center lg:space-y-0',
                isUsedInLanding ? 'max-w-sm mt-6' : 'max-w-[324px]'
            )}>
            <h2 className="text-white font-semibold text-xl leading-[140%] shrink-0">
                Langganan Paket UTBK di sini!
            </h2>

            {isUsedInLanding ? (
                <Link
                    href="/utbk#langganan"
                    className="bg-white text-[#5f2bce] font-semibold text-sm leading-tight py-2 block w-full text-center rounded-full lg:max-w-[192px]">
                    Langganan Paket UTBK
                </Link>
            ) : (
                <button
                    disabled={isUpdatingRole || isNavigating}
                    onClick={handleSwitchRole}
                    type="button"
                    className="bg-white text-[#5f2bce] font-semibold text-sm leading-tight py-2 block w-full text-center rounded-full lg:max-w-[192px]">
                    Langganan Paket UTBK
                </button>
            )}
        </div>
    );
}

export { UTBKSubscriptionBanner };
