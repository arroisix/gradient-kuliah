import { marked } from 'marked';
import markedKatex from 'library/marked-katex';
import DOMPurify from 'isomorphic-dompurify';

const MarkedTextContent = ({
    content,
    className
}: {
    content: string;
    className?: string;
}): JSX.Element => {
    marked.use(
        markedKatex({
            throwOnError: false
        })
    );
    const clean = DOMPurify.sanitize(content);
    return (
        <div
            className={`break-all markdown-body !font-body ${className}`}
            dangerouslySetInnerHTML={{
                __html: marked.parse(clean)
            }}
        />
    );
};

export default MarkedTextContent;
