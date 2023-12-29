import React from 'react';

export function ProseMirrorEditor({
    setMount,
    content,
    className
}: {
    setMount: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    content?: string;
    className?: string;
}) {
    return (
        <div
            ref={setMount}
            id="community-editor"
            className={className}
            spellCheck={false}>
            {content}
        </div>
    );
}
