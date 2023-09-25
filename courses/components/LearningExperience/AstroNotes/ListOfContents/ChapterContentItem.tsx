import React, { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import SubChapterContentItem from './SubChapterContentItem';

type ChapterContentItemProps = { value: BookChapter };

const ChapterContentItem = ({
    value
}: ChapterContentItemProps): JSX.Element => {
    const [isShow, setIsShow] = useState(false);

    return (
        <div key={value.id}>
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
                <span className="inline-block font-body text-sm text-black dark:text-[#CCCCCC] pb-[1px]">
                    {value.title}
                </span>
            </div>
            {isShow && (
                <div className="flex flex-col gap-1 pt-2 pl-4">
                    <SubChapterContentItem chapterId={value.id} />
                </div>
            )}
        </div>
    );
};

export default ChapterContentItem;
