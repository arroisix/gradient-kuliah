import { cn } from 'commons/utils';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import Link from 'next/link';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';
import FlashcardLargeIcon from 'dashboard/assets/FlashcardLargeIcon';
import Cards from 'flashcard/assets/Cards';

interface FlashcardSearchResultCardProps {
    href: string;
    title: string;
    question?: string;
    attachments?: string[];
    author?: {
        name: string;
        photo_profile: string;
    };
    order?: number;
}

const FlashcardSearchResultCard = ({
    href,
    title,
    question,
    attachments,
    author,
    order
}: FlashcardSearchResultCardProps): JSX.Element => {
    const router = useRouter();
    const { q, type: currentTab } = router.query as { q: string; type: string };
    const tracker = useTracker();

    const track = (): void => {
        tracker?.genericTrack('Click Search Result', {
            Keyword: q,
            Tab: currentTab,
            'Product Type': 'flashcard',
            'Product Slug': href
        });
    };

    return (
        <Link
            onClick={track}
            href={href}
            className="w-full flex md:min-h-32 border rounded-lg bg-[#222] border-graphite-600/50">
            <div className="w-full aspect-[2/1] md:aspect-[4/3] md:max-w-32 lg:min-w-48 relative">
                {attachments?.[0] ? (
                    <img
                        src={attachments[0]}
                        alt={title}
                        className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                    />
                ) : (
                    <div className="w-full h-full bg-[#2C2C2C] rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex items-center justify-center">
                        <FlashcardLargeIcon />
                    </div>
                )}
            </div>
            <div className="flex flex-col flex-1 min-w-0 p-4 [&_mark]:text-[#FFDD8E] [&_mark]:bg-transparent">
                <Highlight className="text-lg font-semibold mb-2">
                    {title}
                </Highlight>
                {question && (
                    <Highlight className="text-xs text-pretty text-graphite-400 mb-4">
                        {question}
                    </Highlight>
                )}
                <div className="flex items-center gap-2 mt-auto text-xs text-graphite-400">
                    {author && (
                        <>
                            {author.photo_profile ? (
                                <img
                                    src={author.photo_profile}
                                    alt={author.name}
                                    className="w-5 h-5 rounded-full"
                                />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-[#5F2BCE] flex items-center justify-center text-white">
                                    {author.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span>{author.name}</span>
                            <div className="text-[#666666]">|</div>
                        </>
                    )}
                    {typeof order === 'number' && (
                        <div className="flex items-center gap-2">
                            <Cards />
                            <span>Card {order + 1}</span>
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

export default FlashcardSearchResultCard;
