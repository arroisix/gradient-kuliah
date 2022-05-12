import { getIsNewUser } from 'authentication/redux/selectors/userSelector';
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
    setModalAuthOpen: (status: 1 | 0) => void;
    isOnboardingOpen: 1 | 0;
    closeOnboardingModal: (status: 1 | 0) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const [isModalAuthOpen, setModalAuthOpen] = useState<1 | 0>(0);
    const [isOnboardingOpen, setOnboardingOpen] = useState<1 | 0>(0);
    const isNewUser = useSelector(getIsNewUser);

    useEffect(() => {
        if (isNewUser) {
            setOnboardingOpen(1);
        } else {
            setOnboardingOpen(0);
        }
    }, [isNewUser]);

    const closeOnboardingModal = (status: 1 | 0): void => {
        setOnboardingOpen(status);
        window.localStorage.removeItem('nur');
    };

    const memoedValue = useMemo(
        () => ({
            isModalAuthOpen,
            setModalAuthOpen,
            isOnboardingOpen,
            closeOnboardingModal
        }),
        [isModalAuthOpen, isOnboardingOpen]
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
