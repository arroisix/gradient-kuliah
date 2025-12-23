import Navbar from './components/modules/Navbar';
import Sidebar from './components/modules/Sidebar';
import Appbar from './components/modules/Appbar';
import { cn } from './utils';
import Footer from './components/modules/Footer';
import SubscriptionReminder from './components/modules/Navbar/components/SubscriptionReminder';
import { useThemeContext } from './contexts/ThemeProvider';
import useWindowBreakpoints from './hooks/useWindowBreakpoints';
import dynamic from 'next/dynamic';
import K12Paywall from './components/elements/K12Paywall';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
const AppInstallBanner = dynamic(
    () => import('./components/modules/Navbar/components/AppInstallBanner')
);

interface LayoutProps {
    children: JSX.Element;
    paymentPage?: boolean;
    noPadding?: boolean;
    noTopPadding?: boolean;
    shouldTransparent?: boolean;
    courses?: Course[];
    hideNavbar?: boolean;
    showSidebar?: boolean;
    fullHeightSidebar?: boolean;
    lightMode?: boolean;
    showSubscriptionReminder?: boolean;
    className?: string;
}

const LearnLayout = ({
    children,
    paymentPage,
    noPadding,
    noTopPadding,
    shouldTransparent,
    courses,
    hideNavbar,
    showSidebar,
    fullHeightSidebar,
    showSubscriptionReminder,
    className
}: LayoutProps): JSX.Element => {
    const { theme } = useThemeContext();
    const lightMode = theme === 'light';
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <>
            <div
                className={cn(
                    'w-screen min-h-screen text-white overflow-clip overscroll-none',
                    lightMode ? 'bg-white' : 'bg-black',
                    className
                )}>
                <K12Paywall />
                {!hideNavbar && (
                    <>
                        <Navbar
                            paymentPage={paymentPage ?? false}
                            noPadding={noPadding}
                            shouldTransparent={shouldTransparent ?? false}
                            courses={courses}
                            showSidebar={showSidebar}
                            fullHeightSidebar={fullHeightSidebar}
                            showSubscriptionReminder={showSubscriptionReminder}
                        />
                        <AppInstallBanner
                            showSidebar={
                                showSidebar &&
                                isAuthenticated &&
                                !isMobileBreakpoints
                            }
                        />
                        <SubscriptionReminder
                            show={showSubscriptionReminder}
                            showSidebar={showSidebar}
                        />
                    </>
                )}
                {hideNavbar && (
                    <AppInstallBanner
                        showSidebar={showSidebar && isAuthenticated}
                    />
                )}
                <div
                    className={cn(
                        'md:pt-16',
                        !noTopPadding && 'pt-16',
                        showSidebar && 'flex gap-[2rem] lg:gap-[6rem] w-full',
                        {
                            'pb-16': isAuthenticated && !noPadding,
                            'pb-8': !isAuthenticated && !noPadding,
                            'pb-0': noPadding
                        }
                    )}>
                    {showSidebar && isAuthenticated && (
                        <Sidebar fullHeight={fullHeightSidebar} />
                    )}
                    <div
                        className={cn('w-full', {
                            'md:pl-[250px]':
                                showSidebar &&
                                fullHeightSidebar &&
                                isAuthenticated
                        })}>
                        <div
                            className={cn(
                                'px-4 md:px-0 w-full font-inter',
                                {
                                    'md:px-8 lg:px-12':
                                        fullHeightSidebar &&
                                        isAuthenticated &&
                                        !noPadding,
                                    'md:px-8 lg:px-24':
                                        fullHeightSidebar &&
                                        !isAuthenticated &&
                                        !noPadding
                                },
                                !isAuthenticated && 'pt-5'
                            )}>
                            {children}
                        </div>
                    </div>
                </div>
                <Appbar />
            </div>

            {!isAuthenticated && <Footer />}
        </>
    );
};

export default LearnLayout;
