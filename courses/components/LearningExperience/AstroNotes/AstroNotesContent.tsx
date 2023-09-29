import Skeleton from 'commons/components/elements/Skeleton';
import { cn, isNotNullAndUndefined } from 'commons/utils';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetBookProgressQuery } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { fontClassName } from './constants';

const AstroNotesContent = (): JSX.Element => {
    const { smallText, fontStyle } = useAstronotes();
    const router = useRouter();
    const { slug, page } = router.query;
    const { is_subscribed } = useCourseSubscription();

    const { data, isLoading, isFetching, isError } = useGetBookProgressQuery(
        { slug: slug as string, page: page as unknown as number },
        { skip: !isNotNullAndUndefined(slug) || !isNotNullAndUndefined(page) }
    );

    if (!is_subscribed) return <NeedSubscribe />;

    if (isLoading || isFetching)
        return (
            <Skeleton repeat={8} className="h-6 [&:nth-child(4n+1)]:w-1/3" />
        );

    if (isError) {
        router.push('/not-found');
        return <></>;
    }

    if (data)
        return (
            <div
                // TODO(angga): removed until higher in priority
                // onMouseUp={handleHighlight}
                // onMouseOverCapture={handleHover}
                aria-hidden>
                <ReactMarkdown
                    className={cn(
                        'markdown-table markdown-overflow-break-word markdown-blue-link markdown-img-max-height markdown-body astronotes',
                        fontClassName[fontStyle],
                        smallText
                            ? 'text-xs sm:text-sm'
                            : 'text-sm sm:text-base'
                    )}
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                    linkTarget={'_blank'}>
                    {data?.page_content}
                </ReactMarkdown>
            </div>
        );

    return <></>;
};

export default AstroNotesContent;
