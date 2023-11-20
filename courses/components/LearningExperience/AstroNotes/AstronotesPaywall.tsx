import { useFeatureIsOn } from '@growthbook/growthbook-react';
import Paywall from 'commons/components/elements/Paywall';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import useWindowSize from 'commons/hooks/useWindowSize';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import React, { useEffect, useState } from 'react';

const AstronotesPaywall = (): JSX.Element => {
    const router = useRouter();
    const { page } = router.query;
    const { is_subscribed } = useCourseSubscription();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    const { data } = useGetPacketOfferQuery();
    const [isShowPaywall, setIsShowPaywall] = useState(false);
    const { isTabletBreakpoints, isMobileBreakpoints } = useWindowBreakpoints();
    const { height } = useWindowSize();
    const { theme, toggleTheme } = useThemeContext();

    useEffect(() => {
        if (!isLandingPageRevampOn || is_subscribed || Number(page) == 1)
            setIsShowPaywall(false);
        else {
            setIsShowPaywall(true);
            if (theme === 'light') toggleTheme();
        }
    }, [page, is_subscribed, isLandingPageRevampOn]);

    return isShowPaywall ? (
        <div
            className={cn('relative sm:absolute sm:-inset-2 backdrop-blur-lg')}>
            <div
                className={cn(
                    'flex flex-col items-center justify-center w-screen -mx-4 sm:w-auto sm:mx-0 md:sticky ',
                    isTabletBreakpoints && height < 700
                        ? 'md:top-20'
                        : 'md:top-1/2 md:py-24 md:-translate-y-1/2'
                )}>
                <h2 className="mb-4 text-xl font-extrabold leading-relaxed text-center">
                    Beli untuk melihat rangkuman ini
                </h2>
                <Paywall
                    pricingData={data?.data}
                    isCarousel={isTabletBreakpoints || isMobileBreakpoints}
                    className={cn(
                        'lg:scale-[0.8] w-screen sm:w-full',
                        isTabletBreakpoints && height < 700 && 'scale-90'
                    )}
                    highlightedClassName="!order-none"
                    pricingClassName="max-w-[18rem] sm:max-w-xs lg:max-w-sm"
                />
            </div>
        </div>
    ) : (
        <></>
    );
};

export default AstronotesPaywall;
