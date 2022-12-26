import ModalAuth from 'authentication/components/ModalAuth';
import ModalOnboarding from 'authentication/components/OnboardingModal';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { RegistrationProvider } from 'authentication/contexts/RegistrationProvider';
import Navbar from './components/modules/Navbar';

interface LayoutProps {
    children: JSX.Element;
    paymentPage?: boolean;
    shouldTransparent?: boolean;
    courses?: Course[];
}

const LearnLayout = ({
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
