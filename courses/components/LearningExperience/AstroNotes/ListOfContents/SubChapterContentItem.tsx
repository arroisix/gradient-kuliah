import Skeleton from 'commons/components/elements/Skeleton';
import { useGetTableContentSubchaptersQuery } from 'courses/redux/api/astronotesApi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

type SubChapterContentItemProps = {
    chapterId: string;
};

export const SubChapterContentItem = ({
    chapterId
}: SubChapterContentItemProps): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const { isLoading, data: subchapters } = useGetTableContentSubchaptersQuery(
        {
            slug: slug as string,
            chapter_id: chapterId
        },
        { skip: !slug }
    );

    if (isLoading) return <Skeleton repeat={4} className="h-5 p-0 mb-0" />;

    return (
        <>
            {subchapters?.data.map((subchapter: BookSubchapter) => (
                <Link
                    href={`/astronotes/${slug}/${subchapter.page_order}#${subchapter.id}`}
                    scroll={false}
                    key={subchapter.id}
                    className="p-1 transition cursor-pointer text-neutral-600 dark:text-neutral-400 btn-ghost rounded-btn">
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
