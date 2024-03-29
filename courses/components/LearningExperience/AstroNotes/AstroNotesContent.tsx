import Skeleton from 'commons/components/elements/Skeleton';
import { cn, getCookieValue, isNotNullAndUndefined } from 'commons/utils';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import {
    useGetAstronotesContentQuery,
    useGetPublicBookPreviewQuery
} from 'courses/redux/api/astronotesApi';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { fontClassName } from './constants';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import AstronotesPaywall from './AstronotesPaywall';
import AstroNotesContentJSON from './AstroNotesContentJSON';
import { useRouter } from 'next/router';
import { IS_BOT } from 'commons/constants';
import CryptoJS from 'crypto-js';
import AstronotesRegisterwall from './AstronotesRegisterWall';

const AstroNotesContent = ({
    content,
    book
}: {
    content: string;
    book: BookDetailInterface;
}): JSX.Element => {
    const [crawlerBot, setCrawlerBot] = useState('');

    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed } = useCourseSubscription();

    useEffect(() => {
        setCrawlerBot(getCookieValue(IS_BOT));
    }, []);

    const showPrivate =
        ((isAuthenticated || book.is_public) &&
            (is_subscribed || book.is_free)) ||
        !!crawlerBot;

    return (
        <>
            {showPrivate ? (
                <AstronotesPrivate
                    crawlerBot={crawlerBot}
                    content={content}
                    book={book}
                />
            ) : (
                <AstronotesPreview content={content} book={book} />
            )}
            {book.is_free ? (
                <AstronotesRegisterwall
                    showRegisterwall={!!!crawlerBot}
                    book={book}
                />
            ) : (
                <AstronotesPaywall showPaywall={!!!crawlerBot} book={book} />
            )}
        </>
    );
};

const AstronotesPreview = ({
    content,
    book
}: {
    content: string;
    book: BookDetailInterface;
}): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const { data, isLoading, isFetching } = useGetPublicBookPreviewQuery(
        { slug: slug as string },
        { skip: !isNotNullAndUndefined(slug) }
    );

    return (
        <AstronotesMarkdown
            isLoading={isLoading || isFetching}
            astronotes={data}
            initialContent={content}
            book={book}
        />
    );
};

const AstronotesPrivate = ({
    crawlerBot,
    content,
    book
}: {
    crawlerBot: string;
    content: string;
    book: BookDetailInterface;
}): JSX.Element => {
    const router = useRouter();
    const { page, slug } = router.query as { page: string; slug: string };
    const { data, isLoading, isFetching } = useGetAstronotesContentQuery(
        { slug: slug, page: parseInt(page), specialToken: crawlerBot },
        { skip: !isNotNullAndUndefined(slug) || !isNotNullAndUndefined(page) }
    );

    return (
        <AstronotesMarkdown
            key={page}
            isLoading={isLoading || isFetching}
            astronotes={data}
            initialContent={content}
            book={book}
        />
    );
};

const AstronotesMarkdown = ({
    isLoading,
    astronotes,
    initialContent,
    book
}: {
    isLoading: boolean;
    initialContent: string;
    book: BookDetailInterface;
    astronotes?: GetAstronotesContentResponse;
}): JSX.Element => {
    const router = useRouter();
    const { page } = router.query as { page: string };
    const { smallText, fontStyle } = useAstronotes();
    const { is_subscribed } = useCourseSubscription();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [content, setContent] = useState<
        GetAstronotesContentResponse | undefined
    >(undefined);
    const isPreview = Number(page) == 1;

    useEffect(() => {
        const key = getCookieValue(IS_BOT);
        const decrypted =
            !!key && !isPreview
                ? CryptoJS.AES.decrypt(initialContent, key).toString(
                      CryptoJS.enc.Utf8
                  )
                : '{}';
        setContent(
            JSON.parse(
                isPreview ? initialContent : decrypted
            ) as GetAstronotesContentResponse
        );
    }, [initialContent, isPreview, is_subscribed]);

    const className = cn(
        fontClassName[fontStyle],
        !(
            is_subscribed ||
            isPreview ||
            book.is_public ||
            (isAuthenticated && book.is_free)
        ) && 'hidden md:block',
        smallText ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
    );

    if (isLoading && !astronotes && !content) {
        return (
            <Skeleton repeat={8} className="h-6 [&:nth-child(4n+1)]:w-1/3" />
        );
    }

    return astronotes?.is_tiptap || content?.is_tiptap ? (
        <AstroNotesContentJSON
            content={(astronotes?.page_content || content?.page_content) ?? ''}
            className={className}
            key={Number(page) as unknown as string}
        />
    ) : (
        <ReactMarkdown
            className={cn(
                'markdown-table markdown-overflow-break-word markdown-blue-link markdown-img-max-height markdown-body astronotes',
                className
            )}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            linkTarget={'_blank'}>
            {(astronotes?.page_content || content?.page_content) ?? ''}
        </ReactMarkdown>
    );
};

export default AstroNotesContent;
