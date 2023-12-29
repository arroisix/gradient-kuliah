import {
    REGEX_BLOCK_MATH_DOLLARS,
    REGEX_INLINE_MATH_DOLLARS,
    insertMathCmd,
    mathPlugin
} from '@benrbray/prosemirror-math';
import { Node } from '@tiptap/react';
import { makeBlockMathInputRule, makeInlineMathInputRule } from './utils';

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
    },
    addStorage() {
        return {
            markdown: {
                serialize(state: any, node: any) {
                    const fence = '$$';
                    state.write(fence + '\n');
                    state.text(node.textContent, false);
                    state.write('\n' + fence);
                    state.closeBlock(node);
                }
            }
        };
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
    addKeyboardShortcuts() {
        return {
            'Mod-Space': ({ editor }) =>
                insertMathCmd(this.type)(editor.state, editor.view.dispatch)
        };
    },
    addStorage() {
        return {
            markdown: {
                serialize(state: any, node: any) {
                    state.write(`$${node.textContent}$`);
                }
            }
        };
    }
});
