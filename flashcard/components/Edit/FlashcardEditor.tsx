import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { MathDisplay, MathInline } from 'komunitas/mathPlugin';
import { Markdown } from 'tiptap-markdown';
import '@benrbray/prosemirror-math/style/math.css';
import 'prosemirror-view/style/prosemirror.css';

interface FlashcardEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    isAnswer?: boolean;
    onImagePaste?: (file: File) => void;
}

const FlashcardEditor = ({
    value,
    onChange,
    placeholder,
    isAnswer,
    onImagePaste
}: FlashcardEditorProps): JSX.Element => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            Placeholder.configure({ placeholder }),
            MathDisplay,
            MathInline
        ],
        content: value,
        editorProps: {
            handlePaste: (view, event) => {
                if (onImagePaste && event.clipboardData?.items) {
                    const items = Array.from(event.clipboardData.items);
                    for (const item of items) {
                        if (item.type.startsWith('image/')) {
                            const file = item.getAsFile();
                            if (file) {
                                onImagePaste(file);
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.storage.markdown.getMarkdown());
        }
    });

    const baseClassName =
        'bg-[#222222] rounded-lg p-3 pb-10 text-white resize-none border-none outline-none placeholder:text-neutral-500';
    const className = isAnswer
        ? `w-full min-h-[120px] h-full ${baseClassName}`
        : `w-full min-h-[120px] ${baseClassName}`;

    return <EditorContent editor={editor} className={className} />;
};

export default FlashcardEditor;
