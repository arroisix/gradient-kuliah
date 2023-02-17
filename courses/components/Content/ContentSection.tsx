import { useRouter } from 'next/router';

import ComingSoonContent from './ComingSoonContent';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import VideoAccordionItem from './VideoAccordionItem';
import ExerciseAccordionItem from './ExerciseAccordionItem';

interface ContentSectionProps {
    contentPicked: Video;
    chapters: Chapter[];
    isSubscribed: boolean;
    isFullHeight?: boolean;
    slug: string;
    extraCallback?: () => void;
}

export interface ContentAccordionItemProps {
    chapterId: string;
    contentPicked: Video;
    subchapter: SubChapter;
    isSubscribed: boolean;
    slug: string;
    extraCallback?: () => void;
}

const ContentAccordionItem = (
    props: ContentAccordionItemProps
): JSX.Element => {
    if (props.subchapter.video) {
        return <VideoAccordionItem {...props} />;
    }

    if (props.subchapter.exercise) {
        return <ExerciseAccordionItem {...props} />;
    }

    return <></>;
};

const ContentAccordion = ({
    slug,
    initialOpen,
    chapter,
    contentPicked,
    isSubscribed,
    extraCallback
}: {
    slug: string;
    initialOpen: boolean;
    chapter: Chapter;
    contentPicked: Video;
    isSubscribed: boolean;
    extraCallback?: () => void;
}): JSX.Element => {
    const [open, setOpen] = useState(initialOpen ?? false);
    const router = useRouter();
    const ref = useRef({} as HTMLDivElement);
    const { chapter: keyId } = router.query;
    useEffect(() => {
        if (keyId && keyId === chapter.id && !open) {
            setOpen(true);
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [keyId]);

    return (
        <div className="w-full" ref={ref}>
            <div
                className="px-7 py-4 w-full flex justify-between items-center cursor-pointer"
                onClick={() => setOpen(!open)}
                aria-hidden>
                <span className="font-bold">{chapter.chapter_name}</span>
                {open ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div
                className={`transition-all duration-300 ease-out overflow-hidden ${
                    open ? 'opacity-100 h-auto pb-4' : 'opacity-0 h-0 pb-0'
                }`}>
                {chapter.subchapters.length > 0 ? (
                    chapter?.subchapters?.map((subchapter) => {
                        return (
                            <ContentAccordionItem
                                extraCallback={extraCallback}
                                slug={slug}
                                chapterId={chapter.id}
                                key={subchapter.id}
                                subchapter={subchapter}
                                contentPicked={contentPicked}
                                isSubscribed={isSubscribed}
                            />
                        );
                    })
                ) : (
                    <ComingSoonContent />
                )}
            </div>
            <div className="w-full px-4">
                <div className="h-px bg-[#373737]" />
            </div>
        </div>
    );
};

const ContentSection = ({
    slug,
    chapters,
    contentPicked,
    isSubscribed,
    isFullHeight,
    extraCallback
}: ContentSectionProps): JSX.Element => {
    return (
        <div
            className={`${
                isFullHeight
                    ? 'h-[calc(120vh-64px)]'
                    : `h-[${
                          chapters.length > 8 ? chapters.length * 60 : 800
                      }px]`
            }`}>
            {chapters?.map((chapter, index) => {
                return (
                    <ContentAccordion
                        extraCallback={extraCallback}
                        slug={slug}
                        initialOpen={index === 0}
                        key={chapter.id}
                        chapter={chapter}
                        contentPicked={contentPicked}
                        isSubscribed={isSubscribed}
                    />
                );
            })}
        </div>
    );
};

export default ContentSection;
