import { useRouter } from 'next/router';
import { posthog } from 'posthog-js';

const MobileTabs = (): JSX.Element => {
    const router = useRouter();
    const { pathname } = router;

    return (
        <div className="relative flex justify-between w-full overflow-hidden">
            <span
                className={`text-center text-sm w-1/2 py-[6px] border-b-2 ${
                    pathname === '/komunitas'
                        ? 'border-accent-purple font-bold'
                        : 'border-[#2D2D2D] font-medium text-neutral-600'
                }`}
                onClick={() => {
                    posthog.capture('Visit Community Explore Page');
                    router.push('/komunitas', undefined, { shallow: true });
                }}
                aria-hidden>
                Eksplor
            </span>
            <span
                className={`text-center text-sm w-1/2 py-[6px] border-b-2 ${
                    pathname === '/komunitas/pertanyaan-ku'
                        ? 'border-accent-purple font-bold'
                        : 'border-[#2D2D2D] font-medium text-neutral-600'
                }`}
                onClick={() => {
                    posthog.capture('Visit Community Pertanyaanku Page');
                    router.push('/komunitas/pertanyaan-ku', undefined, {
                        shallow: true
                    });
                }}
                aria-hidden>
                Pertanyaanku
            </span>
        </div>
    );
};

export default MobileTabs;
