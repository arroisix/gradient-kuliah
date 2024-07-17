import { ReactNode, createContext, useContext, useState } from 'react';

interface ThemeContextInterface {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

const ThemeContext = createContext({} as ThemeContextInterface);

export const useThemeContext = (): ThemeContextInterface =>
    useContext(ThemeContext);

export const ThemeContextProvider = ({
    children
}: {
    children: ReactNode;
}): JSX.Element => {
    type themeType = 'dark' | 'light';

    const [theme, setTheme] = useState<themeType>('dark');

    const toggleTheme = (): void => {
        localStorage.setItem(`theme`, theme === 'dark' ? 'light' : 'dark');
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // useEffect(() => {
    //     const localTheme = localStorage.getItem('theme');
    //     if (localTheme !== null) {
    //         setTheme(localTheme as themeType);
    //     } else {
    //         setTheme(
    //             window.matchMedia('(prefers-color-scheme: dark)').matches
    //                 ? 'dark'
    //                 : 'light'
    //         );
    //     }
    // }, []);

    // useEffect(() => {
    //     document
    //         .querySelector('html')
    //         ?.classList.add(theme === 'dark' ? 'dark' : 'light');
    //     return () => {
    //         document
    //             .querySelector('html')
    //             ?.classList.remove(theme === 'dark' ? 'dark' : 'light');
    //     };
    // }, [theme]);

    const contextValue = {
        theme,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};
