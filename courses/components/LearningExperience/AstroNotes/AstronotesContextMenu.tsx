import React from 'react';

type AstronotesContextMenuProps = {
    points: { x: number; y: number; width: number };
    setHighlighted: React.Dispatch<React.SetStateAction<boolean>>;
    transform?: string;
    children: React.ReactNode;
};

const AstronotesContextMenu = ({
    points,
    setHighlighted,
    transform = '',
    children
}: AstronotesContextMenuProps): JSX.Element => {
    return (
        <>
            <div
                className="absolute w-screen h-screen top-0 left-0 bg-transparent z-[1]"
                onClick={() => setHighlighted(false)}
                aria-hidden
            />
            <div
                style={{
                    position: 'absolute',
                    zIndex: '2',
                    top: points.y + 24,
                    left: points.x,
                    transform: transform
                }}>
                {children}
            </div>
        </>
    );
};

export default AstronotesContextMenu;
