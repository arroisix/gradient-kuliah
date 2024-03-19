import Skeleton from 'commons/components/elements/Skeleton';
import { cn, isNotNullAndUndefined } from 'commons/utils';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import {
    useGetBookProgressQuery,
    useGetPublicBookPreviewQuery
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { fontClassName } from './constants';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import AstronotesPaywall from './AstronotesPaywall';
import AstroNotesContentJSON from './AstroNotesContentJSON';

const AstroNotesContent = (): JSX.Element => {
    const { smallText, fontStyle } = useAstronotes();
    const router = useRouter();
    const { slug, page } = router.query;
    const { is_subscribed } = useCourseSubscription();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    const isAuthenticated = useSelector(getIsAuthenticated);
    const privateQueryResult = useGetBookProgressQuery(
        { slug: slug as string, page: page as unknown as number },
        {
            skip:
                !isAuthenticated ||
                !is_subscribed ||
                !isNotNullAndUndefined(slug) ||
                !isNotNullAndUndefined(page)
        }
    );
    const publicQueryResult = useGetPublicBookPreviewQuery(
        { slug: slug as string },
        {
            skip:
                !isLandingPageRevampOn ||
                (isAuthenticated && is_subscribed) ||
                !isNotNullAndUndefined(slug)
        }
    );
    const { data, isLoading, isFetching, isError } =
        isAuthenticated && is_subscribed
            ? privateQueryResult
            : publicQueryResult;

    if (!is_subscribed && !isLandingPageRevampOn) return <NeedSubscribe />;

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
            <>
                <div
                    // TODO(angga): removed until higher in priority
                    // onMouseUp={handleHighlight}
                    // onMouseOverCapture={handleHover}
                    aria-hidden>
                    {data?.is_tiptap ? (
                        <AstroNotesContentJSON
                            content={data?.page_content}
                            key={Number(page) as unknown as string}
                            className={cn(
                                fontClassName[fontStyle],
                                {
                                    'hidden md:block': !(
                                        !isLandingPageRevampOn ||
                                        is_subscribed ||
                                        Number(page) == 1
                                    )
                                },
                                smallText
                                    ? 'text-xs sm:text-sm'
                                    : 'text-sm sm:text-base'
                            )}
                        />
                    ) : (
                        <ReactMarkdown
                            className={cn(
                                'markdown-table markdown-overflow-break-word markdown-blue-link markdown-img-max-height markdown-body astronotes',
                                fontClassName[fontStyle],
                                {
                                    'hidden md:block': !(
                                        !isLandingPageRevampOn ||
                                        is_subscribed ||
                                        Number(page) == 1
                                    )
                                },
                                smallText
                                    ? 'text-xs sm:text-sm'
                                    : 'text-sm sm:text-base'
                            )}
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                            linkTarget={'_blank'}>
                            {data?.page_content}
                        </ReactMarkdown>
                    )}
                </div>
                <AstronotesPaywall />
            </>
        );

    return <></>;
};

export default AstroNotesContent;
