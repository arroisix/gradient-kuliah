import { useGetBookDetailQuery } from 'courses/redux/api/astronotesApi';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import dynamic from 'next/dynamic';
import ArticleContent from './ArticleContent';

const AuthWall = dynamic(() => import('../utbk/AuthWall'));
const VideoPricingList = dynamic(() => import('../utbk/VideoPricingList'));

interface MateriArticleContainerProps {
    subchapter: SubChapter;
    book: BookDetailInterface | null;
    content: string | null;
}

function MateriArticleContainer({
    subchapter,
    content,
    book: ssrBook
}: MateriArticleContainerProps): JSX.Element {
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const { isAuthenticated } = useAuth();
    const { is_subscribed, subscribedFeatures } =
        useCourseSubscription(slug_subtest);

    const { data: csrBook, isLoading } = useGetBookDetailQuery(
        { slug: subchapter.notebook?.book_slug as string },
        { skip: !subchapter.notebook?.book_slug }
    );

    const book = ssrBook ?? csrBook?.book;
    const isShowAuthWall =
        !isAuthenticated && (!book?.is_public || book.is_free);

    const isShowPayWall =
        (!is_subscribed && !book?.is_free) ||
        (is_subscribed &&
            !book?.is_free &&
            !subscribedFeatures?.includes('material'));

    if (isLoading) {
        return (
            <div className="animate-pulse bg-[#333333] rounded-2xl h-[calc(100vh-32px-30px-16px-80px)] lg:h-[calc(100vh-32px-36px-16px)]"></div>
        );
    }

    if (isShowAuthWall) {
        return <AuthWall />;
    }

    if (isShowPayWall) {
        return <VideoPricingList />;
    }

    return (
        <ArticleContent
            subchapter={subchapter}
            book={book as BookDetailInterface}
            content={content}
        />
    );
}

export default MateriArticleContainer;
