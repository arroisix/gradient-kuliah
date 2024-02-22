import {
    ReactNode,
    RefObject,
    createContext,
    useContext,
    useLayoutEffect,
    useRef,
    useState
} from 'react';

interface GridContextType {
    cellWidth?: number;
    gapWidth?: number;
    screenWidth?: number;
    cellRef?: RefObject<HTMLDivElement>;
    gridContainerRef?: RefObject<HTMLDivElement>;
}

const GridContext = createContext<GridContextType>({} as GridContextType);

export function GridProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const [screenWidth, setScreenWidth] = useState<number>();
    const [cellWidth, setCellWidth] = useState<number>();
    const [gapWidth, setGapWidth] = useState<number>();
    const cellRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const updateCellAndGapWidth = () => {
            if (cellRef.current) {
                setCellWidth(cellRef.current.offsetWidth);

                const screenWidth = window.innerWidth;
                setScreenWidth(screenWidth);

                const gapWidthInRem =
                    screenWidth >= 1024 ? 1 : screenWidth >= 768 ? 0.25 : 1;
                const gapWidthInPixels = gapWidthInRem * 16;
                setGapWidth(gapWidthInPixels);

                clearInterval(firstRenderInterval);
            }
        };

        const firstRenderInterval = setInterval(() => {
            updateCellAndGapWidth();
        }, 100);

        window.addEventListener('resize', updateCellAndGapWidth);

        return () =>
            window.removeEventListener('resize', updateCellAndGapWidth);
    }, []);

    return (
        <GridContext.Provider
            value={{
                cellWidth: cellWidth,
                gapWidth: gapWidth,
                screenWidth: screenWidth,
                cellRef: cellRef
            }}>
            {children}
        </GridContext.Provider>
    );
}

export const useGrid = (): GridContextType => {
    return useContext(GridContext);
};

export default GridContext;
