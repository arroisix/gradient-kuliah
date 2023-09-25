import React, {
    createContext,
    useContext,
    useState,
    type Dispatch,
    type SetStateAction,
    type PropsWithChildren
} from 'react';

interface AstronotesContextType extends AstronotesState {
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
    setHighlighted: Dispatch<SetStateAction<boolean>>;
    setRemoveHighlighted: Dispatch<SetStateAction<boolean>>;
    setHighlightId: Dispatch<SetStateAction<string>>;
    setDataHighlighted: Dispatch<
        SetStateAction<DataHighlightedInterface | null>
    >;
    setPoints: Dispatch<
        SetStateAction<{ x: number; y: number; width: number }>
    >;
    setFontStyle: Dispatch<SetStateAction<AstronotesFontStyle>>;
    setSmallText: Dispatch<SetStateAction<boolean>>;
    handleHover: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleHighlight: () => void;
}

const AstronotesContext = createContext<AstronotesContextType>(
    {} as AstronotesContextType
);

export function AstronotesProvider({
    children
}: PropsWithChildren): JSX.Element {
    const [navigation, setNavigation] = useState<NavigationTypes>('CLOSE');
    const [highlighted, setHighlighted] = useState<boolean>(false);
    const [removeHighlighted, setRemoveHighlighted] = useState<boolean>(false);
    const [highlightId, setHighlightId] = useState<string>('');
    const [dataHighlighted, setDataHighlighted] =
        useState<DataHighlightedInterface | null>(null);
    const [points, setPoints] = useState<{
        x: number;
        y: number;
        width: number;
    }>({ x: 0, y: 0, width: 0 });
    const [fontStyle, setFontStyle] = useState<AstronotesFontStyle>('DEFAULT');
    const [smallText, setSmallText] = useState<boolean>(false);

    const handleHighlight = (): void => {
        const objectSelection = window.getSelection();
        const selectedNode = objectSelection?.anchorNode?.parentElement;
        const selectedId = selectedNode?.id;
        const isHighlighted = !!selectedNode?.getAttribute('data-highlight');

        if (objectSelection?.anchorNode !== objectSelection?.focusNode) return;
        if (objectSelection?.anchorOffset === objectSelection?.focusOffset)
            return;
        if (isHighlighted) return;

        setPoints({
            x: objectSelection?.getRangeAt(0).getBoundingClientRect()
                .x as number,
            y: objectSelection?.getRangeAt(0).getBoundingClientRect()
                .y as number,
            width: objectSelection?.getRangeAt(0).getBoundingClientRect()
                .width as number
        });
        setHighlighted(true);
        setDataHighlighted({
            block_content_id: selectedId as string,
            text: selectedNode?.textContent as string,
            anchor_offset: objectSelection?.anchorOffset as number,
            focus_offset: objectSelection?.focusOffset as number
        });
    };

    const handleHover = (event: React.MouseEvent<HTMLDivElement>): void => {
        const selectedNode = event.target as HTMLDivElement;
        const isHighlighted = !!selectedNode?.getAttribute('data-highlight');
        const highlightId = selectedNode.getAttribute('id');

        if (isHighlighted) {
            setPoints({
                x: selectedNode.getBoundingClientRect().x as number,
                y: selectedNode.getBoundingClientRect().y as number,
                width: selectedNode.getBoundingClientRect().width as number
            });
            setHighlightId(highlightId as string);
            setRemoveHighlighted(true);
        }
    };

    const appState: AstronotesContextType = {
        navigation,
        setNavigation,
        highlighted,
        setHighlighted,
        removeHighlighted,
        setRemoveHighlighted,
        highlightId,
        setHighlightId,
        dataHighlighted,
        setDataHighlighted,
        points,
        setPoints,
        fontStyle,
        setFontStyle,
        smallText,
        setSmallText,
        handleHighlight,
        handleHover
    };

    return (
        <AstronotesContext.Provider value={appState}>
            {children}
        </AstronotesContext.Provider>
    );
}

export function useAstronotes(): AstronotesContextType {
    const context = useContext(AstronotesContext);
    if (context === undefined) {
        throw new Error(
            'useAstronotes must be used within an AstronotesProvider'
        );
    }
    return context;
}
