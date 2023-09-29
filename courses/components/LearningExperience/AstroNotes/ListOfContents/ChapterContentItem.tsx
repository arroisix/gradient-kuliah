import React, { useState } from 'react';
import { FaChevronRight, FaChevronUp } from 'react-icons/fa';
import SubChapterContentItem from './SubChapterContentItem';

type ChapterContentItemProps = { value: BookChapter };

const ChapterContentItem = ({
    value
}: ChapterContentItemProps): JSX.Element => {
    const [isShow, setIsShow] = useState(false);

    return (
        <div key={value.id}>
            <label className="flex items-center gap-1 cursor-pointer">
                <div className="btn btn-ghost btn-square btn-xs swap swap-rotate">
                    <input
                        type="checkbox"
                        checked={!isShow}
                        onChange={() => setIsShow((prev) => !prev)}
                        className="hidden"
                    />
                    <FaChevronRight size={12} className="swap-on" />
                    <FaChevronUp size={12} className="swap-off" />
                </div>
                <div className="font-body text-sm text-black dark:text-[#CCCCCC] pb-[1px]">
                    {value.title}
                </div>
            </label>
            {isShow && (
                <div className="flex flex-col gap-1 pt-2 pl-4">
                    <SubChapterContentItem chapterId={value.id} />
                </div>
            )}
        </div>
    );
};

export default ChapterContentItem;
