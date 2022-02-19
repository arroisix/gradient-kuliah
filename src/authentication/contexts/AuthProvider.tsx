import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import useLogin from '../hooks/useLogin';
import { toast } from 'react-toastify';
import useRegister from '../hooks/useRegister';
import { useRouter } from 'next/router';
import useGoogle from '../hooks/useGoogle';
import useUpdate from '../hooks/useUpdate';
import { AuthInputBaseType } from '../components/ModalAuth';
import { renderName } from 'src/commons/utils';

interface AuthContextType {
    isModalAuthOpen: 1 | 0;
    setModalAuthOpen: (status: 1 | 0) => void;
    isAuthenticated: () => boolean;
    isOnboardingOpen: 1 | 0;
    closeOnboardingModal: (status: 1 | 0) => void;
    login: (input: AuthInputBaseType) => Promise<void>;
    logout: () => void;
    register: (input: AuthInputBaseType) => Promise<void>;
    update: (input: UpdateUserInputType) => Promise<void>;
    googleLogin: (token: string) => Promise<void>;
    loading: boolean;
    success: boolean;
    user: User;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const [user, setUser] = useState<User>({} as User);
    const router = useRouter();
    const [isModalAuthOpen, setModalAuthOpen] = useState<1 | 0>(0);
    const [isOnboardingOpen, setOnboardingOpen] = useState<1 | 0>(0);
    const { loginAction, loginData } = useLogin();
    const { updateAction } = useUpdate();
    const { registerAction, registerData } = useRegister();
    const { googleAction, googleData } = useGoogle();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const logUserIn = (data: AuthenticationPayload): void => {
        if (data !== null && data !== undefined) {
            window.localStorage.setItem('token', data?.token);
            window.localStorage.setItem('user', JSON.stringify(data?.payload));
            setUser(data?.payload);

            toast.success(
                `Selamat datang, ${renderName(
                    data?.payload?.email,
                    data?.payload?.fullName
                )}`,
                {
                    position: toast.POSITION.TOP_CENTER
                }
            );
        }
    };

    useEffect(() => {
        logUserIn(googleData?.googleLogin as AuthenticationPayload);
    }, [googleData]);

    useEffect(() => {
        logUserIn(registerData?.register as AuthenticationPayload);
    }, [registerData]);

    useEffect(() => {
        logUserIn(loginData?.login as AuthenticationPayload);
    }, [loginData]);

    useEffect(() => {
        const token = window.localStorage.getItem('token');
        const rawUser = window.localStorage.getItem('user');
        const nurFlag = window.localStorage.getItem('nur');
        if (token && rawUser) {
            setUser(JSON.parse(rawUser));
        }

        if (nurFlag) {
            setOnboardingOpen(1);
        }
    }, []);

    const login = async (input: AuthInputBaseType): Promise<void> => {
        setSuccess(false);
        setLoading(true);

        const request = await loginAction({
            variables: {
                ...input
            }
        });

        if (!request.errors) {
            setSuccess(true);
        }
        setLoading(false);
    };

    const update = async (input: UpdateUserInputType): Promise<void> => {
        setLoading(true);

        const request = await updateAction({
            variables: {
                data: input
            }
        });

        if (request.data.userUpdate?.payload) {
            window.localStorage.setItem(
                'user',
                JSON.stringify(request.data.userUpdate?.payload)
            );
            closeOnboardingModal(0);
        }

        setLoading(false);
    };

    const googleLogin = async (token: string): Promise<void> => {
        setSuccess(false);
        setLoading(true);

        const request = await googleAction({
            variables: {
                token
            }
        });

        if (request.data.googleLogin?.isNewUser) {
            window.localStorage.setItem('nur', '1');
            setOnboardingOpen(1);
        }

        if (!request.errors) {
            setSuccess(true);
        }
        setLoading(false);
    };

    const register = async (input: AuthInputBaseType): Promise<void> => {
        setSuccess(false);
        setLoading(true);

        const request = await registerAction({
            variables: {
                ...input
            }
        });

        if (!request.errors) {
            setSuccess(true);
            // new user registered flag
            window.localStorage.setItem('nur', '1');
            setOnboardingOpen(1);
        }
        setLoading(false);
    };

    const logout = (): void => {
        setUser({} as User);
        window.localStorage.clear();
        router.replace('/');
        toast.success('Sampai jumpa kembali!', {
            position: toast.POSITION.TOP_CENTER
        });
    };

    const isAuthenticated = (): boolean => {
        return user.id !== undefined;
    };

    const closeOnboardingModal = (status: 1 | 0): void => {
        setOnboardingOpen(status);
        window.localStorage.removeItem('nur');
    };

    const memoedValue = useMemo(
        () => ({
            isModalAuthOpen,
            setModalAuthOpen,
            login,
            loading,
            success,
            user,
            isAuthenticated,
            register,
            googleLogin,
            logout,
            isOnboardingOpen,
            closeOnboardingModal,
            update
        }),
        [isModalAuthOpen, loading, success, user, isOnboardingOpen]
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
