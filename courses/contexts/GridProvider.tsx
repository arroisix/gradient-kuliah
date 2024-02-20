import { ReactNode, RefObject, createContext, useContext, useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    const updateCellWidth = () => {
      if (cellRef.current) {
        setCellWidth(cellRef.current.offsetWidth);
      }
    };
    updateCellWidth();
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