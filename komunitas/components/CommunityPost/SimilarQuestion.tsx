import { cn } from 'commons/utils';
import Link from 'next/link';
import React from 'react';
import { FaRegEye, FaRegComment } from 'react-icons/fa6';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

type SimilarQuestionProps = {
    question: CommunityPostRecommendation;
} & PropsWithClassName;

const SimilarQuestion = ({
    question,
    className
}: SimilarQuestionProps): JSX.Element => {
    const hasBlockContent = question.preview_content?.includes('$');
    return (
        <Link
            key={question.slug}
            href={`/komunitas/${question.category_slug}/${encodeURIComponent(
                question.slug
            )}`}
            className={cn(
                'flex flex-col gap-4 p-3 rounded-lg shadow-lg bg-neutral-800',
                className
            )}>
            <ReactMarkdown
                className={cn(
                    'markdown-table markdown-overflow-break-word markdown-blue-link markdown-img-max-height markdown-body astronotes text-sm font-semibold whitespace-pre-wrap',
                    hasBlockContent ? 'line-clamp-2' : 'line-clamp-3'
                )}
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                linkTarget={'_blank'}>
                {question.preview_content}
            </ReactMarkdown>
            <div className="grow"></div>
            <div className="flex items-center justify-between">
                <p className="font-bold text-[#B6A6F3] text-xs">
                    {question.category}
                </p>
                <div className="flex items-center gap-4 text-sm font-body text-graphite-400">
                    <div className="flex items-center gap-2">
                        <FaRegEye size={18} />
                        <p>{question.viewer_counts}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaRegComment className="-scale-x-100" size={18} />
                        <p>{question.comment_counts}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SimilarQuestion;
