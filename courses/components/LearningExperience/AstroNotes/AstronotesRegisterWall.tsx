import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { RegistrationSection } from 'authentication/containers/RegistrationSection';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import useWindowSize from 'commons/hooks/useWindowSize';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AstronotesRegisterwall = ({
    showRegisterwall,
    book
}: {
    showRegisterwall: boolean;
    book: BookDetailInterface;
}): JSX.Element => {
    const router = useRouter();
    const { page } = router.query as { slug: string; page: string };
    const { is_subscribed } = useCourseSubscription();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    const [isShowRegisterwall, setIsShowRegisterwall] = useState(
        book.is_public
            ? false
            : showRegisterwall
              ? showRegisterwall
              : Number(page) == 1
                ? false
                : !isAuthenticated
    );
    const { isTabletBreakpoints } = useWindowBreakpoints();
    const { height } = useWindowSize();
    const { theme, toggleTheme } = useThemeContext();

    useEffect(() => {
        if (
            !isLandingPageRevampOn ||
            !showRegisterwall ||
            isAuthenticated ||
            book.is_public ||
            Number(page) == 1
        ) {
            setIsShowRegisterwall(false);
        } else {
            setIsShowRegisterwall(true);
            if (theme === 'light') toggleTheme();
        }
    }, [page, is_subscribed, isLandingPageRevampOn]);

    return isShowRegisterwall ? (
        <div
            className={cn(
                'relative sm:absolute sm:-inset-2 backdrop-blur-lg lg:inset-0'
            )}>
            <div
                className={cn(
                    'flex flex-col items-center justify-center w-screen h-[80vh] md:h-auto -mx-8 sm:w-auto sm:mx-0 md:sticky',
                    isTabletBreakpoints && height < 700
                        ? ''
                        : 'md:top-1/2 md:py-24 md:-translate-y-1/2'
                )}>
                <div className="bg-neutral-900 px-8 py-8 rounded max-w-[450px] shadow-md">
                    <h2 className="mb-4 text-xl font-extrabold leading-relaxed text-center">
                        Buat akun untuk lanjut membaca
                    </h2>
                    <RegistrationSection />
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default AstronotesRegisterwall;
