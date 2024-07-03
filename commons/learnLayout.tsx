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
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Footer from './components/modules/Footer';
import Breadcrumb from './components/modules/Breadcrumb';

interface LayoutProps {
    children: JSX.Element;
    paymentPage?: boolean;
    bookReader?: boolean;
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
    bookReader,
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
    const { data: courseProgresses, isLoading } = useGetCourseProgressV2Query(
        undefined,
        { skip: !isAuthenticated }
    );
    const { data: activePacket } = useGetActiveSubscriptionQuery(undefined, {
        skip: !isAuthenticated
    });
    const { is_subscribed, everSubscribed } = useCourseSubscription();

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
                        bookReader={bookReader}
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
                            'pb-16': is_subscribed && !bookReader,
                            'pb-8': !is_subscribed && !bookReader,
                            'pb-0': bookReader
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
                            'lg:px-16 xl:px-12': !bookReader
                        })}>
                        {router.pathname === '/kelas' && (
                            <Breadcrumb
                                className={cn(
                                    'w-full px-4 md:px-8 xl:px-12',
                                    is_subscribed || everSubscribed
                                        ? 'pb-5'
                                        : 'pt-5'
                                )}
                            />
                        )}
                        {isAuthenticated &&
                            isCoursePage &&
                            activePacket &&
                            activePacket.subscription_id &&
                            courseProgresses &&
                            courseProgresses.length > 0 && (
                                <div className="course-progress px-0 bg-[#1D1D1D] text-white py-8 overflow-x-hidden">
                                    <CourseProgress
                                        courseProgresses={courseProgresses}
                                        isLoading={isLoading}
                                    />
                                </div>
                            )}
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
