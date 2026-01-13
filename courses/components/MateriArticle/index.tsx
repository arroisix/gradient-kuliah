import { IS_BOT } from 'commons/constants';
import { cn, getCookieValue } from 'commons/utils';
import {
    useGetAstronotesContentQuery
    // useGetPublicBookPreviewQuery
} from 'courses/redux/api/astronotesApi';
import { useEffect, useState } from 'react';
import AstroNotesContentJSON from '../LearningExperience/AstroNotes/AstroNotesContentJSON';
import ReactMarkdown from 'react-markdown';
import { fontClassName } from '../LearningExperience/AstroNotes/constants';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import Button from 'commons/components/elements/Button';
import CopilotModal from 'copilot/components/CopilotModal';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';

interface MateriArticleProps {
    article?: Notebook;
    course_name?: string;
    chapter_id?: string;
    chapter_name?: string;
    subchapter_name?: string;
}

function MateriArticle({
    article,
    course_name,
    chapter_id,
    chapter_name,
    subchapter_name
}: MateriArticleProps): JSX.Element {
    const [crawlerBot, setCrawlerBot] = useState('');
    const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const { smallText, fontStyle } = useAstronotes();
    const { is_subscribed } = useCourseSubscription(slug_subtest as string);

    // const { data: articlePreview, isLoading: isLoadingPreview } =
    //     useGetPublicBookPreviewQuery(
    //         { slug: slug_subtest },
    //         { skip: !slug_subtest || (article?.page ?? 1) > 1 }
    //     );

    const { data: articleContent, isLoading: isLoadingContent } =
        useGetAstronotesContentQuery(
            {
                slug: article?.book_slug as string,
                page: article?.page,
                specialToken: crawlerBot
            },
            { skip: !article?.book_slug || !((article.page ?? 1) > 1) }
        );

    // const isLoading = isLoadingPreview || isLoadingContent;
    const isLoading = isLoadingContent;

    const className = cn(
        fontClassName[fontStyle],
        !is_subscribed && 'hidden md:block',
        smallText ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
    );

    const currentArticleContext =
        article && subchapter_name
            ? {
                  id: article.id,
                  title: course_name ?? '',
                  subtitle: chapter_name,
                  header: subchapter_name,
                  contentType: 'course' as const
              }
            : undefined;

    useEffect(() => {
        setCrawlerBot(getCookieValue(IS_BOT));
    }, []);

    return (
        <div className="bg-[#101010] py-4 px-6 rounded-2xl overflow-hidden lg:h-[calc(100vh-32px-36px-16px)]">
            <div className="mb-4 flex justify-between flex-col gap-4 lg:flex-row lg:items-center lg:gap-0">
                <h1 className="text-white font-semibold text-xl lg:font-bold lg:text-2xl">
                    {subchapter_name}
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
                    key={chapter_id}
                    isOpen={isCopilotOpen}
                    setOpen={setIsCopilotOpen}
                    xlWidth="xl:w-[29.5rem]"
                    currentContext={currentArticleContext}
                    chapterId={chapter_id}
                />
            </div>

            {!isLoading ? (
                <div className="lg:h-[calc(100vh-32px-36px-16px-32px-36px-16px)] lg:overflow-scroll">
                    {articleContent?.is_tiptap ? (
                        <AstroNotesContentJSON
                            content={articleContent?.page_content}
                            className={className}
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
                            {articleContent?.page_content ?? ''}
                        </ReactMarkdown>
                    )}
                </div>
            ) : (
                <div className="animate-pulse bg-[#333333] rounded-lg h-[calc(100vh-32px-36px-16px-32px-36px-16px)] mt-4"></div>
            )}
        </div>
    );
}

export default MateriArticle;
