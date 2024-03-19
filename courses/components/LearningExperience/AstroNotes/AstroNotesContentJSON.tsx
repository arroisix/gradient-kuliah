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
import { EditorContent, useEditor } from '@tiptap/react';
import { cn } from 'commons/utils';

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
    TableHeader
];

export default function AstroNotesContentJSON({
    content,
    className
}: {
    content: any;
    className?: string;
}): JSX.Element {
    const editor = useEditor({
        content,
        extensions,
        editable: false
    });

    return (
        <EditorContent
            editor={editor}
            className={cn(
                'markdown-table markdown-overflow-break-word markdown-blue-link markdown-img-max-height markdown-body astronotes max-w-[992px] self-center w-full',
                className
            )}
            spellCheck="false"
        />
    );
}
