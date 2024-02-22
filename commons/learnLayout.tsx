import Navbar from './components/modules/Navbar';
import Sidebar from './components/modules/Sidebar';
import Appbar from './components/modules/Appbar';
import { cn } from './utils';
import { useState } from 'react';
import CourseProgress from 'courses/containers/courseProgress';
import { useRouter } from 'next/router';

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
    const router = useRouter();
    const isCoursePage = (router.pathname === '/kelas');

    return (
        <div className="w-screen text-white bg-neutral-1000">
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
            <div
                className={cn(
                    showSidebar && 'pt-16 pb-10 flex gap-[2rem] lg:gap-[6rem] w-full',
                    !closeReminder && showSubscriptionReminder && showSidebar ? 
                        'pt-36'
                        : !closeReminder && showSubscriptionReminder
                        ? 'pt-11'
                        : undefined
                )}
            >
                {showSidebar && <Sidebar fullHeight={fullHeightSidebar} />}
                <div className={cn(
                    'w-full',
                    showSidebar && fullHeightSidebar && 'md:ml-[250px]'
                )}>
                    <div className={cn(
                        "px-4 md:px-0 text-white py-8 overflow-x-hidden",
                    )}>
                        {isCoursePage && <CourseProgress />}
                    </div>
                    <div className={cn(
                        'px-4 md:px-0 pt-12 w-full',
                        fullHeightSidebar && 'md:px-8 xl:px-12',
                    )}>
                        {children}
                    </div>
                </div>
            </div>
            <Appbar />
        </div>
    );
};

export default LearnLayout;
