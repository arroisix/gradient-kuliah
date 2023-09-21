import { usePostBookProgressMutation } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

type HighlightProps = {
    data: HighlightsInterface;
};

const Highlight = ({ data }: HighlightProps): JSX.Element => {
    const [postBookProgress] = usePostBookProgressMutation();
    const router = useRouter();
    const { slug } = router.query;

    const [isShow, setIsShow] = useState(false);

    return (
        <div>
            <div
                key={data.book_chapter_id}
                className="flex gap-[6px] cursor-pointer"
                onClick={() => setIsShow((prev) => !prev)}
                aria-hidden>
                <FaChevronRight
                    size={12}
                    className={`text-black dark:text-[#CCCCCC] mt-[2px] ${
                        isShow && 'rotate-90'
                    }`}
                />
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC]">
                    {data.title}
                </span>
            </div>
            {data.blocks?.map((block, index) => (
                <div
                    key={index}
                    className={`flex flex-col gap-1 pt-2 pl-4 ${
                        isShow ? '' : 'hidden'
                    }`}>
                    <span className="inline-block font-body text-[10px] text-[#666666] dark:text-[#999999]">
                        {block.block_heading}
                    </span>
                    {block.highlights.map((highlight, index) => (
                        <span
                            onClick={() =>
                                postBookProgress({
                                    slug: slug as string,
                                    next_page_order: highlight.page_order
                                })
                            }
                            key={index}
                            className="inline-block font-body text-xs pl-2 border-l-2 cursor-pointer"
                            style={{ borderColor: highlight.color }}
                            aria-hidden>
                            {highlight.text}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Highlight;
