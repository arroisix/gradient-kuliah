import { useRouter } from 'next/router';
import { BsPlayCircle } from 'react-icons/bs';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

import Lock from 'commons/components/elements/Icons/Lock';
import ComingSoonContent from './ComingSoonContent';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface VideoSectionProps {
    videoPicked: Video;
    chapters: Chapter[];
    isSubscribed: boolean;
    isFullHeight?: boolean;
    slug: string;
}

const VideoAccordionItem = ({
    subchapter,
    chapterId,
    isSubscribed,
    videoPicked,
    slug
}: {
    chapterId: string;
    videoPicked: Video;
    subchapter: SubChapter;
    isSubscribed: boolean;
    slug: string;
}): JSX.Element => {
    const router = useRouter();
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);
    return (
        <div
            aria-hidden={true}
            onClick={() => {
                if (isAuthenticated) {
                    router.replace(
                        `/kelas/${slug}/belajar/video/${chapterId}/${subchapter.id}`,
                        undefined,
                        { shallow: true }
                    );
                } else {
                    setModalAuthOpen(
                        1,
                        false,
                        `/kelas/${slug}/belajar/video/${chapterId}/${subchapter.id}`
                    );
                }
            }}
            key={subchapter.id}
            className={`w-full flex items-center gap-2 px-7 py-2 hover:bg-neutral-600 cursor-pointer ${
                videoPicked?.id === subchapter?.video?.id && 'bg-neutral-600'
            }`}>
            <div>
                {subchapter?.video?.is_free || isSubscribed ? (
                    <BsPlayCircle className="text-xl" />
                ) : (
                    <Lock />
                )}
            </div>
            {/* <div className="w-full"> */}
            <span className="font-body w-3/4 truncate">
                {subchapter?.subchapter_name}
            </span>
            {/* </div> */}
            <div className="w-1/4 flex justify-end">
                <span
                    className={
                        videoPicked?.id === subchapter?.video?.id
                            ? 'text-neutral-400'
                            : 'text-neutral-600'
                    }>
                    {subchapter?.video?.duration}
                </span>
            </div>
        </div>
    );
};

const VideoAccordion = ({
    slug,
    initialOpen,
    chapter,
    videoPicked,
    isSubscribed
}: {
    slug: string;
    initialOpen: boolean;
    chapter: Chapter;
    videoPicked: Video;
    isSubscribed: boolean;
}): JSX.Element => {
    const [open, setOpen] = useState(initialOpen ?? false);
    const router = useRouter();
    const { chapter: keyId } = router.query;
    useEffect(() => {
        if (keyId && keyId === chapter.id && !open) {
            setOpen(true);
        }
    }, [keyId]);

    return (
        <div className="w-full">
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
                            <VideoAccordionItem
                                slug={slug}
                                chapterId={chapter.id}
                                key={subchapter.id}
                                subchapter={subchapter}
                                videoPicked={videoPicked}
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

const VideoSection = ({
    slug,
    chapters,
    videoPicked,
    isSubscribed,
    isFullHeight
}: VideoSectionProps): JSX.Element => {
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
                    <VideoAccordion
                        slug={slug}
                        initialOpen={index === 0}
                        key={chapter.id}
                        chapter={chapter}
                        videoPicked={videoPicked}
                        isSubscribed={isSubscribed}
                    />
                );
            })}
        </div>
    );
};

export default VideoSection;
