import Navbar from './components/modules/Navbar';
import Sidebar from './components/modules/Sidebar';
import Appbar from './components/modules/Appbar';
import { cn } from './utils';
import { useState } from 'react';
import CourseProgress from 'courses/containers/courseProgress';
import { useRouter } from 'next/router';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import { useGetCourseProgressV2Query } from 'courses/redux/api/courseV2Api';
import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';

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
    const isCoursePage = router.pathname === '/kelas';
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: courseProgresses, isLoading } = useGetCourseProgressV2Query(undefined, {skip: !isAuthenticated});
    const { data: activePacket } = useGetActiveSubscriptionQuery(undefined, {skip: !isAuthenticated});

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
                    showSidebar &&
                        'pt-16 pb-10 flex gap-[2rem] lg:gap-[6rem] w-full',
                    !closeReminder && showSubscriptionReminder && showSidebar
                        ? 'pt-36'
                        : !closeReminder && showSubscriptionReminder
                        ? 'pt-11'
                        : undefined
                )}>
                {showSidebar && <Sidebar fullHeight={fullHeightSidebar} />}
                <div className={cn(
                    'w-full',
                    showSidebar && fullHeightSidebar && 'md:ml-[250px]'
                )}>
                    {isAuthenticated &&
                    isCoursePage &&
                    activePacket &&
                    activePacket.subscription_id &&
                    courseProgresses &&
                    courseProgresses.length > 0 && (
                        <div className="px-0 bg-[#1D1D1D] text-white py-8 overflow-x-hidden">
                            <CourseProgress
                                courseProgresses={courseProgresses}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                    <div className={cn(
                        'px-4 md:px-0 pt-12 w-full',
                        fullHeightSidebar && 'md:px-8 xl:px-12'
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
