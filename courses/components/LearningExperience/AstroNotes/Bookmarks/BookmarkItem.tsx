import { cn } from 'commons/utils';
import { useGetBookDetailQuery } from 'courses/redux/api/astronotesApi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaChevronRight, FaChevronUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

type BookmarkItemProps = {
    data: Bookmark;
    onClick?: (show: boolean) => void;
};

export const BookmarkItem = ({
    data,
    onClick
}: BookmarkItemProps): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query as { slug: string };
    const { data: getBookDetail } = useGetBookDetailQuery(
        { slug },
        { skip: !slug }
    );
    const category_name = getBookDetail?.book.category.toLowerCase();

    const [isShow, setIsShow] = useState(false);

    const getHref = () => {
        if (category_name === 'textbook') {
            return `/perpustakaan/textbook/${slug}/${data.page_order}`;
        } else if (category_name === 'catatan') {
            return `/perpustakaan/astronotes/${slug}/${data.page_order}`;
        } else {
            return `/perpustakaan/bank-soal/${slug}/${data.page_order}`;
        }
    };

    return (
        <div>
            <div className="flex items-center gap-1 cursor-pointer font-body">
                <label
                    className={cn(
                        'btn btn-ghost btn-square btn-xs swap swap-rotate',
                        data.page_chapters?.length < 1 && 'hidden'
                    )}>
                    <input
                        type="checkbox"
                        checked={!isShow}
                        onChange={() => {
                            onClick?.(!isShow);
                            setIsShow((prev) => !prev);
                        }}
                        className="hidden"
                    />
                    <FaChevronRight size={12} className="swap-on" />
                    <FaChevronUp size={12} className="swap-off" />
                </label>
                <Link href={getHref()} className="text-sm">
                    Halaman {data.page_order}
                </Link>
            </div>
            {isShow && (
                <Link
                    href={getHref()}
                    className="flex flex-col gap-1 py-2 pl-7 text-neutral-600 dark:text-neutral-400">
                    <>
                        {data.page_chapters?.map((chapter, index) => (
                            <div key={index} className="text-left">
                                <ReactMarkdown
                                    className="markdown-body-sm markdown-overflow-break-word markdown-blue-link markdown-img-max-height"
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                                    linkTarget={'_blank'}>
                                    {chapter}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </>
                </Link>
            )}
        </div>
    );
};

export default BookmarkItem;
