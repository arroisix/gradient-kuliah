import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { transitionClassesSlideDown } from '../constants';

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
                <span className="inline-block font-body text-sm text-black dark:text-[#CCCCCC]">
                    Halaman {data.page_order}
                </span>
            </div>
            <Transition
                show={isShow}
                className="flex flex-col gap-1 pt-2 pl-4"
                {...transitionClassesSlideDown}>
                <Link href={`/astronotes/${slug}/${data.page_order}`}>
                    <>
                        {data.page_chapters?.map((chapter, index) => (
                            <span
                                key={index}
                                className="text-[#666666] dark:text-[#999999]text-left">
                                <ReactMarkdown
                                    className="markdown-body-sm markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height"
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                                    linkTarget={'_blank'}>
                                    {chapter}
                                </ReactMarkdown>
                            </span>
                        ))}
                    </>
                </Link>
            </Transition>
        </div>
    );
};

export default BookmarkItem;
