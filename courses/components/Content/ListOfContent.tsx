// import { FaSearch } from 'react-icons/fa';
// import Input from 'src/commons/components/elements/Form/input';
import {
    getAllAnimationChapter,
    getAllVideoChapter,
    isAnimationExist,
    isContentChapterExist
} from 'courses/utils';
import { useState } from 'react';
import VideoSection from './VideoSection';

const ListOfContent = ({
    chapters,
    setVideoPicked,
    setSubchapter,
    videoPicked,
    trailerVideo,
    rounded,
    asThrowPage,
    firstTab,
    isSubscribed,
    isFullHeight
}: {
    chapters: Chapter[];
    setVideoPicked: (video: Video) => void;
    setSubchapter?: (sub: SubChapter) => void;
    setNotebookPicked?: (notebook: Notebook) => void;
    notebookPicked?: Notebook;
    videoPicked: Video;
    trailerVideo?: Video;
    rounded?: boolean;
    asThrowPage?: boolean;
    firstTab?: number;
    isSubscribed?: boolean;
    isFullHeight?: boolean;
}): JSX.Element => {
    const [tab, setTab] = useState(firstTab ?? 0);
    const isVideoContentExist = isContentChapterExist(chapters, 'video');
    const isAnimationContentExist = isAnimationExist(chapters);

    return (
        <div
            className={`h-full w-full bg-neutral-900 ${
                rounded ? 'rounded' : ''
            } overflow-hidden z-10`}>
            <div className="pt-1 bg-neutral-800" id="search-box">
                {/* <div className="px-4">
                    <Input
                        type="text"
                        placeholder="Cari materi"
                        className="bg-neutral-900 border-none"
                        name="search"
                        endAddorment={
                            <FaSearch className="text-gray-500 cursor-pointer" />
                        }
                    />
                </div> */}
                <div className="w-full flex">
                    {isVideoContentExist && (
                        <div
                            aria-hidden={true}
                            className={`text-[1rem] w-full text-center px-1 pt-1 pb-3 cursor-pointer ${
                                tab === 0
                                    ? 'border-b-2 border-[#C4B9FF] font-bold text-[#C4B9FF]'
                                    : ''
                            }`}
                            onClick={() => setTab(0)}>
                            <span>VIDEO</span>
                        </div>
                    )}
                    {isAnimationContentExist && (
                        <div
                            aria-hidden={true}
                            className={`text-[1rem] w-full text-center px-1 pt-1 pb-3 cursor-pointer ${
                                tab === 1
                                    ? 'border-b-2 border-[#C4B9FF] font-bold text-[#C4B9FF]'
                                    : ''
                            }`}
                            onClick={() => setTab(1)}>
                            <span>ANIMASI</span>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <VideoSection
                    chapters={
                        tab === 0
                            ? getAllVideoChapter(chapters)
                            : getAllAnimationChapter(chapters)
                    }
                    setVideoPicked={setVideoPicked}
                    setSubchapter={setSubchapter}
                    videoPicked={videoPicked}
                    trailerVideo={trailerVideo as Video}
                    asThrowPage={asThrowPage}
                    isSubscribed={isSubscribed ?? false}
                    isFullHeight={isFullHeight}
                />
            </div>
        </div>
    );
};

export default ListOfContent;
