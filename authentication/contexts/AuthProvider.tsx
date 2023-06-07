import {
    getCurrentUser,
    getIsAuthenticated,
    getIsNewUser
} from 'authentication/redux/selectors/userSelector';
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
    const [isOnboardingOpen, setOnboardingOpen] = useState<1 | 0>(0);
    const [isPermanent, setIsPermanent] = useState(false);
    const isNewUser = useSelector(getIsNewUser);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const user = useSelector(getCurrentUser);

    useEffect(() => {
        if (isNewUser) {
            setOnboardingOpen(1);
        } else {
            setOnboardingOpen(0);
        }
    }, [isNewUser]);

    useEffect(() => {
        if (isAuthenticated) {
            setIsPermanent(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (user.email) {
            posthog.identify(user.email);
        }
    }, [user]);

    const closeOnboardingModal = (status: 1 | 0): void => {
        setOnboardingOpen(status);
        window.localStorage.removeItem('nur');
    };

    const memoedValue = useMemo(
        () => ({
            isOnboardingOpen,
            closeOnboardingModal,
            isPermanent,
            isAuthenticated
        }),
        [isOnboardingOpen, isPermanent, isAuthenticated]
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
