import { useSelector } from 'react-redux';
import Footer from './components/modules/Footer';
import Navbar from './components/modules/Navbar';
import Sidebar from './components/modules/Sidebar';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { cn } from './utils';
import Appbar from './components/modules/Appbar';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import useWindowBreakpoints from './hooks/useWindowBreakpoints';
import dynamic from 'next/dynamic';
import K12Paywall from './components/elements/K12Paywall';
const AppInstallBanner = dynamic(
    () => import('./components/modules/Navbar/components/AppInstallBanner')
);

interface LayoutProps {
    children?: JSX.Element;
    paymentPage?: boolean;
    shouldTransparent?: boolean;
    courses?: Course[];
    showSidebar?: boolean;
    fullHeightSidebar?: boolean;
    isFullBlackBackground?: boolean;
    withoutK12Paywall?: boolean;
}

const Layout = ({
    children,
    paymentPage,
    shouldTransparent,
    courses,
    showSidebar,
    fullHeightSidebar,
    isFullBlackBackground,
    withoutK12Paywall = false
}: LayoutProps): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    const router = useRouter();
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <div
            className={cn(
                'relative w-screen overflow-x-clip min-h-screen text-white',
                isFullBlackBackground
                    ? 'bg-black'
                    : isLandingPageRevampOn
                    ? 'bg-[#101010]'
                    : 'bg-black',
                paymentPage && 'flex flex-col'
            )}>
            {!withoutK12Paywall && <K12Paywall />}
            <Navbar
                paymentPage={paymentPage ?? false}
                shouldTransparent={shouldTransparent ?? false}
                courses={courses}
            />

            <div className="h-28 bg-[#222222]"></div>

            <AppInstallBanner
                showSidebar={
                    showSidebar && isAuthenticated && !isMobileBreakpoints
                }
            />

            <section
                className={cn(
                    showSidebar &&
                        isAuthenticated &&
                        'pb-10 px-4 md:pl-5 md:pr-[5rem] lg:pr-[7.5rem] flex gap-8 lg:gap-[6rem]',
                    !paymentPage ? 'min-h-screen' : 'flex-1'
                )}>
                {showSidebar && isAuthenticated && (
                    <Sidebar fullHeight={fullHeightSidebar} />
                )}
                <div
                    className={cn(
                        `min-h-full md:h-[100vh - 65px] w-full`,
                        fullHeightSidebar && 'md:pl-[12rem] lg:pl-[16rem]'
                    )}>
                    {children}
                </div>
            </section>
            {(!isAuthenticated || router.asPath === '/') && <Footer />}
            <Appbar />
        </div>
    );
};

export default Layout;
