import { InputRule } from '@tiptap/react';
import { NodeType } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';

export function makeBlockMathInputRule(
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

export function makeInlineMathInputRule(
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
            // get attrs
            const attrs =
                getAttrs instanceof Function ? getAttrs(match) : getAttrs;
            // check if replacement valid
            if (!$start.parent.canReplaceWith(index, $end.index(), nodeType)) {
                return;
            }
            // perform replacement
            state.tr.replaceRangeWith(
                range.from,
                range.to,
                nodeType.create(attrs, nodeType.schema.text(match[1]))
            );
        }
    });
}

//const inlineMathInputRule = makeInlineMathInputRule(
//    REGEX_INLINE_MATH_DOLLARS,
//    schema.nodes.math_inline
//);
//const blockMathInputRule = makeBlockMathInputRule(
//    REGEX_BLOCK_MATH_DOLLARS,
//    schema.nodes.math_display
//);

//export const plugins: Plugin[] = [
//    history(),
//    keymap({ 'Mod-z': undo, 'Mod-y': redo }),
//    mathPlugin,
//    keymap({
//        'Mod-Space': insertMathCmd(schema.nodes.math_inline),
//        Backspace: chainCommands(
//            deleteSelection,
//            mathBackspaceCmd,
//            joinBackward,
//            selectNodeBackward
//        )
//    }),
//    keymap(baseKeymap),
//    inputRules({ rules: [inlineMathInputRule, blockMathInputRule] })
//];

//export const markdownSerializer = new MarkdownSerializer(
//    {
//        math_inline(state, node) {
//            state.write(`$${node.textContent}$`);
//        },
//        math_display(state, node) {
//            const fence = '$$';
//            state.write(fence + '\n');
//            state.text(node.textContent, false);
//            state.write('\n');
//            state.write(fence);
//            state.closeBlock(node);
//        }
//    }
//);

//export function getMarkdownString(doc: Node) {
//    return markdownSerializer.serialize(doc);
//}
