import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { MathDisplay, MathInline } from 'komunitas/mathPlugin';
import { Markdown } from 'tiptap-markdown';
import '@benrbray/prosemirror-math/style/math.css';
import 'prosemirror-view/style/prosemirror.css';
import { useEffect, useState } from 'react';
import AttachedImage from './AttachedImage';

interface FlashcardEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    isAnswer?: boolean;
    cardId?: string;
}

const FlashcardEditor = ({
    value,
    onChange,
    placeholder,
    isAnswer,
    cardId
}: FlashcardEditorProps): JSX.Element => {
    const [hasImage, setHasImage] = useState(false);
    const [imageMarkdown, setImageMarkdown] = useState<string>('');

    useEffect(() => {
        const match = value.match(/!\[.*?\]\((.*?)\)/);
        if (match) {
            setImageMarkdown(match[0]);
            setHasImage(true);
        } else {
            setImageMarkdown('');
            setHasImage(false);
        }
    }, [value]);

    const handleRemoveImage = () => {
        const newValue = value.replace(/!\[.*?\]\((.*?)\)/g, '').trim();
        onChange(newValue);
        setImageMarkdown('');
        setHasImage(false);
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            Placeholder.configure({ placeholder }),
            MathDisplay,
            MathInline
        ],
        content: value.replace(/!\[.*?\]\((.*?)\)/g, ''),
        onUpdate: ({ editor }) => {
            const editorContent = editor.storage.markdown.getMarkdown();
            const newValue = hasImage
                ? `${editorContent}\n\n${imageMarkdown}`
                : editorContent;
            onChange(newValue);
        }
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(value);
        }
    }, [editor, cardId]);

    const baseClassName =
        'flex flex-col bg-[#222222] rounded-lg p-3 pb-10 text-white resize-none border-none outline-none placeholder:text-neutral-500';
    const className = isAnswer
        ? `w-full min-h-[120px] h-full ${baseClassName}`
        : `w-full min-h-[120px] ${baseClassName}`;

    return (
        <div className={className}>
            <EditorContent editor={editor} />
            {hasImage && (
                <div className="pb-2">
                    <AttachedImage onRemove={handleRemoveImage} />
                </div>
            )}
        </div>
    );
};

export default FlashcardEditor;
