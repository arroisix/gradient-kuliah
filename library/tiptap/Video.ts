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
            },
            width: {
                default: '100%',
            },
            height: {
                default: 'auto',
            },
        
        };
    },
    parseHTML() {
        return [
            {
                tag: 'video',
                getAttrs: (node: string | HTMLElement) => {
                    // Ensure the node is an HTMLElement before trying to access attributes
                    if (node instanceof HTMLElement) {
                        return {
                            src: node.getAttribute('src'),
                            width: node.getAttribute('width') || '100%',
                            height: node.getAttribute('height') || 'auto'
                        };
                    }
                    return null; // Return null if it's not an HTMLElement
                }
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'video', 
            mergeAttributes(HTMLAttributes, { 
                controls: true, 
                style: `width: ${HTMLAttributes.width}; height: ${HTMLAttributes.height};` 
            })
        ];
    }
});
