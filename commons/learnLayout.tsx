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
                />
            )}
            <section
                className={`min-h-screen ${
                    showSidebar && isAuthenticated
                        ? 'pt-24 pb-10 px-4 md:pl-5 md:pr-[5rem] lg:pr-[7.5rem] flex gap-[3rem] lg:gap-[10rem]'
                        : ''
                }`}>
                {showSidebar && isAuthenticated && (
                    <Sidebar fullHeight={fullHeightSidebar} />
                )}
                <div className="min-h-full md:h-[100vh - 65px] w-full">
                    {children}
                </div>
            </section>
        </div>
    );
};

export default LearnLayout;
