import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';

const CountdownBanner = (): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isCountdownDone, setIsCountdownDone] = useState(false);

    useEffect(() => {
        // Set target date - adjust this to your actual target date
        const targetDate = new Date('2026-01-01T20:00:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(
                        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    ),
                    minutes: Math.floor(
                        (difference % (1000 * 60 * 60)) / (1000 * 60)
                    ),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
                setIsCountdownDone(false);
            } else {
                setIsCountdownDone(true);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, []);

    if (isAuthenticated) {
        return <></>;
    }

    return (
        <div
            onClick={isCountdownDone ? () => router.push('/utbk') : undefined}
            aria-hidden
            className={cn(
                'w-full bg-[#1E1930] flex items-center justify-center py-2 px-4 md:px-4 relative overflow-hidden',
                isCountdownDone && 'cursor-pointer'
            )}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/20 to-[#6366F1]/20" />
            {/* Mobile layout: text on left, countdown on right */}
            <div className="flex md:hidden items-center justify-between w-full relative z-10 gap-4 py-2 md:py-4">
                <div className="flex flex-col gap-4">
                    <p className="text-white text-sm text-left">
                        <span className="font-bold">Gradient khusus UTBK</span>{' '}
                        {isCountdownDone ? 'kini telah hadir!' : 'akan hadir!'}
                    </p>
                    {isCountdownDone ? (
                        <Link
                            href="/utbk"
                            className="text-white text-sm font-semibold underline hover:text-purple-300 transition-colors">
                            Pelajari lebih lanjut
                        </Link>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <div className="flex flex-col items-center justify-center backdrop-blur-sm rounded min-w-[40px]">
                                <span className="text-sm font-bold text-white leading-none">
                                    {timeLeft.days.toString()}
                                </span>
                                <span className="text-[10px] text-purple-7">
                                    Hari
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-white">
                                :
                            </span>
                            <div className="flex flex-col items-center justify-center backdrop-blur-sm rounded min-w-[40px]">
                                <span className="text-sm font-bold text-white leading-none">
                                    {timeLeft.hours.toString().padStart(2, '0')}
                                </span>
                                <span className="text-[10px] text-purple-7">
                                    Jam
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-white">
                                :
                            </span>
                            <div className="flex flex-col items-center justify-center backdrop-blur-sm rounded min-w-[40px]">
                                <span className="text-sm font-bold text-white leading-none">
                                    {timeLeft.minutes
                                        .toString()
                                        .padStart(2, '0')}
                                </span>
                                <span className="text-[10px] text-purple-7">
                                    Mnt
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-white">
                                :
                            </span>
                            <div className="flex flex-col items-center justify-center backdrop-blur-sm rounded min-w-[40px]">
                                <span className="text-sm font-bold text-[#B6A6F3] leading-none">
                                    {timeLeft.seconds
                                        .toString()
                                        .padStart(2, '0')}
                                </span>
                                <span className="text-[10px] text-purple-7">
                                    Dtk
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="absolute -right-16 -bottom-5">
                    <Image
                        src={
                            isCountdownDone
                                ? 'https://assets.gradient.academy/assets/utbk_student_white.png'
                                : 'https://assets.gradient.academy/assets/utbk_student.png'
                        }
                        alt="Student"
                        width={220}
                        height={90}
                        className="w-auto object-contain"
                    />
                </div>
            </div>
            {/* Desktop layout: centered with image */}
            <div className="hidden md:flex items-center gap-6 relative z-10">
                <div className="-mb-6 -mr-12">
                    <Image
                        src={
                            isCountdownDone
                                ? 'https://assets.gradient.academy/assets/utbk_student_white.png'
                                : 'https://assets.gradient.academy/assets/utbk_student.png'
                        }
                        alt="Student"
                        width={250}
                        height={90}
                        className="w-auto object-contain"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-white text-base">
                        <span className="font-bold">Gradient khusus UTBK</span>{' '}
                        {isCountdownDone ? 'kini telah hadir!' : 'akan hadir!'}
                    </p>
                    {isCountdownDone ? (
                        <Link
                            href="/utbk"
                            className="text-white text-base font-semibold underline hover:text-purple-300 transition-colors">
                            Pelajari lebih lanjut
                        </Link>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <div className="flex flex-col items-center justify-center backdrop-blur-sm min-w-[40px]">
                                <span className="text-sm font-bold text-white leading-none">
                                    {timeLeft.days.toString()}
                                </span>
                                <span className="text-[10px] text-purple-7">
                                    Hari
                                </span>
                            </div>
                            <span className="text-lg font-bold text-white">
                                :
                            </span>
                            <div className="flex flex-col items-center justify-center backdrop-blur-sm min-w-[40px]">
                                <span className="text-sm font-bold text-white leading-none">
                                    {timeLeft.hours.toString().padStart(2, '0')}
                                </span>
                                <span className="text-[10px] text-purple-7">
                                    Jam
                                </span>
                            </div>
                            <span className="text-lg font-bold text-white">
                                :
                            </span>
                            <div className="flex flex-col items-center justify-center backdrop-blur-sm min-w-[40px]">
                                <span className="text-sm font-bold text-white leading-none">
                                    {timeLeft.minutes
                                        .toString()
                                        .padStart(2, '0')}
                                </span>
                                <span className="text-[10px] text-purple-7">
                                    Mnt
                                </span>
                            </div>
                            <span className="text-lg font-bold text-white">
                                :
                            </span>
                            <div className="flex flex-col items-center justify-center backdrop-blur-sm min-w-[40px]">
                                <span className="text-sm font-bold text-[#B6A6F3] leading-none">
                                    {timeLeft.seconds
                                        .toString()
                                        .padStart(2, '0')}
                                </span>
                                <span className="text-[10px] text-purple-7">
                                    Dtk
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountdownBanner;
