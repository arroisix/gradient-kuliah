import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import Image from 'next/image';

function EmptyLiveClass(): JSX.Element {
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

            <h2 className="text-white font-bold text-center text-xl leading-tight mb-3">
                Belum Ada Jadwal Kelas
            </h2>

            <p
                className={cn(
                    'text-[#999999] text-center w-full max-w-[422px] mx-auto mb-6',
                    'lg:mb-12'
                )}>
                Saat ini belum ada live class yang dijadwalkan. Pantau terus
                halaman ini untuk update jadwal terbaru!
            </p>
        </div>
    );
}

export { EmptyLiveClass };
