import {
    getIsAuthenticated,
    getIsNewUser
} from 'authentication/redux/selectors/userSelector';
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
    setModalAuthOpen: (status: 1 | 0, isPermanent?: boolean) => void;
    isOnboardingOpen: 1 | 0;
    closeOnboardingModal: (status: 1 | 0) => void;
    isPermanent: boolean;
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
    const isNewUser = useSelector(getIsNewUser);
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (isNewUser) {
            setOnboardingOpen(1);
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

    const setModalAuthOpen = (
        status: 1 | 0,
        isNeedPermanent?: boolean
    ): void => {
        setModalAuthOpenState(status);

        if (isNeedPermanent) {
            setIsPermanent(true);
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
            isPermanent
        }),
        [isModalAuthOpen, isOnboardingOpen, isPermanent]
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
