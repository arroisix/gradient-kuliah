import { marked } from 'marked';
import markedKatex from 'library/marked-katex';

const TextContent = ({ content }: { content: string }): JSX.Element => {
    marked.use(
        markedKatex({
            throwOnError: false
        })
    );
    return (
        <div
            className="break-word markdown-body w-full !text-black !font-normal !font-body !leading-7"
            dangerouslySetInnerHTML={{
                __html: marked.parse(content)
            }}
        />
    );
};

export default TextContent;
