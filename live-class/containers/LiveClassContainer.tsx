import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';

function LiveClassContainer(): JSX.Element {
    return (
        <div className="w-full max-w-[472px] mx-auto">
            <div
                className={cn(
                    'relative w-[120px] h-[120px] mx-auto mb-6',
                    'lg:w-[160px] lg:h-[160px]'
                )}>
                <Image
                    src={`${CDN_URL}/assets/utbk/live_class_empty.png`}
                    alt=""
                    layout="fill"
                />
            </div>

            <h1 className="text-white font-bold text-center text-xl leading-tight mb-3">
                Belum Ada Live Class
            </h1>

            <p
                className={cn(
                    'text-[#999999] text-center w-full max-w-[422px] mx-auto mb-3',
                    'lg:mb-6'
                )}>
                Live class belum tersedia saat ini. Nantikan jadwal berikutnya
                di media sosial Gradient UTBK!
            </p>
            <div className="w-full flex justify-center items-center">
                <Button href="/langganan" variant="primary" className="w-fit">
                    Daftar Live Class Sekarang!
                </Button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
                <Link
                    href="https://www.instagram.com/gradient_utbk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#999999] text-sm leading-[160%] flex items-center gap-2">
                    <FaInstagram className="shrink-0 text-[#7D89CC] w-5 h-5" />
                    @gradient_utbk
                </Link>
                <Link
                    href="https://x.com/gradient_UTBK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#999999] text-sm leading-[160%] flex items-center gap-2">
                    <FaXTwitter className="shrink-0 text-[#7D89CC] w-5 h-5" />
                    @gradient_utbk
                </Link>
                <Link
                    href="https://www.tiktok.com/@gradient_utbk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#999999] text-sm leading-[160%] flex items-center gap-2">
                    <FaTiktok className="shrink-0 text-[#7D89CC] w-5 h-5" />
                    @gradient_utbk
                </Link>
            </div>
        </div>
    );
}

export { LiveClassContainer };
