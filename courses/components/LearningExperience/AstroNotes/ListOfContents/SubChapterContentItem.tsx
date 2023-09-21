import { useGetTableContentSubchaptersQuery } from 'courses/redux/api/astronotesApi';
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
    const { slug, page } = router.query;
    const { data: subchapters } = useGetTableContentSubchaptersQuery(
        {
            slug: slug as string,
            chapter_id: chapterId
        },
        { skip: !slug }
    );

    return (
        <>
            {subchapters?.data.map((subchapter: BookSubchapter) => (
                <span
                    onClick={() =>
                        router.push(
                            `/astronotes/${slug}/${page}/#${subchapter.id}`
                        )
                    }
                    key={subchapter.id}
                    className="text-black dark:text-[#CCCCCC] p-1 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded"
                    aria-hidden>
                    <ReactMarkdown
                        className="markdown-body-xs markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height"
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                        linkTarget={'_blank'}>
                        {subchapter.title}
                    </ReactMarkdown>
                </span>
            ))}
        </>
    );
};

export default SubChapterContentItem;
