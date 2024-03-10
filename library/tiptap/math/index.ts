import {
    REGEX_BLOCK_MATH_DOLLARS,
    REGEX_INLINE_MATH_DOLLARS,
    insertMathCmd
} from '@benrbray/prosemirror-math';
import { Node, InputRule } from '@tiptap/core';
import { NodeType } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import { mathPlugin } from './math-plugin';
import { mathBackspaceCmd } from './math-backspace';

function makeBlockMathInputRule(
    pattern: RegExp,
    nodeType: NodeType,
    getAttrs?: (match: string[]) => any
) {
    return new InputRule({
        find: pattern,
        handler({ state, range, match }) {
            const $start = state.doc.resolve(range.from);
            const attrs =
                getAttrs instanceof Function ? getAttrs(match) : getAttrs;
            if (
                !$start
                    .node(-1)
                    .canReplaceWith(
                        $start.index(-1),
                        $start.indexAfter(-1),
                        nodeType
                    )
            )
                return;

            const { tr } = state;
            const nodeBeforeSize = $start.nodeBefore?.nodeSize ?? 0;
            tr.delete(range.from, range.to).setBlockType(
                range.from,
                range.from,
                nodeType,
                attrs
            );
            tr.insert(
                tr.mapping.map($start.after()),
                state.schema.node('paragraph')
            );
            tr.setSelection(
                NodeSelection.create(
                    tr.doc,
                    tr.mapping.map($start.pos - nodeBeforeSize - 1)
                )
            );
        }
    });
}

function makeInlineMathInputRule(
    pattern: RegExp,
    nodeType: NodeType,
    getAttrs?: (match: string[]) => any
) {
    return new InputRule({
        find: pattern,
        handler({ state, match, range }) {
            const $start = state.doc.resolve(range.from);
            const index = $start.index();
            const $end = state.doc.resolve(range.to);

            const attrs =
                getAttrs instanceof Function ? getAttrs(match) : getAttrs;
            if (!$start.parent.canReplaceWith(index, $end.index(), nodeType)) {
                return;
            }
            state.tr.replaceRangeWith(
                range.from,
                range.to,
                nodeType.create(attrs, nodeType.schema.text(match[1]))
            );
        }
    });
}

export const MathDisplay = Node.create({
    name: 'math_display',
    group: 'block math',
    content: 'text*',
    atom: true,
    code: true,
    priority: 10,
    renderHTML() {
        return ['math-display', { class: 'math-node' }, 0];
    },
    parseHTML() {
        return [{ tag: 'math-display' }];
    },
    addProseMirrorPlugins() {
        return [mathPlugin];
    },
    addInputRules() {
        return [makeBlockMathInputRule(REGEX_BLOCK_MATH_DOLLARS, this.type)];
    }
});

export const MathInline = Node.create({
    name: 'math_inline',
    group: 'inline math',
    content: 'text*',
    inline: true,
    atom: true,
    priority: 10,
    renderHTML() {
        return ['math-inline', { class: 'math-node' }, 0];
    },
    parseHTML() {
        return [{ tag: 'math-inline' }];
    },
    addInputRules() {
        return [makeInlineMathInputRule(REGEX_INLINE_MATH_DOLLARS, this.type)];
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    addCommands() {
        return {
            mathBackspaceCmd:
                () =>
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ({ state, dispatch }) => {
                    return mathBackspaceCmd(state, dispatch);
                }
        };
    },
    addKeyboardShortcuts() {
        return {
            'Mod-Space': ({ editor }) =>
                insertMathCmd(this.type)(editor.state, editor.view.dispatch),
            Backspace: ({ editor }) => {
                return (
                    editor
                        .chain()
                        .deleteSelection()
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        .mathBackspaceCmd()
                        .joinBackward()
                        .selectNodeBackward()
                        .run()
                );
            }
        };
    }
});
