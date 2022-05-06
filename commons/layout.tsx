import ModalAuth from 'authentication/components/ModalAuth';
import ModalOnboarding from 'authentication/components/OnboardingModal';
import { useAuth } from 'authentication/contexts/AuthProvider';
import Footer from './components/modules/Footer';
import Navbar from './components/modules/Navbar';

interface LayoutProps {
    children: JSX.Element;
    paymentPage?: boolean;
    shouldTransparent?: boolean;
    courses?: Course[];
}

const Layout = ({
    children,
    paymentPage,
    shouldTransparent,
    courses
}: LayoutProps): JSX.Element => {
    const {
        isModalAuthOpen,
        setModalAuthOpen,
        isOnboardingOpen,
        closeOnboardingModal
    } = useAuth();

    return (
        <div className="min-h-screen w-screen bg-neutral-1000 relative text-white">
            <Navbar
                paymentPage={paymentPage ?? false}
                shouldTransparent={shouldTransparent ?? false}
                courses={courses}
            />
            <ModalAuth isOpen={isModalAuthOpen} setOpen={setModalAuthOpen} />
            <ModalOnboarding
                isOpen={isOnboardingOpen}
                setOpen={closeOnboardingModal}
            />
            <div className="min-h-full">{children}</div>
            <Footer />
        </div>
    );
};

export default Layout;
