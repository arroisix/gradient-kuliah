import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useSelector } from 'react-redux';

export default function RenewSubscriptionBanner({
    product = 'video kelas'
}: {
    product?: string;
}): JSX.Element {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed } = useCourseSubscription();

    return (
        <div
            className={cn(
                'sticky md:!bottom-[32px] z-[15] left-[12px] right-[12px] md:right-[36px] bg-[#B73E32] px-4 md:px-6 py-3 md:py-4 rounded-lg',
                is_subscribed ? 'bottom-[85px] md:left-[286px]' : 'bottom-[16px] md:left-[36px]'
            )}>
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
