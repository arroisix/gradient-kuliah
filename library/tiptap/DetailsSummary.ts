import { Node, isNodeActive, mergeAttributes } from '@tiptap/core';

const canToggle = (event: MouseEvent) => {
    return (
        event.target &&
        event.target instanceof HTMLElement &&
        event.target.closest('summary')
    );
};

export const Details = Node.create({
    name: 'details',
    group: 'block',
    content: 'summary block+',
    addAttributes() {
        return {
            open: {
                default: false
            }
        };
    },
    // @ts-ignore
    addCommands() {
        return {
            unsetDetails:
                () =>
                // @ts-ignore
                ({ editor, chain, state }) => {
                    if (!isNodeActive(state, 'details')) return false;

                    const detailsNodePos = editor
                        .$pos(state.selection.anchor)
                        .closest('details');
                    const details = detailsNodePos?.node;
                    const summary = detailsNodePos?.firstChild;
                    const paragraphSummary =
                        state.schema.nodes.paragraph.create(
                            null,
                            summary?.textContent
                                ? state.schema.text(summary.textContent)
                                : null
                        );
                    const detailsContent = details?.content.replaceChild(
                        0,
                        paragraphSummary
                    );

                    const from = detailsNodePos?.from ?? 0;

                    return chain()
                        .setNodeSelection(from - 1)
                        .deleteSelection()
                        .focus()
                        .insertContentAt(
                            from - 1,
                            detailsContent
                                ?.toJSON()
                                .slice(summary?.content.size ? 0 : 1)
                        )
                        .focus()
                        .run();
                },
            setDetails:
                () =>
                // @ts-ignore
                ({ editor, chain, state }) => {
                    const { anchor } = state.selection;
                    const currentNodePos = editor.$pos(anchor);

                    const selectionContent = state.selection
                        .content()
                        .content.toJSON();

                    let command = chain();

                    if (!selectionContent) {
                        command = command.deleteRange(currentNodePos.range);
                    } else {
                        command = command.deleteSelection();
                    }

                    const from = selectionContent
                        ? state.selection.from
                        : currentNodePos.from;

                    command = command.insertContentAt(from, {
                        type: 'details',
                        attrs: {
                            open: true
                        },
                        content: [
                            { type: 'summary' },
                            ...(!selectionContent?.length &&
                            !currentNodePos.content.toJSON()
                                ? [{ type: 'paragraph' }]
                                : selectionContent ?? [
                                      currentNodePos.node.toJSON()
                                  ])
                        ]
                    });

                    return command
                        .setTextSelection(from + 1)
                        .focus()
                        .run();
                }
        };
    },
    parseHTML() {
        return [
            {
                tag: 'details',
                getAttrs(node) {
                    if (typeof node === 'string') {
                        return false;
                    }
                    return { open: node.hasAttribute('open') };
                }
            }
        ];
    },
    renderHTML({ node, HTMLAttributes }) {
        return [
            'details',
            mergeAttributes(HTMLAttributes, {
                open: node.attrs.open
            }),
            0
        ];
    },
    addNodeView() {
        return ({ node, getPos, editor }) => {
            const dom = document.createElement('details');
            if (node.attrs.open) {
                dom.open = true;
            }

            dom.addEventListener('click', (event) => {
                if (typeof getPos === 'boolean') {
                    return;
                }

                if (canToggle(event)) {
                    const { open } = node.attrs;
                    const tr = editor.state.tr.setNodeMarkup(
                        getPos(),
                        undefined,
                        {
                            ...node.attrs,
                            open: !open
                        }
                    );
                    editor.view.dispatch(tr);
                }
            });

            return {
                dom,
                contentDOM: dom,
                update(node) {
                    return node.type.name === 'details';
                }
            };
        };
    }
});

export const Summary = Node.create({
    name: 'summary',
    content: 'inline*',
    parseHTML() {
        return [
            {
                tag: 'summary'
            }
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['summary', HTMLAttributes, 0];
    },
    addKeyboardShortcuts() {
        return {
            Backspace: ({ editor }) => {
                const { from } = editor.state.selection;
                const currentNode = editor.state.selection.$from.node();
                if (
                    currentNode.type != this.type ||
                    currentNode.content.size != 0
                ) {
                    return false;
                }

                return (
                    editor
                        .chain()
                        // @ts-ignore
                        .unsetDetails()
                        .setTextSelection(from - 1)
                        .run()
                );
            }
        };
    }
});
