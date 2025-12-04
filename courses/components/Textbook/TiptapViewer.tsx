import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Text from '@tiptap/extension-text';
import Color from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import { Details, Summary } from 'library/tiptap/DetailsSummary';
import Video from 'library/tiptap/Video';
import { MathDisplay, MathInline } from 'library/tiptap/math';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { Link } from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { type Content, EditorContent, useEditor } from '@tiptap/react';
import { cn } from 'commons/utils';
import { useEffect } from 'react';

const extensions = [
    StarterKit,
    Details,
    Summary,
    MathInline,
    MathDisplay,
    Video,
    Image.configure({ inline: true }),
    Placeholder.configure({
        includeChildren: true,
        placeholder: ({ node }) => {
            if (node.type.name === 'summary') {
                return 'Summary';
            }
            return '';
        }
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph']
    }),
    Document,
    Paragraph,
    Text,
    TextStyle,
    Color.configure({
        types: ['textStyle']
    }),
    Table,
    TableCell,
    TableRow,
    TableHeader,
    Underline,
    Link.configure({
        validate: (href) => /^https?:\/\//.test(href)
    })
];

const TiptapViewer = ({
    content,
    className,
    onContentReady
}: {
    content: Content;
    onContentReady?: () => void;
} & PropsWithClassName): JSX.Element => {
    const editor = useEditor({
        content,
        extensions,
        editable: false
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(content);
            // Trigger callback setelah konten di-set
            setTimeout(() => {
                onContentReady?.();
            }, 50);
        }
    }, [content, editor, onContentReady]);

    return (
        <div className="grid w-full grid-cols-1">
            <EditorContent
                editor={editor}
                className={cn(
                    'markdown-table markdown-overflow-break-word markdown-blue-link markdown-img-max-height markdown-body astronotes w-full',
                    className
                )}
                spellCheck="false"
            />
        </div>
    );
};

export default TiptapViewer;
