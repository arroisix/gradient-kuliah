import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface RenewSubscriptionBannerProps {
    product?: string;
    k12Product?: string;
    k12Description?: string;
    type?: 'COLLEGE_STUDENT' | 'K12' | 'K12_MOBILE';
    className?: string;
}

export default function RenewSubscriptionBanner({
    product = 'video kelas',
    k12Description = 'Nikmati ribuan video pembelajaran, bank soal, dan fitur eksklusif lainnya tanpa batas.',
    k12Product = 'materi',
    type = 'COLLEGE_STUDENT',
    className
}: RenewSubscriptionBannerProps): JSX.Element {
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed } = useCourseSubscription();

    const onClickSubscribeBanner = () => {
        router.push('/langganan');
    };

    const collegeStudentComponent = (): JSX.Element => {
        return (
            <div
                className={cn(
                    'sticky md:!bottom-[32px] z-[15] left-[10px] right-[12px] md:right-[36px] bg-[#B73E32] px-4 md:px-6 py-3 md:py-4 rounded-lg',
                    is_subscribed
                        ? 'bottom-[85px] md:left-[286px]'
                        : isAuthenticated
                        ? 'bottom-20 md:left-[36px]'
                        : 'bottom-[16px] md:left-[36px]'
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
                            else
                                window.location.href =
                                    '/daftar?redirect=/langganan';
                        }}>
                        <p className="hidden md:block">Beli Paket</p>
                        <p className="md:hidden">Beli</p>
                    </button>
                </div>
            </div>
        );
    };

    const k12Component = (): JSX.Element => {
        return (
            <div
                className={cn(
                    'hidden lg:block fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl lg:w-fit z-40 md:translate-x-[calc(-50%+125px)]',
                    className
                )}>
                <div className="relative rounded-t-2xl p-6 flex flex-row items-center gap-6 bg-[#5F2BCE] overflow-hidden">
                    <div className="flex flex-col gap-2 z-10">
                        <h2 className="text-white font-semibold">
                            Langganan untuk mendapat akses penuh ke {k12Product}
                        </h2>

                        <span className="text-sm text-white">
                            {k12Description}
                        </span>
                    </div>

                    <Button
                        variant="custom"
                        size="normal"
                        className="bg-white text-[#5F2BCE] font-semibold px-12 z-10"
                        onClick={onClickSubscribeBanner}>
                        Langganan
                    </Button>

                    <div className="absolute aspect-square w-[320px] lg:w-[260px] z-0 right-0 bottom-[-88px] lg:bottom-[-70px]">
                        <Image
                            src={`${CDN_URL}/assets/k12-subscribe-illustration.png`}
                            alt="Subscribe"
                            layout="fill"
                            objectPosition="center"
                            objectFit="contain"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const k12MobileComponent = (): JSX.Element => {
        return (
            <div className="lg:hidden w-full max-w-2xl mx-auto px-6 py-4 flex flex-col gap-6 bg-[#5F2BCE] rounded-2xl relative overflow-hidden">
                <div className="flex flex-col gap-2 z-10">
                    <h2 className="text-white font-semibold">
                        Langganan untuk mendapat akses penuh ke {k12Product}
                    </h2>
                    <span className="text-sm text-white">{k12Description}</span>
                </div>

                <Button
                    variant="custom"
                    size="normal"
                    className="bg-white text-[#5F2BCE] font-semibold px-12 w-fit text-sm z-10"
                    onClick={onClickSubscribeBanner}>
                    Langganan
                </Button>

                <div className="absolute aspect-square w-[180px] z-0 right-0 top-0">
                    <Image
                        src={`${CDN_URL}/assets/k12-subscribe-illustration-mobile.png`}
                        alt="Subscribe"
                        layout="fill"
                        objectPosition="center"
                        objectFit="fill"
                    />
                </div>
            </div>
        );
    };

    const renderComponent = (): JSX.Element => {
        if (type === 'COLLEGE_STUDENT') return collegeStudentComponent();
        if (type === 'K12') return k12Component();
        return k12MobileComponent();
    };

    return <>{renderComponent()}</>;
}
