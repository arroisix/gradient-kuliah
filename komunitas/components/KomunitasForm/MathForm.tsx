import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { MATH_NOTATION } from './constant';
import { MathfieldElement } from 'mathlive';
import MathLiveEditor from './MathliveEditor';
import { NodeSelection } from '@tiptap/pm/state';
import { useCurrentEditor } from '@tiptap/react';

const MathForm = (): JSX.Element => {
    const mf = useRef<MathfieldElement>(null);
    useEffect(() => {
        if (!mf.current) {
            return;
        }

        MathfieldElement.soundsDirectory = null;
        mf.current.mathVirtualKeyboardPolicy = 'manual';
    }, []);

    const insertNotation = useCallback(
        (latex: string) => mf.current?.insert(latex, { focus: false }),
        []
    );

    const { editor } = useCurrentEditor();

    useEffect(() => {
        const view = editor?.view;
        if (!view || !mf.current) return;

        const { selection } = view.state;
        if (
            !(selection instanceof NodeSelection) ||
            (selection.node.type.name !== 'math_display' &&
                selection.node.type.name !== 'math_inline')
        ) {
            mf.current.value = '';
            return;
        }

        const mathEq = selection.node.maybeChild(0)?.text ?? '';
        if (mathEq !== mf.current.value) {
            mf.current.value = mathEq;
        }
    }, [editor?.state.selection]);

    const updateSelection = useCallback(
        (latex: string) => {
            const view = editor?.view;
            if (!view || !mf.current) return;
            const { selection, schema, tr } = view.state;
            const { math_display, paragraph } = schema.nodes;

            const { to, $from } = selection;
            const from = $from.pos;
            let nodeType = math_display,
                offset = -1,
                nodeFound = false;
            if (
                selection instanceof NodeSelection &&
                (selection.node.type.name == 'math_display' ||
                    selection.node.type.name == 'math_inline')
            ) {
                nodeType = selection.node.type;
                offset++;
                nodeFound = true;
            }

            if (
                $from.nodeBefore &&
                $from.nodeBefore.isInline &&
                nodeType.name === 'math_display'
            ) {
                offset += 2;
            }

            tr.replaceRangeWith(
                from,
                to,
                nodeType.create(null, latex ? schema.text(latex) : null)
            );
            tr.setSelection(NodeSelection.create(tr.doc, from + offset));
            if (!nodeFound) {
                tr.insert(tr.selection.$to.pos, paragraph.create());
            }
            view.dispatch(tr);

            mf.current.focus();
        },
        [editor?.view]
    );

    return (
        <div className="flex flex-col gap-5 py-5">
            <MathLiveEditor
                ref={mf}
                id="tanya-mathfield"
                onInput={(e) => {
                    updateSelection(e.currentTarget.value);
                }}
            />
            <NotationList insertNotation={insertNotation} />
        </div>
    );
};

const NotationList = memo(
    ({ insertNotation }: { insertNotation: (latex: string) => void }) => {
        return (
            <div className="flex flex-wrap items-center justify-center gap-3">
                {MATH_NOTATION.map(({ text, display, latex }, index) => (
                    <button
                        key={index}
                        onClick={() => insertNotation(latex)}
                        className="hover:bg-[#2C2C2C] bg-[#343434] cursor-pointer px-2 py-1 rounded-[4px] text-xs font-body"
                        style={{
                            boxShadow: '0px 2px 0px 0px #00000040'
                        }}>
                        {text ? (
                            text
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}>
                                {`$${display}$`}
                            </ReactMarkdown>
                        )}
                    </button>
                ))}
            </div>
        );
    }
);
NotationList.displayName = 'Notation List';

export default MathForm;
