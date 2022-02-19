import { FaSearch } from 'react-icons/fa';
import { BsPatchCheck, BsPlayCircle } from 'react-icons/bs';
import {
    MdOutlineArticle,
    MdChevronRight,
    MdLock,
    MdOutlineGroup,
    MdPlayCircleOutline
} from 'react-icons/md';
import Input from 'src/commons/components/elements/Form/input';
import { getAllNotebookChapter, getAllVideoChapter } from '../utils';
import { useState } from 'react';
import VideoPlayer from 'src/commons/components/elements/Video';
import Button from 'src/commons/components/elements/Button';

interface ContentBoxProps {
    chapters: [Chapter];
    description?: string;
    trailer?: string;
    thumbnail?: string;
}

interface VideoSectionProps extends ContentBoxProps {
    setVideoPicked: (video: Video) => void;
    videoPicked: Video;
}

const BenefitItems = ({
    icons,
    title
}: {
    icons: JSX.Element;
    title: string;
}): JSX.Element => {
    return (
        <div className="flex items-center my-4">
            <div className="text-xl mr-2">{icons}</div>
            <div>
                <h1 className="text-xl">{title}</h1>
            </div>
        </div>
    );
};

const NotebookSection = ({ chapters }: ContentBoxProps): JSX.Element => {
    return (
        <div className="h-[500px] overflow-y-scroll">
            {chapters.map((chapter) => {
                return (
                    <div key={chapter.id}>
                        <div className="p-4">
                            <span className="font-bold">
                                {chapter.chapterName}
                            </span>
                        </div>
                        {chapter.subchapters.map((subchapter) => {
                            return (
                                <div
                                    key={subchapter.id}
                                    className="w-full flex p-4 items-center justify-between hover:bg-neutral-600 cursor-pointer text-white">
                                    <div className="flex items-center">
                                        {subchapter.notebook?.isFree ? (
                                            <MdOutlineArticle className="mr-4 text-xl" />
                                        ) : (
                                            <MdLock className="mr-4 text-xl text-amber-400" />
                                        )}
                                        <span>
                                            {subchapter.notebook?.title}
                                        </span>
                                    </div>
                                    <MdChevronRight />
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

const VideoSection = ({
    chapters,
    setVideoPicked,
    trailer,
    thumbnail,
    videoPicked
}: VideoSectionProps): JSX.Element => {
    return (
        <div className="h-[500px] overflow-y-scroll">
            <div
                id="trailer"
                key="trailer"
                aria-hidden={true}
                onClick={() =>
                    setVideoPicked({
                        id: 'trailer',
                        videoUrl: trailer as string,
                        thumbnail: thumbnail as string,
                        isFree: true,
                        duration: ''
                    })
                }
                className={`w-full flex p-4 items-center hover:bg-neutral-600 cursor-pointer ${
                    videoPicked.id === 'trailer' && 'bg-neutral-600'
                }`}>
                <BsPlayCircle className="mr-4 text-xl" />
                <div className="flex flex-col">
                    <span>Trailer Kelas</span>
                    <span className="text-neutral-400">1:30</span>
                </div>
            </div>
            {chapters.map((chapter) => {
                return (
                    <div key={chapter.id}>
                        <div className="p-4">
                            <span className="font-bold">
                                {chapter.chapterName}
                            </span>
                        </div>
                        {chapter.subchapters.map((subchapter) => {
                            return (
                                <div
                                    aria-hidden={true}
                                    onClick={() =>
                                        setVideoPicked(
                                            subchapter.video ?? ({} as Video)
                                        )
                                    }
                                    key={subchapter.id}
                                    className={`w-full flex p-4 items-center hover:bg-neutral-600 cursor-pointer ${
                                        videoPicked.id ===
                                            subchapter.video?.id &&
                                        'bg-neutral-600'
                                    }`}>
                                    {subchapter.video?.isFree ? (
                                        <BsPlayCircle className="mr-4 text-xl" />
                                    ) : (
                                        <MdLock className="mr-4 text-xl text-amber-400" />
                                    )}
                                    <div className="flex flex-col">
                                        <span>{subchapter.subchapterName}</span>
                                        <span className="text-neutral-400">
                                            1:30
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

const ContentBox = ({
    chapters,
    description,
    trailer,
    thumbnail
}: ContentBoxProps): JSX.Element => {
    const [tab, setTab] = useState(0);
    const [videoPicked, setVideoPicked] = useState<Video>({
        id: 'trailer',
        isFree: true,
        videoUrl: trailer as string,
        thumbnail: thumbnail as string,
        duration: ''
    });
    return (
        <div className="flex h-full">
            <div className="w-2/3 h-full" id="video-section">
                <div
                    className="w-full bg-neutral-900 rounded min-h-[435px]"
                    id="video">
                    {videoPicked.isFree ? (
                        <VideoPlayer
                            video={videoPicked.videoUrl as string}
                            thumbnail={videoPicked.thumbnail as string}
                        />
                    ) : (
                        <div className="relative">
                            <div className="w-full h-full bg-black absolute top-0 flex justify-center items-center opacity-40" />
                            <div
                                className="w-full h-[435px] bg-red-100 "
                                style={{
                                    background: `url(${thumbnail})`,
                                    backgroundSize: 'cover'
                                }}></div>
                            <div className="w-full h-full absolute top-0 p-16">
                                <h1 className="text-2xl font-bold">
                                    Gabung kelas untuk mengakses materi ini,
                                    yuk!{' '}
                                </h1>
                                <span className="text-neutral-400">
                                    Selain bisa akses materi ini, kamu juga bisa
                                    dapat:
                                </span>
                                <BenefitItems
                                    icons={<BsPatchCheck />}
                                    title="Sertifikat setelah menyelesaikan kelas"
                                />
                                <BenefitItems
                                    icons={<MdPlayCircleOutline />}
                                    title="Semua video materi"
                                />
                                <BenefitItems
                                    icons={<MdOutlineArticle />}
                                    title="Semua artikel dan latihan soal"
                                />
                                <BenefitItems
                                    icons={<MdOutlineGroup />}
                                    title="Komunitas buat belajar dan nugas bareng"
                                />
                                <div className="flex">
                                    <Button variant="primary">
                                        Gabung Kelas
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="" id="description">
                    <p>
                        Amet minim mollit non deserunt ullamco est sit aliqua
                        dolor do amet sint. Velit officia consequat duis enim
                        velit mollit. Exercitation veniam consequat sunt nostrud
                        amet. Amet minim mollit non deserunt ullamco est sit
                        aliqua dolor do amet sint. Velit officia consequat duis
                        enim velit mollit. Exercitation veniam consequat sunt
                        nostrud amet.
                    </p>
                </div>
            </div>
            <div className="w-[32px]" />
            <div className="w-1/3 h-3/4" id="content-section">
                <div className="h-full w-full bg-neutral-900 rounded overflow-hidden">
                    <div className="pt-1 bg-neutral-800" id="search-box">
                        <div className="px-4">
                            <Input
                                type="text"
                                placeholder="Cari materi"
                                className="bg-neutral-900 border-none"
                                name="password"
                                endAddorment={
                                    <FaSearch className="text-gray-500 cursor-pointer" />
                                }
                            />
                        </div>
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
                            <div
                                aria-hidden={true}
                                className={`text-[1rem] w-full text-center px-1 pt-1 pb-3 cursor-pointer ${
                                    tab === 1
                                        ? 'border-b-2 border-accent-blue font-bold text-accent-blue'
                                        : ''
                                }`}
                                onClick={() => setTab(1)}>
                                <span>NOTEBOOK</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        {tab < 1 ? (
                            <VideoSection
                                chapters={getAllVideoChapter(chapters)}
                                description={description}
                                thumbnail={thumbnail}
                                trailer={trailer}
                                setVideoPicked={setVideoPicked}
                                videoPicked={videoPicked}
                            />
                        ) : (
                            <NotebookSection
                                chapters={getAllNotebookChapter(chapters)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentBox;
