declare global {
    // eslint-disable-next-line
    namespace JSX {
        interface IntrinsicElements {
            'math-field': React.DetailedHTMLProps<
                React.HTMLAttributes<MathfieldElement>,
                MathfieldElement
            >;
        }
    }
}

import React, { useImperativeHandle, forwardRef, useRef } from 'react';
import 'mathlive';
import { MathfieldElement } from 'mathlive';

const MathLiveEditor = forwardRef(
    ({ children, ...props }: React.HTMLAttributes<MathfieldElement>, ref) => {
        const _ref = useRef<MathfieldElement>(null);
        useImperativeHandle(ref, () => _ref.current, [_ref]);

        return (
            <math-field ref={_ref} {...props}>
                {children}
            </math-field>
        );
    }
);

MathLiveEditor.displayName = 'Mathlive Editor';
export default MathLiveEditor;
