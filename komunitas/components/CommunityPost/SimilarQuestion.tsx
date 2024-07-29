import { cn } from 'commons/utils';
import Link from 'next/link';
import React from 'react';
import { FaRegEye, FaRegComment } from 'react-icons/fa6';

type SimilarQuestionProps = {
    question: CommunityPostRecommendation;
} & PropsWithClassName;

const SimilarQuestion = ({
    question,
    className
}: SimilarQuestionProps): JSX.Element => {
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
            <p className="overflow-hidden text-xs text-ellipsis">
                {question.preview_content}
            </p>
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
