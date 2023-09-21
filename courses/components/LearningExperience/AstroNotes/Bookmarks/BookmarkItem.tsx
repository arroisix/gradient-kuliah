import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

type BookmarkItemProps = { data: Bookmark };

export const BookmarkItem = ({ data }: BookmarkItemProps): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;

    const [isShow, setIsShow] = useState(false);

    return (
        <div>
            <div
                className="flex gap-[6px] cursor-pointer"
                onClick={() => setIsShow((prev) => !prev)}
                aria-hidden>
                <FaChevronRight
                    size={12}
                    className={`text-black dark:text-[#CCCCCC] mt-[2px] ${
                        isShow && 'rotate-[-90deg]'
                    }`}
                />
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC]">
                    Halaman {data.page_order}
                </span>
            </div>
            <button
                onClick={() =>
                    router.push(`/astronotes/${slug}/${data.page_order}`)
                }
                className={`flex flex-col gap-1 pt-2 pl-4 ${
                    isShow ? '' : 'hidden'
                }`}>
                {data.page_chapters?.map((chapter, index) => (
                    <span
                        key={index}
                        className="text-[#666666] dark:text-[#999999] cursor-pointer text-left"
                        aria-hidden>
                        <ReactMarkdown
                            className="markdown-body-xs markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height"
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                            linkTarget={'_blank'}>
                            {chapter}
                        </ReactMarkdown>
                    </span>
                ))}
            </button>
        </div>
    );
};

export default BookmarkItem;
