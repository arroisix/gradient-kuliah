import { useState } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import Input from 'src/commons/components/elements/Form/input';
import { getAllVideoChapter, getAllNotebookChapter } from 'courses/utils';
import NotebookSection from './NotebookSection';
import VideoSection from './VideoSection';

const ListOfContent = ({
    chapters,
    setVideoPicked,
    setSubchapter,
    setNotebookPicked,
    notebookPicked,
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
                        name="password"
                        endAddorment={
                            <FaSearch className="text-gray-500 cursor-pointer" />
                        }
                    />
                </div> */}
                <div className="w-full flex">
                    <div
                        aria-hidden={true}
                        className={`text-[1rem] w-full text-center px-1 pt-1 pb-3 cursor-pointer ${
                            tab === 0
                                ? 'border-b-2 border-accent-blue font-bold text-accent-blue'
                                : ''
                        }`}
                        onClick={() => setTab(0)}>
                        <span>VIDEO</span>
                    </div>
                    {/* <div
                        aria-hidden={true}
                        className={`text-[1rem] w-full text-center px-1 pt-1 pb-3 cursor-pointer ${
                            tab === 1
                                ? 'border-b-2 border-accent-blue font-bold text-accent-blue'
                                : ''
                        }`}
                        onClick={() => setTab(1)}>
                        <span>NOTEBOOK</span>
                    </div> */}
                </div>
            </div>
            <div>
                {tab < 1 ? (
                    <VideoSection
                        chapters={getAllVideoChapter(chapters)}
                        setVideoPicked={setVideoPicked}
                        setSubchapter={setSubchapter}
                        videoPicked={videoPicked}
                        trailerVideo={trailerVideo as Video}
                        asThrowPage={asThrowPage}
                        isSubscribed={isSubscribed ?? false}
                        isFullHeight={isFullHeight}
                    />
                ) : (
                    <NotebookSection
                        chapters={getAllNotebookChapter(chapters)}
                        setNotebookPicked={
                            setNotebookPicked as (notebook: Notebook) => void
                        }
                        notebookPicked={notebookPicked as Notebook}
                        asThrowPage={asThrowPage}
                        isSubscribed={isSubscribed ?? false}
                    />
                )}
            </div>
        </div>
    );
};

export default ListOfContent;
