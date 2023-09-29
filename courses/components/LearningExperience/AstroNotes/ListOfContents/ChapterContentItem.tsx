import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaChevronRight, FaChevronUp } from 'react-icons/fa';
import { useTracker } from 'tracker/tracker';
import SubChapterContentItem from './SubChapterContentItem';

type ChapterContentItemProps = {
    value: BookChapter;
    onClick?: (show: boolean) => void;
};

const ChapterContentItem = ({
    value,
    onClick
}: ChapterContentItemProps): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { slug, page } = router.query;

    const [isShow, setIsShow] = useState(false);

    return (
        <div key={value.id}>
            <label className="flex items-center gap-1 cursor-pointer">
                <div className="btn btn-ghost btn-square btn-xs swap swap-rotate">
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
                </div>
                <div className="font-body text-sm text-black dark:text-[#CCCCCC] pb-[1px]">
                    {value.title}
                </div>
            </label>
            {isShow && (
                <div className="flex flex-col gap-1 pt-2 pl-4">
                    <SubChapterContentItem
                        chapterId={value.id}
                        onClick={(subchapter) => {
                            tracker?.genericTrack(
                                'Click Subchapter List of Content',
                                {
                                    'Book Slug': slug,
                                    'Book Page Query': page,
                                    'Chapter Name': value.title,
                                    'SubChapter Name': subchapter.title
                                }
                            );
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ChapterContentItem;
