import {
    getCurrentUser,
    getIsAuthenticated,
    getIsNewUser
} from 'authentication/redux/selectors/userSelector';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useSelector } from 'react-redux';

interface AuthContextType {
    isModalAuthOpen: 1 | 0;
    setModalAuthOpen: (
        status: 1 | 0,
        isPermanent?: boolean,
        redirectPath?: string
    ) => void;
    isOnboardingOpen: 1 | 0;
    closeOnboardingModal: (status: 1 | 0) => void;
    isPermanent: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const [isModalAuthOpen, setModalAuthOpenState] = useState<1 | 0>(0);
    const [isOnboardingOpen, setOnboardingOpen] = useState<1 | 0>(0);
    const [isPermanent, setIsPermanent] = useState(false);
    const [redirectPath, setRedirectPath] = useState<string>();
    const isNewUser = useSelector(getIsNewUser);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const user = useSelector(getCurrentUser);
    const router = useRouter();

    useEffect(() => {
        if (isNewUser) {
            setOnboardingOpen(1);

            if (redirectPath) {
                router.push(redirectPath);
            }
        } else {
            setOnboardingOpen(0);
        }
    }, [isNewUser]);

    useEffect(() => {
        if (isAuthenticated) {
            setModalAuthOpen(0);
            setIsPermanent(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (user.email) {
            posthog.identify(user.email);
        }
    }, [user]);

    const setModalAuthOpen = (
        status: 1 | 0,
        isNeedPermanent?: boolean,
        redirectPath?: string
    ): void => {
        setModalAuthOpenState(status);

        if (isNeedPermanent) {
            setIsPermanent(true);
        }

        if (redirectPath) {
            setRedirectPath(redirectPath);
        }

        if (status === 0) {
            setRedirectPath(undefined);
        }
    };

    const closeOnboardingModal = (status: 1 | 0): void => {
        setOnboardingOpen(status);
        window.localStorage.removeItem('nur');
    };

    const memoedValue = useMemo(
        () => ({
            isModalAuthOpen,
            setModalAuthOpen,
            isOnboardingOpen,
            closeOnboardingModal,
            isPermanent,
            isAuthenticated
        }),
        [isModalAuthOpen, isOnboardingOpen, isPermanent, isAuthenticated]
    );

    return (
        <AuthContext.Provider value={memoedValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    return useContext(AuthContext);
};

export default AuthContext;
