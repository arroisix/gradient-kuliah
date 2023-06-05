import ModalOnboarding from 'authentication/components/OnboardingModal';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { RegistrationProvider } from 'authentication/contexts/RegistrationProvider';
import Footer from './components/modules/Footer';
import Navbar from './components/modules/Navbar';

interface LayoutProps {
    children?: JSX.Element;
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
    const { isOnboardingOpen, closeOnboardingModal } = useAuth();

    return (
        <div className="relative w-screen min-h-screen text-white bg-neutral-1000">
            <Navbar
                paymentPage={paymentPage ?? false}
                shouldTransparent={shouldTransparent ?? false}
                courses={courses}
            />
            <RegistrationProvider>
                <ModalOnboarding
                    isOpen={isOnboardingOpen}
                    setOpen={closeOnboardingModal}
                />
            </RegistrationProvider>
            <div className="min-h-full">{children}</div>
            <Footer />
        </div>
    );
};

export default Layout;
