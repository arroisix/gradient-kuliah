import { marked } from 'marked';
import markedKatex from 'library/marked-katex';
import DOMPurify from 'isomorphic-dompurify';

const TextContent = ({ content }: { content: string }): JSX.Element => {
    marked.use(
        markedKatex({
            throwOnError: false
        })
    );
    const clean = DOMPurify.sanitize(content);
    return (
        <div
            className="break-all markdown-body max-w-[50vw]"
            dangerouslySetInnerHTML={{
                __html: marked.parse(clean)
            }}
        />
    );
};

export default TextContent;
