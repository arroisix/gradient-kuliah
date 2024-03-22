import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';

export default function RenewSubscriptionBanner() {
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <div className="fixed bottom-[85px] md:bottom-[32px] left-[12px] md:left-[286px] right-[12px] md:right-[36px] bg-[#B73E32] px-4 md:px-6 py-3 md:py-4 rounded-lg"
            style={{zIndex: 15}}>
            <div className="flex justify-between items-center w-full">
                <div className="text-white">
                    <p className="md:text-lg text-sm font-semibold pb-[2px]">
                        Beli & akses seluruh video kelas
                    </p>
                    <p className="md:text-md text-xs">
                        Mulai dari Rp125.000/bulan
                    </p>
                </div>
                <button
                    className="py-2 px-6 bg-white font-semibold text-black rounded-full text-sm md:text-md"
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
