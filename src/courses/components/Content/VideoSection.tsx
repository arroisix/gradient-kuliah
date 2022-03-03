import { useRouter } from 'next/router';
import { BsPlayCircle } from 'react-icons/bs';
import { MdLock } from 'react-icons/md';
import { useAuth } from 'src/authentication/contexts/AuthProvider';

interface VideoSectionProps {
    setVideoPicked: (video: Video) => void;
    videoPicked: Video;
    trailerVideo?: Video;
    chapters: Chapter[];
    asThrowPage?: boolean;
    setSubchapterName?: (name: string) => void;
}

const VideoSection = ({
    chapters,
    setVideoPicked,
    setSubchapterName,
    trailerVideo,
    videoPicked,
    asThrowPage
}: VideoSectionProps): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { isAuthenticated, setModalAuthOpen } = useAuth();

    return (
        <div className="h-[500px] overflow-y-auto">
            {trailerVideo && (
                <div
                    id="trailer"
                    key="trailer"
                    aria-hidden={true}
                    onClick={() =>
                        setVideoPicked({
                            id: 'trailer',
                            videoUrl: trailerVideo.videoUrl as string,
                            thumbnail: trailerVideo.thumbnail as string,
                            isFree: true,
                            description: trailerVideo.description,
                            duration: '01:30'
                        })
                    }
                    className={`w-full flex p-4 items-center hover:bg-neutral-600 cursor-pointer ${
                        videoPicked.id === 'trailer' && 'bg-neutral-600'
                    }`}>
                    <div className="w-1/5 flex items-center justify-center">
                        <BsPlayCircle className="mr-4 text-xl" />
                    </div>
                    <div className="flex flex-col w-4/5">
                        <span>Trailer Kelas</span>
                        <span className="text-neutral-400">
                            {trailerVideo.duration}
                        </span>
                    </div>
                </div>
            )}
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
                                    onClick={() => {
                                        if (isAuthenticated()) {
                                            if (asThrowPage) {
                                                router.push(
                                                    `/kelas/${id}/belajar?type=video`
                                                );
                                            } else {
                                                setVideoPicked(
                                                    subchapter.video ??
                                                        ({} as Video)
                                                );

                                                if (setSubchapterName) {
                                                    setSubchapterName(
                                                        subchapter.subchapterName
                                                    );
                                                }

                                                router.push(
                                                    `/kelas/${id}/belajar?type=video&sub=${subchapter.id}`,
                                                    undefined,
                                                    { shallow: true }
                                                );
                                            }
                                        } else {
                                            setModalAuthOpen(1);
                                        }
                                    }}
                                    key={subchapter.id}
                                    className={`w-full flex p-4 items-center hover:bg-neutral-600 cursor-pointer ${
                                        videoPicked.id ===
                                            subchapter.video?.id &&
                                        'bg-neutral-600'
                                    }`}>
                                    <div className="w-1/5 flex items-center justify-center">
                                        {subchapter.video?.isFree ? (
                                            <BsPlayCircle className="mr-4 text-xl" />
                                        ) : (
                                            <MdLock className="mr-4 text-xl text-amber-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col w-4/5">
                                        <span>{subchapter.subchapterName}</span>
                                        <span className="text-neutral-400">
                                            {subchapter.video?.duration}
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

export default VideoSection;
