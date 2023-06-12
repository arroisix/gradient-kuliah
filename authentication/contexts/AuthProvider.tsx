import { useGetProfileQuery } from 'authentication/redux/api/authApi';
import {
    getCurrentUser,
    getIsAuthenticated,
    getIsProfileComplete
} from 'authentication/redux/selectors/userSelector';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo
} from 'react';
import { useSelector } from 'react-redux';

interface AuthContextType {
    isAuthenticated: boolean;
    profile?: UpdateUserResponseData;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const isProfileComplete = useSelector(getIsProfileComplete);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: profile } = useGetProfileQuery({});
    const user = useSelector(getCurrentUser);
    const router = useRouter();

    useEffect(() => {
        if (!isProfileComplete && router.pathname !== '/onboarding') {
            router.push('/onboarding');
        }
    }, [isProfileComplete, router]);

    useEffect(() => {
        if (user.email) {
            posthog.identify(user.email);
        }
    }, [user]);

    const memoedValue = useMemo(
        () => ({
            isAuthenticated,
            profile
        }),
        [isAuthenticated, profile]
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
