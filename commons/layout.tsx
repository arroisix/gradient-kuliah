import { useSelector } from 'react-redux';
import Footer from './components/modules/Footer';
import Navbar from './components/modules/Navbar';
import Sidebar from './components/modules/Sidebar';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { cn } from './utils';
import Appbar from './components/modules/Appbar';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';

interface LayoutProps {
    children?: JSX.Element;
    paymentPage?: boolean;
    shouldTransparent?: boolean;
    courses?: Course[];
    showSidebar?: boolean;
    fullHeightSidebar?: boolean;
    isFullBlackBackground?: boolean;
}

const Layout = ({
    children,
    paymentPage,
    shouldTransparent,
    courses,
    showSidebar,
    fullHeightSidebar,
    isFullBlackBackground
}: LayoutProps): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    const router = useRouter()
    const { is_subscribed } = useCourseSubscription();

    return (
        <div
            className={cn(
                'relative w-screen overflow-x-clip min-h-screen text-white',
                isFullBlackBackground
                    ? 'bg-neutral-1000'
                    : isLandingPageRevampOn
                    ? 'bg-[#101010]'
                    : 'bg-neutral-1000',
                paymentPage && 'flex flex-col'
            )}>
            <Navbar
                paymentPage={paymentPage ?? false}
                shouldTransparent={shouldTransparent ?? false}
                courses={courses}
            />
            <section
                className={cn(
                    showSidebar &&
                        isAuthenticated &&
                        'pt-24 pb-10 px-4 md:pl-5 md:pr-[5rem] lg:pr-[7.5rem] flex gap-[2rem] lg:gap-[6rem]',
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
            {(!is_subscribed || router.asPath  === '/') && <Footer />}
            <Appbar />
        </div>
    );
};

export default Layout;
