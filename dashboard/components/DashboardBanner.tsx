import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGetBannerQuery } from 'dashboard/redux/api/dashboardApi';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { useRequestEmailActivationMutation } from 'authentication/redux/api/authApi';
import Image from 'next/image';
import Link from 'next/link';
import { useTracker } from 'tracker/tracker';
import Skeleton from 'commons/components/elements/Skeleton';
import { Banner } from 'dashboard/types/dashboard';
import useWindowBreakpoints from '../../commons/hooks/useWindowBreakpoints';
import EmailVerificationModal from './EmailVerification/EmailVerificationModal';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

const DashboardUpdatesBanner: React.FC = () => {
    const { data, isLoading, error } = useGetBannerQuery();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tracker = useTracker();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

    const user = useSelector(getCurrentUser);
    const [requestEmailActivation] = useRequestEmailActivationMutation();

    const banners = data?.data || [];

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

    const nextSlide = useCallback(() => {
        if (banners.length < 2) return;
        goToSlide((currentIndex + 1) % banners.length);
    }, [banners.length, currentIndex]); // goToSlide closes over clearAutoSlide/start; safe to call

    const prevSlide = useCallback(() => {
        if (banners.length < 2) return;
        goToSlide((currentIndex - 1 + banners.length) % banners.length);
    }, [banners.length, currentIndex]);

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
        return null;
    }

    const currentBanner = banners[currentIndex];
    if (!currentBanner) return null;

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
                    <h2 className="text-lg font-bold md:text-xl">
                        Jangan Sampai Ketinggalan!
                    </h2>
                    {banners.length > 1 && (
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
                <div className="relative overflow-hidden rounded-xl">
                    {currentBanner.is_asset ? (
                        currentBanner.banner_url && (
                            <button
                                className={`block w-full ${
                                    isVerifyEmailBanner ? 'cursor-pointer' : ''
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
                                                width={bannerDimensions.width}
                                                height={bannerDimensions.height}
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
                                        <button className="bg-white text-base md:text-[18px] text-[#5F2BCE] px-3 py-1.5 md:px-12 md:py-4 rounded-full font-medium w-fit">
                                            {currentBanner.button_text}
                                        </button>
                                    )}
                                </div>
                                {currentBanner.image_url && (
                                    <div className="absolute -right-20 md:right-0 bottom-0 w-[60%] md:w-[30%] h-[200%] md:h-[100%]">
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

                {banners.length > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                className={`h-1.5 rounded-full transition-all ${
                                    index === currentIndex
                                        ? 'w-6 bg-white'
                                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
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
