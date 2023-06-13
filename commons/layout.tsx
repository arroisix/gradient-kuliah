import { useSelector } from 'react-redux';
import Footer from './components/modules/Footer';
import Navbar from './components/modules/Navbar';
import Sidebar from './components/modules/Sidebar';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

interface LayoutProps {
    children?: JSX.Element;
    paymentPage?: boolean;
    shouldTransparent?: boolean;
    courses?: Course[];
    showSidebar?: boolean;
    fullHeightSidebar?: boolean;
}

const Layout = ({
    children,
    paymentPage,
    shouldTransparent,
    courses,
    showSidebar,
    fullHeightSidebar
}: LayoutProps): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <div className="relative w-screen min-h-screen text-white bg-neutral-1000">
            <Navbar
                paymentPage={paymentPage ?? false}
                shouldTransparent={shouldTransparent ?? false}
                courses={courses}
            />
            <section
                className={`min-h-screen ${
                    showSidebar && isAuthenticated
                        ? 'pt-24 pb-10 px-4 md:pl-5 md:pr-[5rem] lg:pr-[7.5rem] flex gap-[2rem] lg:gap-[6rem]'
                        : ''
                }`}>
                {showSidebar && isAuthenticated && (
                    <Sidebar fullHeight={fullHeightSidebar} />
                )}
                <div
                    className={`min-h-full md:h-[100vh - 65px] w-full ${
                        fullHeightSidebar ? 'md:pl-[12rem] lg:pl-[16rem]' : ''
                    }`}>
                    {children}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Layout;
