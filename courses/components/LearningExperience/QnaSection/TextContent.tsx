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
            dangerouslySetInnerHTML={{
                __html: marked.parse(content)
            }}
        />
    );
};

export default TextContent;
