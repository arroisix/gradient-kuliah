import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const MobileTabs = (): JSX.Element => {
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { pathname } = router;

    return (
        <div className="relative flex justify-between w-full overflow-hidden">
            <span
                className={`text-center text-sm w-1/2 py-[6px] border-b-2 ${
                    pathname === '/komunitas' ||
                    pathname === '/komunitas/public'
                        ? 'border-accent-purple font-bold'
                        : 'border-[#2D2D2D] font-medium text-neutral-600'
                }`}
                onClick={() => {
                    router.push('/komunitas', undefined, { shallow: true });
                }}
                aria-hidden>
                Eksplor
            </span>
            {isAuthenticated && (
                <span
                    className={`text-center text-sm w-1/2 py-[6px] border-b-2 ${
                        pathname === '/komunitas/pertanyaan-ku'
                            ? 'border-accent-purple font-bold'
                            : 'border-[#2D2D2D] font-medium text-neutral-600'
                    }`}
                    onClick={() => {
                        router.push('/komunitas/pertanyaan-ku', undefined, {
                            shallow: true
                        });
                    }}
                    aria-hidden>
                    Pertanyaanku
                </span>
            )}
        </div>
    );
};

export default MobileTabs;
