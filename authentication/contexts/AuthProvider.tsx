import { H } from '@highlight-run/next/client';
import { useGetProfileQuery } from 'authentication/redux/api/authApi';
import {
    getCurrentUser,
    getIsAuthenticated,
    getIsProfileComplete
} from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo
} from 'react';
import { useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';

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
    const { data: profile } = useGetProfileQuery(
        {},
        {
            skip: !localStorage.getItem('token')
        }
    );
    const user = useSelector(getCurrentUser);
    const router = useRouter();

    useEffect(() => {
        if (!isProfileComplete && router.pathname !== '/onboarding' && router.pathname !== '/keluar-perangkat') {
            router.push('/onboarding');
        }
    }, [isProfileComplete, router]);

    const { is_subscribed, isLoading: isLoadingSubscribed } =
        useCourseSubscription();
    const tracker = useTracker();
    useEffect(() => {
        if (user.email && profile && !isLoadingSubscribed) {
            tracker?.identify({
                email: user.email,
                fullName: profile.full_name,
                phoneNumber: profile.phone_number,
                isSubscribed: is_subscribed
            });
            H.identify(user.email, {
                fullName: profile.full_name,
                phoneNumber: profile.phone_number,
                isSubscribed: is_subscribed
            });
        }
    }, [user, profile, is_subscribed, isLoadingSubscribed]);

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
