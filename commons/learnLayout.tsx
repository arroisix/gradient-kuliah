import ModalOnboarding from 'authentication/components/OnboardingModal';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { RegistrationProvider } from 'authentication/contexts/RegistrationProvider';
import Navbar from './components/modules/Navbar';

interface LayoutProps {
    children: JSX.Element;
    paymentPage?: boolean;
    shouldTransparent?: boolean;
    courses?: Course[];
    hideNavbar?: boolean;
    lightMode?: boolean;
}

const LearnLayout = ({
    children,
    paymentPage,
    shouldTransparent,
    courses,
    hideNavbar,
    lightMode
}: LayoutProps): JSX.Element => {
    const { isOnboardingOpen, closeOnboardingModal } = useAuth();

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
            <RegistrationProvider>
                <ModalOnboarding
                    isOpen={isOnboardingOpen}
                    setOpen={closeOnboardingModal}
                />
            </RegistrationProvider>
            <div className="min-h-full md:h-[100vh - 65px]">{children}</div>
        </div>
    );
};

export default LearnLayout;
