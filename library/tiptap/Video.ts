import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
    name: 'video', // unique name for the Node
    group: 'inline', // belongs to the 'block' group of extensions
    inline: true,
    selectable: true, // so we can select the video
    draggable: true, // so we can drag the video
    atom: true, // is a single unit
    addAttributes() {
        return {
            src: {
                default: null
            }
        };
    },
    parseHTML() {
        return [
            {
                tag: 'video'
            }
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['video', mergeAttributes(HTMLAttributes, { controls: true })];
    }
});
