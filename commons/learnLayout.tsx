import Navbar from './components/modules/Navbar';
import Sidebar from './components/modules/Sidebar';
import Appbar from './components/modules/Appbar';
import { cn } from './utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Footer from './components/modules/Footer';
import SubscriptionReminder from './components/modules/Navbar/components/SubscriptionReminder';
import { useThemeContext } from './contexts/ThemeProvider';

interface LayoutProps {
    children: JSX.Element;
    paymentPage?: boolean;
    noPadding?: boolean;
    shouldTransparent?: boolean;
    courses?: Course[];
    hideNavbar?: boolean;
    showSidebar?: boolean;
    fullHeightSidebar?: boolean;
    lightMode?: boolean;
    showSubscriptionReminder?: boolean;
}

const LearnLayout = ({
    children,
    paymentPage,
    noPadding,
    shouldTransparent,
    courses,
    hideNavbar,
    showSidebar,
    fullHeightSidebar,
    showSubscriptionReminder
}: LayoutProps): JSX.Element => {
    const { theme } = useThemeContext();
    const lightMode = theme === 'light';
    const { is_subscribed: isSubscribed } = useCourseSubscription();

    return (
        <>
            <div
                className={cn(
                    'w-screen min-h-screen text-white overflow-clip overscroll-none',
                    lightMode ? 'bg-white' : 'bg-black'
                )}>
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
                        <SubscriptionReminder
                            show={showSubscriptionReminder}
                            showSidebar={showSidebar}
                        />
                    </>
                )}
                <div
                    className={cn(
                        'pt-16',
                        showSidebar && 'flex gap-[2rem] lg:gap-[6rem] w-full',
                        {
                            'pb-16': isSubscribed && !noPadding,
                            'pb-8': !isSubscribed && !noPadding,
                            'pb-0': noPadding
                        }
                    )}>
                    {showSidebar && isSubscribed && (
                        <Sidebar fullHeight={fullHeightSidebar} />
                    )}
                    <div
                        className={cn('w-full', {
                            'md:ml-[250px]':
                                showSidebar &&
                                fullHeightSidebar &&
                                isSubscribed,
                            'lg:px-16 xl:px-12': !noPadding
                        })}>
                        <div
                            className={cn(
                                'px-4 md:px-0 w-full',
                                fullHeightSidebar && 'md:px-8 xl:px-12',
                                !isSubscribed && 'pt-5'
                            )}>
                            {children}
                        </div>
                    </div>
                </div>
                <Appbar />
            </div>

            {!isSubscribed && <Footer />}
        </>
    );
};

export default LearnLayout;
