import Navbar from './components/modules/Navbar';
import Sidebar from './components/modules/Sidebar';
import Appbar from './components/modules/Appbar';
import { cn } from './utils';
import { useState } from 'react';

interface LayoutProps {
    children: JSX.Element;
    paymentPage?: boolean;
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
    shouldTransparent,
    courses,
    hideNavbar,
    showSidebar,
    fullHeightSidebar,
    lightMode,
    showSubscriptionReminder
}: LayoutProps): JSX.Element => {
    const [closeReminder, setCloseReminder] = useState(true);

    return (
        <div className="relative w-screen min-h-screen text-white overflow-x-clip bg-neutral-1000">
            {!hideNavbar && (
                <Navbar
                    lightMode={lightMode}
                    paymentPage={paymentPage ?? false}
                    shouldTransparent={shouldTransparent ?? false}
                    courses={courses}
                    showSidebar={showSidebar}
                    fullHeightSidebar={fullHeightSidebar}
                    showSubscriptionReminder={showSubscriptionReminder}
                    setCloseReminder={setCloseReminder}
                />
            )}
            <section
                className={cn(
                    showSidebar &&
                        'pt-24 pb-10 px-4 md:px-0 flex gap-[2rem] lg:gap-[6rem]',
                    !closeReminder && showSubscriptionReminder && showSidebar
                        ? 'pt-36'
                        : !closeReminder && showSubscriptionReminder
                        ? 'pt-11'
                        : undefined
                )}>
                {showSidebar && <Sidebar fullHeight={fullHeightSidebar} />}
                <div
                    className={cn(
                        'min-h-full w-screen ',
                        fullHeightSidebar && 'md:px-8 xl:px-12',
                        showSidebar && fullHeightSidebar && 'md:ml-[250px]'
                    )}>
                    {children}
                </div>
            </section>
            <Appbar />
        </div>
    );
};

export default LearnLayout;
