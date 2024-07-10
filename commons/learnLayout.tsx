import Navbar from './components/modules/Navbar';
import Sidebar from './components/modules/Sidebar';
import Appbar from './components/modules/Appbar';
import { cn } from './utils';
import { useState } from 'react';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Footer from './components/modules/Footer';

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
    lightMode,
    showSubscriptionReminder
}: LayoutProps): JSX.Element => {
    const [closeReminder, setCloseReminder] = useState(true);
    const { is_subscribed } = useCourseSubscription();

    return (
        <>
            <div
                className={cn(
                    'w-screen min-h-screen text-white overflow-clip',
                    lightMode ? 'bg-white' : 'bg-neutral-1000'
                )}>
                {!hideNavbar && (
                    <Navbar
                        lightMode={lightMode}
                        paymentPage={paymentPage ?? false}
                        noPadding={noPadding}
                        shouldTransparent={shouldTransparent ?? false}
                        courses={courses}
                        showSidebar={showSidebar}
                        fullHeightSidebar={fullHeightSidebar}
                        showSubscriptionReminder={showSubscriptionReminder}
                        setCloseReminder={setCloseReminder}
                    />
                )}
                <div
                    className={cn(
                        showSidebar &&
                            'pt-16 flex gap-[2rem] lg:gap-[6rem] w-full',
                        !closeReminder && showSubscriptionReminder && 'pt-11',
                        {
                            'pb-16': is_subscribed && !noPadding,
                            'pb-8': !is_subscribed && !noPadding,
                            'pb-0': noPadding
                        }
                    )}>
                    {showSidebar && is_subscribed && (
                        <Sidebar fullHeight={fullHeightSidebar} />
                    )}
                    <div
                        className={cn('w-full', {
                            'md:ml-[250px]':
                                showSidebar &&
                                fullHeightSidebar &&
                                is_subscribed,
                            'lg:px-16 xl:px-12': !noPadding
                        })}>
                        <div
                            className={cn(
                                'px-4 md:px-0 w-full',
                                fullHeightSidebar && 'md:px-8 xl:px-12',
                                !is_subscribed && 'pt-5'
                            )}>
                            {children}
                        </div>
                    </div>
                </div>
                <Appbar />
            </div>

            {!is_subscribed && <Footer />}
        </>
    );
};

export default LearnLayout;
