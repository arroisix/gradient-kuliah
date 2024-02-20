import { ReactNode, RefObject, createContext, useContext, useLayoutEffect, useRef, useState } from 'react';

interface GridContextType {
  cellWidth?: number;
  cellRef?: RefObject<HTMLDivElement>;
}

const GridContext = createContext<GridContextType>({} as GridContextType);

export function GridProvider({
  children
}: {
  children: ReactNode
}): JSX.Element {

  const [cellWidth, setCellWidth] = useState<number>();
  const cellRef = useRef<HTMLDivElement>(null);
  const [firstRender, setFirstRender] = useState(true);

  useLayoutEffect(() => {
    const updateCellWidth = () => {
      if (cellRef.current) {
        setCellWidth(cellRef.current.offsetWidth);
        clearInterval(firstRenderInterval);
      }
    };

    const firstRenderInterval = setInterval(() => {
      updateCellWidth();
    }, 100)

    window.addEventListener('resize', updateCellWidth);

    return () => window.removeEventListener('resize', updateCellWidth);
  }, []); 

  return (
    <GridContext.Provider value={{
      cellWidth: cellWidth,
      cellRef: cellRef,
    }}>
      {children}
    </GridContext.Provider>
  );
}

export const useGrid = (): GridContextType => {
  return useContext(GridContext);
}

export default GridContext;