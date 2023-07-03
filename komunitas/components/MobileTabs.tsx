import Link from 'next/link';
import { useRouter } from 'next/router';

const MobileTabs = (): JSX.Element => {
    const { pathname } = useRouter();

    return (
        <div className="relative flex justify-between w-full overflow-hidden">
            <Link href={'/komunitas'}>
                <span
                    className={`text-center text-sm w-1/2 py-[6px] border-b-2 ${
                        pathname === '/komunitas'
                            ? 'border-accent-purple font-bold'
                            : 'border-[#2D2D2D] font-medium text-neutral-600'
                    }`}>
                    Eksplor
                </span>
            </Link>
            <Link href={'/komunitas/pertanyaan-ku'}>
                <span
                    className={`text-center text-sm w-1/2 py-[6px] border-b-2 ${
                        pathname === '/komunitas/pertanyaan-ku'
                            ? 'border-accent-purple font-bold'
                            : 'border-[#2D2D2D] font-medium text-neutral-600'
                    }`}>
                    Pertanyaanku
                </span>
            </Link>
        </div>
    );
};

export default MobileTabs;
