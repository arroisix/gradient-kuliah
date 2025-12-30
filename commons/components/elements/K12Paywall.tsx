import { useAuth } from 'authentication/contexts/AuthProvider';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Paywall from 'commons/components/elements/Paywall';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import React from 'react';
import { useSelector } from 'react-redux';

const K12_ALLOWED_PREFIXES = [
    '/utbk',
    '/latihan',
    '/pembayaran',
    '/langganan',
    '/checkout',
    '/profil',
    '/aktivasi-email',
    '/copilot',
    '/kontak-kami',
    '/transaksi',
    '/referral',
    '/syarat-dan-ketentuan',
    '/kebijakan-privasi'
];

const K12Paywall = (): JSX.Element => {
    const router = useRouter();
    const { data } = useGetPacketOfferQuery();
    const { profile } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isK12User = profile?.current_role === 'K12' && isAuthenticated;
    const isAllowedPath = K12_ALLOWED_PREFIXES.some((prefix) => {
        if (router.pathname === '/latihan') {
            return false;
        }
        return router.pathname.startsWith(prefix);
    });

    const shouldShowPaywall = isK12User && !isAllowedPath;

    if (!shouldShowPaywall) {
        return <></>;
    }

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-lg">
            <div
                className={cn(
                    'flex flex-col items-center justify-center w-screen px-4 sm:w-auto sm:px-0'
                )}>
                <h2 className="mb-4 text-xl font-extrabold leading-relaxed text-center text-white">
                    Fitur ini tidak tersedia untuk akun K12
                </h2>
                <p className="mb-6 text-center text-neutral-400">
                    Upgrade akunmu untuk mengakses fitur ini
                </p>
                <Paywall
                    pricingData={data?.data}
                    isCarousel
                    redirect={router.asPath}
                    className="w-screen sm:w-full"
                    highlightedClassName="!order-none"
                    pricingClassName="max-w-[18rem] sm:max-w-xs lg:max-w-sm"
                    ctaEventName="Click Pricing Button on K12 Paywall"
                />
                <span className="absolute inset-0 pointer-events-none before:hidden after:hidden lg:before:block lg:after:block before:absolute after:absolute before:z-[2] after:z-[2] before:w-8 after:w-8 before:inset-y-0 after:inset-y-0 before:pointer-events-none after:pointer-events-none before:bg-[linear-gradient(to_right,rgba(0,0,0,0.5),rgba(0,0,0,0))] before:left-0 after:bg-[linear-gradient(to_left,rgba(0,0,0,0.5),rgba(0,0,0,0))] after:right-0"></span>
            </div>
        </div>
    );
};

export default K12Paywall;
