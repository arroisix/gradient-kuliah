import React, { useState, useEffect, useCallback } from 'react';
import { useGetBannerQuery } from 'dashboard/redux/api/dashboardApi';
import Image from 'next/image';
import Link from 'next/link';
import { useTracker } from 'tracker/tracker';
import Skeleton from 'commons/components/elements/Skeleton';
import { Banner } from 'dashboard/types/dashboard';

const DashboardUpdatesBanner: React.FC = () => {
    const { data, isLoading, error } = useGetBannerQuery();
    const [currentIndex, setCurrentIndex] = useState(0);
    const tracker = useTracker();

    const banners = data?.data || [];

    const autoSlide = useCallback(() => {
        if (banners.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }
    }, [banners.length]);

    useEffect(() => {
        if (banners.length > 1) {
            const intervalId = setInterval(autoSlide, 5000);
            return () => clearInterval(intervalId);
        }
        return undefined;
    }, [banners.length, autoSlide]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const handleBannerClick = (banner: Banner) => {
        tracker?.genericTrack('Click Dashboard Banner', {
            slug: banner.slug,
            type: banner.type
        });
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

    return (
        <div className="w-full mb-8">
            <div className="relative overflow-hidden rounded-xl">
                {currentBanner.is_asset ? (
                    currentBanner.banner_url && (
                        <Link
                            href={currentBanner.href || '#'}
                            onClick={() => handleBannerClick(currentBanner)}
                            className="block w-full">
                            <div className="w-full">
                                <Image
                                    src={currentBanner.banner_url}
                                    alt={`Banner ${currentBanner.slug}`}
                                    width={1200}
                                    height={300}
                                    layout="responsive"
                                    className="rounded-xl"
                                    priority
                                />
                            </div>
                        </Link>
                    )
                ) : (
                    <Link
                        href={currentBanner.href || '#'}
                        onClick={() => handleBannerClick(currentBanner)}
                        className="block w-full">
                        <div
                            className="rounded-xl relative flex items-center overflow-hidden h-[140px] md:h-[160px]"
                            style={{
                                backgroundColor:
                                    currentBanner.background_color || '#5F2BCE'
                            }}>
                            <div className="py-4 px-6 md:py-6 md:px-8 max-w-[75%] md:max-w-[60%] z-10">
                                {currentBanner.title_text && (
                                    <h3 className="text-white text-base md:text-xl font-bold mb-1">
                                        {currentBanner.title_text}
                                    </h3>
                                )}
                                {currentBanner.body_text && (
                                    <p className="text-white text-xs md:text-sm mb-2 md:mb-3">
                                        {currentBanner.body_text}
                                    </p>
                                )}
                                {currentBanner.button_text && (
                                    <button className="bg-white text-xs md:text-sm text-[#5F2BCE] px-3 py-1.5 md:px-4 md:py-2 rounded-full font-medium w-fit">
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
    );
};

export default DashboardUpdatesBanner;
