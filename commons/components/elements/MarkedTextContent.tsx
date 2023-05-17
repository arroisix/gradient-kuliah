import { marked } from 'marked';
import markedKatex from 'library/marked-katex';

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
    return (
        <div
            className={`break-all markdown-body !font-body ${className}`}
            dangerouslySetInnerHTML={{
                __html: marked.parse(content)
            }}
        />
    );
};

export default MarkedTextContent;
