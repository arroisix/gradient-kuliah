import { cn } from 'commons/utils';
import React from 'react';
import { BiListUl } from 'react-icons/bi';
import { BsChat } from 'react-icons/bs';
import { FaCircleCheck } from 'react-icons/fa6';
import { FiBookmark } from 'react-icons/fi';
import { SlGraduation } from 'react-icons/sl';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import SearchResultThumbnail from './SearchResultThumbnail';
import Link from 'next/link';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';

const SearchResultCard = (props: SearchResultCardProps): JSX.Element => {
    const {
        href,
        title,
        desc,
        course,
        chapter,
        subchapter,
        type,
        commentCount,
        isAnswered
    } = props;
    const router = useRouter();
    const { q, type: currentTab } = router.query as { q: string; type: string };
    const tracker = useTracker();

    const track = (): void => {
        tracker?.genericTrack('Click Search Result', {
            Keyword: q,
            Tab: currentTab,
            'Product Type': type,
            'Product Slug': href
        });
    };

    return (
        <Link
            onClick={track}
            href={href}
            className="w-full flex flex-col md:flex-row md:min-h-32 border rounded-lg bg-[#222] border-graphite-600/50">
            <div className="w-full aspect-[2/1] md:aspect-[4/3] md:max-w-32 lg:min-w-48 relative">
                <SearchResultThumbnail {...props} />
            </div>
            <div className="flex flex-col gap-2 p-4 [&_mark]:text-[#FFDD8E] [&_mark]:bg-transparent">
                {isAnswered && (
                    <div className="flex items-center gap-1 px-2 py-1 text-xs rounded-md text-[#43B75D] bg-state-success/50 w-max">
                        <FaCircleCheck size={14} />
                        Terjawab
                    </div>
                )}
                <Highlight
                    className={cn(
                        'text-sm font-semibold',
                        type === 'textbook_problem'
                            ? 'text-pretty'
                            : 'text-balance line-clamp-2'
                    )}>
                    {title}
                </Highlight>
                {desc && (
                    <Highlight
                        className={cn(
                            'text-xs text-pretty line-clamp-2',
                            type === 'textbook_problem' &&
                                'font-bold text-graphite-400'
                        )}>
                        {type === 'textbook_problem' ? desc : `... ${desc} ...`}
                    </Highlight>
                )}
                <div className="grow"></div>
                <div className="flex flex-wrap divide-x gap-x-3 gap-y-2 text-graphite-400 divide-graphite-600">
                    <div className="flex gap-2">
                        <SlGraduation />
                        <Highlight className="text-xs">{course}</Highlight>
                    </div>
                    {chapter && (
                        <div className="flex gap-1 pl-3">
                            <FiBookmark />
                            <Highlight className="text-xs">{chapter}</Highlight>
                        </div>
                    )}
                    {subchapter && (
                        <div className="flex gap-1 pl-3">
                            <BiListUl />
                            <Highlight className="text-xs line-clamp-1">
                                {subchapter}
                            </Highlight>
                        </div>
                    )}
                    {commentCount !== undefined && (
                        <div className="flex gap-1 pl-3">
                            <BsChat className="-scale-x-100" />
                            <p className="text-xs">{commentCount} jawaban</p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

const Highlight = ({
    className,
    children
}: { children: string } & PropsWithClassName): JSX.Element => {
    return (
        <ReactMarkdown
            className={cn(className)}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}>
            {children}
        </ReactMarkdown>
    );
};

export default SearchResultCard;
