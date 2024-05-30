import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export default function RenewSubscriptionBanner({
    product = 'video kelas'
}: {
    product?: string;
}): JSX.Element {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed } = useCourseSubscription();
    const footerRef = useRef<HTMLElement | null>(null);
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const [fixedBottom, setFixedBottom] = useState<number>(
        !isMobileBreakpoints ? 32 : is_subscribed ? 85 : 16
    );
    const [bannerBottom, setBannerBottom] = useState<number>(fixedBottom);

    useEffect(() => {
        setFixedBottom(!isMobileBreakpoints ? 32 : is_subscribed ? 85 : 16);
    }, [isMobileBreakpoints, is_subscribed]);
    useEffect(() => {
        const footer = document.querySelector('footer');
        footerRef.current = footer as HTMLElement;

        const adjustBannerPosition = () => {
            if (footerRef.current) {
                const footerRect = footerRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (footerRect.top < windowHeight) {
                    setBannerBottom(windowHeight - footerRect.top);
                } else {
                    setBannerBottom(0);
                }
            } else {
                setBannerBottom(0);
            }
        };

        adjustBannerPosition();
        window.addEventListener('scroll', adjustBannerPosition);

        return () => {
            window.removeEventListener('scroll', adjustBannerPosition);
        };
    }, [is_subscribed]);

    return (
        <div
            className={cn(
                'fixed z-[15] left-[12px] right-[12px] md:right-[36px] bg-[#B73E32] px-4 md:px-6 py-3 md:py-4 rounded-lg',
                is_subscribed ? 'md:left-[286px]' : 'md:left-[36px]'
            )}
            style={{ bottom: `${bannerBottom + fixedBottom}px` }}>
            <div className="flex items-center justify-between w-full">
                <div className="text-white">
                    <p className="md:text-lg text-sm font-semibold pb-[2px]">
                        Beli & akses seluruh {product}
                    </p>
                    <p className="text-xs md:text-md">
                        Mulai dari Rp125.000/bulan
                    </p>
                </div>
                <button
                    className="px-6 py-2 text-sm font-semibold text-black bg-white rounded-full md:text-md"
                    onClick={() => {
                        if (isAuthenticated)
                            window.location.href = '/langganan';
                        else window.location.href = '/daftar';
                    }}>
                    <p className="hidden md:block">Beli Paket</p>
                    <p className="md:hidden">Beli</p>
                </button>
            </div>
        </div>
    );
}
