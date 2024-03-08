import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { nanoid } from 'nanoid';

export default Extension.create({
    addGlobalAttributes() {
        return [
            {
                types: ['heading'],
                attributes: {
                    id: {
                        default: null,
                        renderHTML(attributes) {
                            return {
                                id: attributes.id
                            };
                        },
                        parseHTML(element) {
                            return element.id;
                        }
                    }
                }
            }
        ];
    },
    addProseMirrorPlugins() {
        return [
            new Plugin({
                appendTransaction(transactions, _, newState) {
                    const { tr } = newState;
                    const documentHasChanged = transactions.some(
                        (tr) => tr.docChanged
                    );
                    if (!documentHasChanged) {
                        return null;
                    }

                    tr.doc.descendants((child, pos) => {
                        if (child.type.name != 'heading' || child.attrs.id) {
                            return;
                        }

                        const attrs = { ...child.attrs, id: nanoid() };
                        tr.setNodeMarkup(pos, undefined, attrs);
                    });

                    return tr.steps.length > 0 ? tr : null;
                }
            })
        ];
    }
});
