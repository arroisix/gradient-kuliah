import { marked } from 'marked';
import markedKatex from 'library/marked-katex';
import DOMPurify from 'isomorphic-dompurify';

const TextContent = ({
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
            className={`break-word markdown-body w-full ${
                className
                    ? className
                    : '!text-black !font-normal !font-body !leading-7'
            }`}
            dangerouslySetInnerHTML={{
                __html: marked.parse(clean)
            }}
        />
    );
};

export default TextContent;
