import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';

import 'katex/dist/katex.min.css'; //
import rehypeKatex from 'rehype-katex';
import NeedSubscribe from 'courses/components/NeedSubscribe';

const LearnNotebook = ({ notebook }: { notebook: Notebook }): JSX.Element => {
    return (
        <div className="w-full h-full pb-48 overflow-x-hidden">
            <div className="mb-4 border-b border-neutral-600">
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                    {notebook?.title}
                </h3>
                <p className="text-base text-neutral-600 mb-4">
                    Oleh {notebook?.authors[0]?.name}
                </p>
            </div>
            <div className="min-h-[50vh] notebook">
                {notebook?.content !== null ? (
                    <ReactMarkdown
                        remarkPlugins={[
                            remarkParse,
                            remarkGfm,
                            remarkMath,
                            remarkBreaks
                        ]}
                        rehypePlugins={[
                            rehypeKatex,
                            rehypeStringify,
                            rehypeRaw
                        ]}>
                        {notebook?.content}
                    </ReactMarkdown>
                ) : (
                    <NeedSubscribe />
                )}
            </div>
            <div className="border-b border-neutral-600 my-4" />
            <div className="mb-16">
                <h5 className="text-2xl font-bold mb-4">
                    Referensi (APA Style)
                </h5>
                {notebook?.references?.split('||').map((reference) => (
                    <p
                        className="text-base my-2 text-neutral-400"
                        key={reference}>
                        {reference}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default LearnNotebook;
