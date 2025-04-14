import React, { useState, useEffect, useCallback } from 'react';
import { useGetBannerQuery } from 'dashboard/redux/api/dashboardApi';
import Image from 'next/image';
import Link from 'next/link';
import { useTracker } from 'tracker/tracker';

interface Banner {
    banner_url: string;
    href: string;
}

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
            const intervalId = setInterval(autoSlide, 3000);
            return () => clearInterval(intervalId);
        }
        return;
    }, [banners.length, autoSlide]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const handleBannerClick = (banner: Banner) => {
        tracker?.genericTrack('Click Dashboard Banner', {
            url: banner.href
        });
    };

    // Don't render anything if there are no banners or if loading failed
    if (isLoading || error || !banners.length) {
        return null;
    }

    return (
        <div className="w-full mb-8">
            <div className="relative overflow-hidden rounded-xl">
                {banners.length > 0 && (
                    <Link
                        href={banners[currentIndex].href}
                        onClick={() => handleBannerClick(banners[currentIndex])}
                        className="block w-full">
                        <div className="w-full">
                            <Image
                                src={banners[currentIndex].banner_url}
                                alt="Promo Banner"
                                width={1200}
                                height={300}
                                layout="responsive"
                                className="rounded-xl"
                                priority
                            />
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
