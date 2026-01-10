import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Button from '../Button';
import { formatDuration } from 'commons/utils';
import { CirclePlayIcon } from 'lucide-react';
import Link from 'next/link';

interface NextVideoAutoplayProps {
    timeout: number;
    next_subchapter_link?: string;
    next_subchapter_name?: string;
    next_subchapter_thumbnail?: string;
    next_subchapter_duration?: string;
    setIsNextVideoOpen: Dispatch<SetStateAction<boolean>>;
}

function NextVideoAutoplay({
    timeout,
    next_subchapter_link,
    next_subchapter_name,
    next_subchapter_thumbnail,
    next_subchapter_duration,
    setIsNextVideoOpen
}: NextVideoAutoplayProps): JSX.Element {
    const [countdown, setCountdown] = useState(timeout);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (countdown > 0) {
                setCountdown(countdown - 1);
            } else {
                router.push(next_subchapter_link ?? '/');
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [countdown, next_subchapter_link, router]);

    return (
        <>
            <div className="bg-black/90 absolute inset-0"></div>
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 space-y-4 w-full max-w-[342px] lg:max-w-[526px]">
                <div className="text-white text-xs lg:text-base">
                    Video Selanjutnya{' '}
                    <span className="font-bold">{countdown}</span>
                </div>

                <div className="flex items-center gap-3 lg:items-stretch">
                    <div className="relative aspect-video w-[132px] rounded-lg overflow-hidden lg:w-[233px]">
                        <Image
                            src={next_subchapter_thumbnail ?? ''}
                            alt={next_subchapter_name}
                            layout="fill"
                            className="object-cover object-center"
                        />
                        <span className="absolute bottom-1.5 right-1.5 py-1 px-2 bg-black/50 rounded-[4px] text-white font-medium text-[10px] lg:hidden">
                            {formatDuration(next_subchapter_duration)}
                        </span>
                        <CirclePlayIcon className="hidden lg:block text-white w-8 h-8 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
                    </div>

                    <div className="lg:flex lg:flex-col lg:justify-between">
                        <p className="text-white font-semibold text-xs lg:text-xl">
                            {next_subchapter_name}
                        </p>
                        <span className="hidden lg:block text-[#999999]">
                            {formatDuration(next_subchapter_duration)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => setIsNextVideoOpen(false)}
                        type="button"
                        variant="secondary"
                        className="text-white font-semibold text-sm w-full !py-2">
                        Batal
                    </Button>

                    <Link
                        href={next_subchapter_link ?? '/'}
                        className="bg-[#5F2BCE] text-white font-semibold text-center rounded-full text-sm w-full py-2">
                        Selanjutnya
                    </Link>
                </div>
            </div>
        </>
    );
}

export default NextVideoAutoplay;
