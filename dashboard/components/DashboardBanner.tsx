import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo
} from 'react';
import { useGetBannerQuery } from 'dashboard/redux/api/dashboardApi';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCurrentUser,
    getIsAuthenticated
} from 'authentication/redux/selectors/userSelector';
import { useRequestEmailActivationMutation } from 'authentication/redux/api/authApi';
import Image from 'next/image';
import Link from 'next/link';
import { useTracker } from 'tracker/tracker';
import Skeleton from 'commons/components/elements/Skeleton';
import { Banner } from 'dashboard/types/dashboard';
import useWindowBreakpoints from '../../commons/hooks/useWindowBreakpoints';
import EmailVerificationModal from './EmailVerification/EmailVerificationModal';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { cn } from 'commons/utils';
import { MdClose } from 'react-icons/md';
import { getViewedCampaignBannersSlug } from 'dashboard/redux/selectors/bannerSelector';
import { addViewedCampaignBannerSlug } from 'dashboard/redux/slices/bannerSlice';

interface DashboardUpdatesBannerProps {
    bannerType?: 'campaign' | 'general';
}

const DashboardUpdatesBanner = ({
    bannerType = 'general'
}: DashboardUpdatesBannerProps): JSX.Element => {
    const { data, isLoading, error } = useGetBannerQuery({ type: bannerType });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slideDirection, setSlideDirection] = useState<
        'left' | 'right' | null
    >(null);
    const tracker = useTracker();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const viewedCampaignBanner = useSelector(getViewedCampaignBannersSlug);
    const dispatch = useDispatch();

    const user = useSelector(getCurrentUser);
    const [requestEmailActivation] = useRequestEmailActivationMutation();

    const banners = useMemo(() => {
        if (bannerType === 'campaign' && data?.data) {
            return data.data.filter(
                (banner: Banner) => !viewedCampaignBanner.includes(banner.slug)
            );
        }
        return data?.data || [];
    }, [data?.data, viewedCampaignBanner]);

    const clearAutoSlide = useCallback(() => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    }, []);

    const startAutoSlide = useCallback(() => {
        clearAutoSlide();

        if (banners.length > 1 && !isModalOpen) {
            intervalIdRef.current = setInterval(() => {
                setCurrentIndex(
                    (prevIndex) => (prevIndex + 1) % banners.length
                );
            }, 5000);
        }
    }, [banners.length, isModalOpen, clearAutoSlide]);

    useEffect(() => {
        startAutoSlide();
        return clearAutoSlide;
    }, [startAutoSlide, clearAutoSlide]);

    useEffect(() => {
        if (isModalOpen) {
            clearAutoSlide();
        } else if (banners.length > 1) {
            startAutoSlide();
        }
    }, [isModalOpen, banners.length, startAutoSlide, clearAutoSlide]);

    useEffect(() => {
        if (banners.length > 0 && currentIndex >= banners.length) {
            setCurrentIndex(0);
        }
    }, [banners.length, currentIndex]);

    const goToSlide = (index: number) => {
        clearAutoSlide();
        setCurrentIndex(index);

        setTimeout(() => {
            if (!isModalOpen) {
                startAutoSlide();
            }
        }, 3000);
    };

    const onCloseBanner = () => {
        // Optionally implement close banner functionality
        dispatch(addViewedCampaignBannerSlug(banners[currentIndex].slug));
    };

    const nextSlide = useCallback(() => {
        if (banners.length < 2) return;
        setSlideDirection('left');
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
            setSlideDirection(null);
        }, 300);

        clearAutoSlide();
        setTimeout(() => {
            if (!isModalOpen) {
                startAutoSlide();
            }
        }, 3000);
    }, [banners.length, isModalOpen, clearAutoSlide, startAutoSlide]);

    const prevSlide = useCallback(() => {
        if (banners.length < 2) return;
        setSlideDirection('right');
        setTimeout(() => {
            setCurrentIndex(
                (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
            );
            setSlideDirection(null);
        }, 300);

        clearAutoSlide();
        setTimeout(() => {
            if (!isModalOpen) {
                startAutoSlide();
            }
        }, 3000);
    }, [banners.length, isModalOpen, clearAutoSlide, startAutoSlide]);

    // Touch/swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50; // Minimum distance for a swipe

        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) {
                // Swiped left - go to next
                nextSlide();
            } else {
                // Swiped right - go to previous
                prevSlide();
            }
        }

        // Reset values
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    const handleBannerClick = (banner: Banner) => {
        if (banner.slug === 'verify-email-web') {
            handleVerifyEmail();
            return;
        }

        tracker?.genericTrack('Click Dashboard Banner', {
            bannerType: banner.type,
            bannerTitle: banner.title_text,
            bannerIndex: currentIndex
        });
    };

    const handleVerifyEmail = async () => {
        try {
            tracker?.genericTrack('Click Email Verification Banner', {
                email: user.email,
                source: 'banner'
            });
            await requestEmailActivation().unwrap();
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to send verification email:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="w-full mb-8">
                <Skeleton className="h-40 w-full rounded-xl" />
            </div>
        );
    }

    if (error || !banners.length) {
        return <></>;
    }

    const currentBanner = banners[currentIndex];
    if (!currentBanner) return <></>;

    const getBannerUrl = () => {
        if (isMobileBreakpoints && currentBanner.banner_url_mobile) {
            return currentBanner.banner_url_mobile;
        }
        return currentBanner.banner_url || '/placeholder-banner.png';
    };

    const bannerDimensions = isMobileBreakpoints
        ? { width: 328, height: 180 }
        : { width: 1248, height: 200 };

    const isVerifyEmailBanner = currentBanner.slug === 'verify-email-web';

    return (
        <>
            <div className="w-full mb-8">
                <div className="flex items-center justify-between mb-4">
                    {bannerType === 'general' && (
                        <h2 className="text-lg font-bold md:text-xl">
                            Jangan Sampai Ketinggalan!
                        </h2>
                    )}
                    {banners.length > 1 && bannerType === 'general' && (
                        <div className="flex items-center gap-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={prevSlide}
                                    className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700"
                                    aria-label="Previous banner">
                                    <FiChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700"
                                    aria-label="Next banner">
                                    <FiChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        'relative rounded-xl',
                        currentBanner.banner_border_color ? `border` : ''
                    )}
                    style={{
                        borderColor:
                            currentBanner.banner_border_color ||
                            currentBanner.background_color ||
                            'transparent'
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}>
                    {bannerType === 'campaign' && isAuthenticated && (
                        <button
                            className="h-[18px] w-[18px] md:h-[30px] md:w-[30px] bg-[#333540CF] rounded-full absolute -top-1 -right-1 md:-top-2 md:-right-2 z-[10] cursor-pointer flex items-center justify-center"
                            onClick={onCloseBanner}>
                            <MdClose color="#B6A6F3" size={12} />
                        </button>
                    )}
                    <div
                        className={`transition-all duration-300 ease-in-out ${
                            slideDirection === 'left'
                                ? 'opacity-0 -translate-x-8'
                                : slideDirection === 'right'
                                ? 'opacity-0 translate-x-8'
                                : 'opacity-100 translate-x-0'
                        }`}>
                        {currentBanner.is_asset ? (
                            currentBanner.banner_url && (
                                <button
                                    className={`block w-full ${
                                        isVerifyEmailBanner
                                            ? 'cursor-pointer'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        isVerifyEmailBanner
                                            ? handleVerifyEmail()
                                            : null
                                    }>
                                    <Link
                                        href={
                                            !isVerifyEmailBanner
                                                ? currentBanner.href || '#'
                                                : '#'
                                        }
                                        onClick={(e) => {
                                            if (isVerifyEmailBanner) {
                                                e.preventDefault();
                                            }
                                            handleBannerClick(currentBanner);
                                        }}
                                        className="block w-full">
                                        <div className="w-full overflow-hidden flex justify-center items-center rounded-xl">
                                            <div className="relative w-full">
                                                <Image
                                                    src={getBannerUrl()}
                                                    alt={`Banner ${currentBanner.slug}`}
                                                    width={
                                                        bannerDimensions.width
                                                    }
                                                    height={
                                                        bannerDimensions.height
                                                    }
                                                    layout="responsive"
                                                    objectFit="contain"
                                                    className="rounded-xl"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                </button>
                            )
                        ) : (
                            <Link
                                href={currentBanner.href || '#'}
                                onClick={() => handleBannerClick(currentBanner)}
                                className="block w-full">
                                <div
                                    className="rounded-xl relative flex items-center overflow-hidden md:min-h-[220px] h-[180px] md:h-[160px]"
                                    style={{
                                        backgroundColor:
                                            currentBanner.background_color ||
                                            '#5F2BCE'
                                    }}>
                                    <div className="py-1 px-4 md:py-6 md:px-6 max-w-[75%] md:max-w-[60%] z-10">
                                        {currentBanner.title_text && (
                                            <h3 className="text-white text-[18px] md:text-xl font-bold mb-1">
                                                {currentBanner.title_text}
                                            </h3>
                                        )}
                                        {currentBanner.body_text && (
                                            <p className="text-white text-xs md:text-base mb-6 md:mb-16">
                                                {currentBanner.body_text}
                                            </p>
                                        )}
                                        {currentBanner.button_text && (
                                            <button
                                                className={cn(
                                                    'bg-white text-base md:text-[18px] text-[#5F2BCE] px-3 py-1.5 md:px-12 md:py-4 rounded-full font-medium w-fit',
                                                    currentBanner.button_background_color
                                                        ? `bg-[${currentBanner.button_background_color}]`
                                                        : '',
                                                    currentBanner.button_text_color
                                                        ? `text-[${currentBanner.button_text_color}]`
                                                        : ''
                                                )}>
                                                {currentBanner.button_text}
                                            </button>
                                        )}
                                    </div>
                                    {currentBanner.image_url && (
                                        <div className="absolute -right-16 md:right-0 bottom-0 w-full h-[200%] md:h-[100%]">
                                            <Image
                                                src={currentBanner.image_url}
                                                alt={`${currentBanner.slug}-illustration`}
                                                layout="fill"
                                                objectFit="contain"
                                                objectPosition="right bottom"
                                            />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {banners.length > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                className={`h-1 rounded-full transition-all ${
                                    index === currentIndex
                                        ? 'w-6 bg-[#B6A6F3]'
                                        : 'w-3 bg-[#2A225F]'
                                }`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isVerifyEmailBanner && (
                <EmailVerificationModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    email={user.email}
                />
            )}
        </>
    );
};

export default DashboardUpdatesBanner;
