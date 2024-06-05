import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Skeleton from 'commons/components/elements/Skeleton';
import {
    useGetBookDetailQuery,
    useGetPublicTableContentSubchaptersQuery,
    useGetTableContentSubchaptersQuery
} from 'courses/redux/api/astronotesApi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

type SubChapterContentItemProps = {
    chapterId: string;
    onClick?: (subchapter: BookSubchapter) => void;
};

export const SubChapterContentItem = ({
    chapterId,
    onClick
}: SubChapterContentItemProps): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query as { slug: string };
    const isAuthenticated = useSelector(getIsAuthenticated);
    const privateQueryResult = useGetTableContentSubchaptersQuery(
        {
            slug: slug as string,
            chapter_id: chapterId
        },
        { skip: !isAuthenticated || !slug }
    );
    const publicQueryResult = useGetPublicTableContentSubchaptersQuery(
        {
            slug: slug as string,
            chapter_id: chapterId
        },
        { skip: isAuthenticated || !slug }
    );
    const { isLoading, data: subchapters } = isAuthenticated
        ? privateQueryResult
        : publicQueryResult;
    const { data: getBookDetail } = useGetBookDetailQuery({ slug }, { skip: !slug });
    const category_name = getBookDetail?.book.category.toLowerCase()

    if (isLoading) return <Skeleton repeat={4} className="h-5 p-0 mb-0" />;

    return (
        <>
            {subchapters?.data.map((subchapter: BookSubchapter) => (
                <Link
                    href={
                        category_name === 'textbook'? `/perpustakaan/textbook/${slug}/${subchapter.page_order}#${subchapter.id}` : category_name === 'astronotes'? `/perpustakaan/catatan/${slug}/${subchapter.page_order}#${subchapter.id}` : `/perpustakaan/bank-soal/${slug}/${subchapter.page_order}#${subchapter.id}`
                    }
                    scroll={false}
                    key={subchapter.id}
                    className="p-1 transition cursor-pointer text-neutral-600 dark:text-neutral-400 btn-ghost rounded-btn"
                    onClick={() => onClick?.(subchapter)}>
                    <ReactMarkdown
                        className="markdown-body-sm markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height"
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                        linkTarget={'_blank'}>
                        {subchapter.title}
                    </ReactMarkdown>
                </Link>
            ))}
        </>
    );
};

export default SubChapterContentItem;
