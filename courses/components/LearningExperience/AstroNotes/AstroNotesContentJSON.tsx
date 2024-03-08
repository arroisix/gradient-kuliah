import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Details, Summary } from 'library/tiptap/DetailsSummary';
import UniqueID from 'library/tiptap/UniqueID';
import Video from 'library/tiptap/Video';
import { MathDisplay, MathInline } from 'library/tiptap/math';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';

const extensions = [
    StarterKit,
    Details,
    Summary,
    MathInline,
    MathDisplay,
    UniqueID,
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
    content
}: {
    content: JSONContent;
}): JSX.Element {
    const editor = useEditor({
        content,
        extensions,
        editable: false
    });

    return (
        <EditorContent
            editor={editor}
            className="markdown-table markdown-overflow-break-word markdown-blue-link markdown-img-max-height markdown-body astronotes max-w-[992px] self-center w-full"
            spellCheck="false"
        />
    );
}
