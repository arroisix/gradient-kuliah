import { useSelector } from 'react-redux';
import Navbar from './components/modules/Navbar';
import Sidebar from './components/modules/Sidebar';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

interface LayoutProps {
    children: JSX.Element;
    paymentPage?: boolean;
    shouldTransparent?: boolean;
    courses?: Course[];
    hideNavbar?: boolean;
    showSidebar?: boolean;
    fullHeightSidebar?: boolean;
    lightMode?: boolean;
}

const LearnLayout = ({
    children,
    paymentPage,
    shouldTransparent,
    courses,
    hideNavbar,
    showSidebar,
    fullHeightSidebar,
    lightMode
}: LayoutProps): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <div className="relative w-screen min-h-screen text-white bg-neutral-1000">
            {!hideNavbar && (
                <Navbar
                    lightMode={lightMode}
                    paymentPage={paymentPage ?? false}
                    shouldTransparent={shouldTransparent ?? false}
                    courses={courses}
                    showSidebar={showSidebar}
                    fullHeightSidebar={fullHeightSidebar}
                />
            )}
            <section
                className={`min-h-screen ${
                    showSidebar && isAuthenticated
                        ? 'pt-24 pb-10 px-4 md:px-0 flex gap-[2rem] lg:gap-[6rem]'
                        : 'pt-24'
                }`}>
                {showSidebar && isAuthenticated && (
                    <Sidebar fullHeight={fullHeightSidebar} />
                )}
                <div
                    className={`min-h-full md:h-[100vh - 65px] w-full ${
                        fullHeightSidebar && isAuthenticated
                            ? 'md:pl-[18rem] lg:pl-[19rem] md:pr-[2rem] lg:pr-[7.5rem]'
                            : ''
                    }`}>
                    {children}
                </div>
            </section>
        </div>
    );
};

export default LearnLayout;
