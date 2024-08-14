import React from 'react';
import PopularProducts from './PopularProducts';
import Link from 'next/link';
import { getBookBaseHref } from 'courses/utils';
import { cn } from 'commons/utils';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import Skeleton from 'commons/components/elements/Skeleton';

type PopularProblemsProps = {
    isLoading?: boolean;
    title: string;
    problems?: PopularBook[];
};

const PopularProblems = ({
    isLoading,
    title,
    problems
}: PopularProblemsProps): JSX.Element => {
    if (isLoading)
        return (
            <PopularProducts title={title}>
                <Skeleton
                    className="h-28 carousel-item w-80"
                    isCustomSize
                    repeat={5}
                />
            </PopularProducts>
        );

    if (!problems) return <></>;
    return (
        <PopularProducts title={title}>
            {problems?.map((problem) => (
                <Link
                    key={problem.problem_slug}
                    href={`${getBookBaseHref(problem.category)}/${
                        problem.book_slug
                    }/${problem.problem_slug}`}
                    className="p-4 flex-col justify-between gap-3 border rounded-lg carousel-item w-80 bg-[#222] border-graphite-600/50">
                    <ReactMarkdown
                        className={cn(
                            'markdown-table markdown-overflow-break-word markdown-blue-link markdown-img-max-height markdown-body astronotes text-sm font-semibold line-clamp-2'
                        )}
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                        linkTarget={'_blank'}>
                        {problem.problem_title}
                    </ReactMarkdown>
                    <div className="flex items-end">
                        <p className="flex-1 text-sm text-graphite-400">
                            {problem.book_title}
                        </p>
                        <div
                            className={cn(
                                'rounded-full text-xs flex-none w-fit text-white font-semibold px-3 py-1 bg-neutral-700',
                                problem.category === 'Textbook' &&
                                    'bg-[#00B78B]',
                                problem.category === 'Bank Soal' &&
                                    'bg-[#0083FF]'
                            )}>
                            {problem.category}
                        </div>
                    </div>
                </Link>
            ))}
        </PopularProducts>
    );
};

export default PopularProblems;
