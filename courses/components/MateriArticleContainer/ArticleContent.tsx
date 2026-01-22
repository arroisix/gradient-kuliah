import { getCookieValue } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { IS_BOT } from 'commons/constants';
import Button from 'commons/components/elements/Button';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';
import CopilotModal from 'copilot/components/CopilotModal';
import {
    useGetAstronotesContentQuery,
    useGetPublicBookPreviewQuery
} from 'courses/redux/api/astronotesApi';
import { ArticleMarkdown } from './ArticleMarkdown';

interface ArticleContentProps {
    subchapter: SubChapter;
    book: BookDetailInterface;
    content: string | null;
}

function ArticleContent({
    subchapter,
    book,
    content
}: ArticleContentProps): JSX.Element {
    const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
    const [crawlerBot, setCrawlerBot] = useState('');

    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const { isAuthenticated } = useAuth();
    const { is_subscribed, subscribedFeatures } =
        useCourseSubscription(slug_subtest);

    useEffect(() => {
        setCrawlerBot(getCookieValue(IS_BOT));
    }, []);

    // TODO: confirm ini buat apa
    const isShowPrivate =
        ((isAuthenticated || book.is_public) &&
            ((is_subscribed && subscribedFeatures?.includes('material')) ||
                book.is_free)) ||
        !!crawlerBot;

    const slug = subchapter.notebook?.book_slug;
    const page = subchapter.notebook?.page;

    const { data: preview, isLoading: isLoadingPreview } =
        useGetPublicBookPreviewQuery(
            { slug: slug as string },
            { skip: !slug || isShowPrivate }
        );

    const { data: astronotes, isLoading: isLoadingAstronotes } =
        useGetAstronotesContentQuery(
            { slug: slug as string, page: page, specialToken: crawlerBot },
            { skip: !slug || !page || !isShowPrivate }
        );

    const article = preview ?? astronotes;
    const isLoading = isLoadingPreview || isLoadingAstronotes;

    const currentArticleContext =
        article && subchapter.subchapter_name
            ? {
                  id: article.page_id,
                  title: book.title,
                  header: `Halaman ${page}`,
                  contentType: 'astronotes_content' as const
              }
            : undefined;

    return (
        <div className="bg-black rounded-2xl overflow-hidden lg:bg-[#101010] lg:h-[calc(100vh-32px-36px-16px)] lg:pb-4">
            <div className="mb-4 flex justify-between flex-col gap-4 lg:mb-0 lg:flex-row lg:items-center lg:gap-0 lg:border-b lg:border-b-[#222222] lg:py-4 lg:px-6">
                <h1 className="text-white font-semibold text-xl lg:font-bold lg:text-2xl">
                    {subchapter.subchapter_name}
                </h1>

                <Button
                    disabled={isLoading}
                    onClick={() => setIsCopilotOpen(true)}
                    variant="primary"
                    className="w-fit flex-shrink-0 !py-2 !px-4 flex justify-center items-center gap-1.5 text-sm [&>svg]:w-4 [&>svg]:h-4 lg:flex-grow-0">
                    <CopilotIconFill />
                    <span>Tanya Copilot AI</span>
                </Button>

                <CopilotModal
                    key={subchapter.chapter_id}
                    isOpen={isCopilotOpen}
                    setOpen={setIsCopilotOpen}
                    xlWidth="xl:w-[29.5rem]"
                    currentContext={currentArticleContext}
                    chapterId={subchapter.chapter_id}
                />
            </div>

            {!isLoading ? (
                <ArticleMarkdown
                    book={book}
                    article={article as GetAstronotesContentResponse}
                    initialContent={content}
                    page={page}
                    subchapter_slug={subchapter.subchapter_slug}
                    book_slug={subchapter.notebook?.book_slug}
                />
            ) : (
                <div className="animate-pulse bg-[#333333] rounded-2xl mt-4 h-[calc(100vh-32px-30px-16px-80px-80px-16px)] lg:h-[calc(100vh-32px-36px-16px-32px-36px-16px-16px)] lg:mx-6"></div>
            )}
        </div>
    );
}

export default ArticleContent;
