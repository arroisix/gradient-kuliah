import ModalAuth from 'src/authentication/components/ModalAuth';
import ModalOnboarding from 'src/authentication/components/OnboardingModal';
import { useAuth } from 'src/authentication/contexts/AuthProvider';
// import Footer from './components/modules/Footer';
import Navbar from './components/modules/Navbar';

interface LayoutProps {
    children: JSX.Element;
    paymentPage?: boolean;
    shouldTransparent?: boolean;
}

const Layout = ({
    children,
    paymentPage,
    shouldTransparent
}: LayoutProps): JSX.Element => {
    const {
        isModalAuthOpen,
        setModalAuthOpen,
        isOnboardingOpen,
        closeOnboardingModal
    } = useAuth();

    return (
        <div className="min-h-screen overflow-x-hidden bg-neutral-1000 relative text-white">
            <Navbar
                paymentPage={paymentPage ?? false}
                shouldTransparent={shouldTransparent ?? false}
            />
            <ModalAuth isOpen={isModalAuthOpen} setOpen={setModalAuthOpen} />
            <ModalOnboarding
                isOpen={isOnboardingOpen}
                setOpen={closeOnboardingModal}
            />
            <div className="min-h-full">{children}</div>
            {/* <Footer /> */}
        </div>
    );
};

export default Layout;
