import React, {
    createContext,
    MutableRefObject,
    ReactNode,
    useContext,
    useMemo,
    useRef
} from 'react';

interface ParallaxContextType {
    parallaxRef: MutableRefObject<HTMLDivElement>;
}

const ParallaxContext = createContext<ParallaxContextType>(
    {} as ParallaxContextType
);

export function ParallaxProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const parallaxRef = useRef({} as HTMLDivElement);

    const memoedValue = useMemo(() => ({ parallaxRef }), [parallaxRef]);

    return (
        <ParallaxContext.Provider value={memoedValue}>
            {children}
        </ParallaxContext.Provider>
    );
}

export const useParallax = (): ParallaxContextType => {
    return useContext(ParallaxContext);
};

export default ParallaxContext;
