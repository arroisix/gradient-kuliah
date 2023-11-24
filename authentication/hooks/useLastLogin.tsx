import { useLocalStorage } from 'usehooks-ts';

export const useLastLogin = () => {
    const [lastLogin, setLastLogin] = useLocalStorage<{
        email: string | null;
        method: string | null;
    }>('lastLogin', {
        email: null,
        method: null
    });

    return { lastLogin, setLastLogin };
};
