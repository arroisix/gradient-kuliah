import { useAuth } from 'authentication/contexts/AuthProvider';
import { IS_BOT } from 'commons/constants';
import { cn, getCookieValue } from 'commons/utils';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fontClassName } from '../LearningExperience/AstroNotes/constants';
import AstroNotesContentJSON from '../LearningExperience/AstroNotes/AstroNotesContentJSON';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import Button from 'commons/components/elements/Button';
import { usePostFinishArticleMutation } from 'courses/redux/api/astronotesApi';

interface ArticleMarkdownProps {
    subchapter_slug: string | undefined;
    book_slug: string | undefined;
    page: number | undefined;
    initialContent: string | null;
    book: BookDetailInterface;
    article: GetAstronotesContentResponse;
}

function ArticleMarkdown({
    subchapter_slug,
    book_slug,
    page,
    initialContent,
    book,
    article
}: ArticleMarkdownProps): JSX.Element {
    const [finishArticle, { isLoading }] = usePostFinishArticleMutation();
    const [content, setContent] = useState<GetAstronotesContentResponse | null>(
        null
    );

    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const { isAuthenticated } = useAuth();
    const { smallText, fontStyle } = useAstronotes();
    const { is_subscribed, subscribedFeatures } =
        useCourseSubscription(slug_subtest);

    const isPreview = page === 1;
    const className = cn(
        fontClassName[fontStyle],
        !(
            (is_subscribed && subscribedFeatures?.includes('material')) ||
            isPreview ||
            book.is_public ||
            (isAuthenticated && book.is_free)
        ) && 'hidden md:block',
        smallText ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
    );

    const handleFinishArticle = () => {
        finishArticle({
            subchapter_slug: subchapter_slug as string,
            book_slug: book_slug as string,
            page: article.current_page
        });
    };

    useEffect(() => {
        const key = getCookieValue(IS_BOT);
        const decrypted =
            !!key && !isPreview
                ? CryptoJS.AES.decrypt(initialContent ?? '', key).toString(
                      CryptoJS.enc.Utf8
                  )
                : '{}';

        setContent(
            JSON.parse(
                isPreview ? initialContent ?? '' : decrypted
            ) as GetAstronotesContentResponse
        );
    }, [initialContent, isPreview]);

    return (
        <div className="h-[calc(100vh-32px-30px-16px-80px-80px-16px)] overflow-scroll no-scrollbar lg:mx-6 lg:h-[calc(100vh-32px-36px-16px-32px-36px-16px)]">
            {article?.is_tiptap || content?.is_tiptap ? (
                <AstroNotesContentJSON
                    content={
                        (article?.page_content || content?.page_content) ?? ''
                    }
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
                    {(article?.page_content || content?.page_content) ?? ''}
                </ReactMarkdown>
            )}

            <Button
                onClick={handleFinishArticle}
                disabled={isLoading}
                variant="primary"
                type="button"
                className="text-base w-full !py-3 mt-4 lg:w-full lg:max-w-[328px] lg:mt-8">
                Selesai
            </Button>
        </div>
    );
}

export { ArticleMarkdown };
