import { useRouter } from 'next/router';
import { BsPlayCircle } from 'react-icons/bs';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import ComingSoon from 'commons/components/elements/Icons/ComingSoon';
import Lock from 'commons/components/elements/Icons/Lock';

interface VideoSectionProps {
    setVideoPicked: (video: Video) => void;
    videoPicked: Video;
    trailerVideo?: Video;
    chapters: Chapter[];
    asThrowPage?: boolean;
    setSubchapter?: (sub: SubChapter) => void;
    isSubscribed: boolean;
    isFullHeight?: boolean;
}

const VideoSection = ({
    chapters,
    setVideoPicked,
    setSubchapter,
    trailerVideo,
    videoPicked,
    asThrowPage,
    isSubscribed,
    isFullHeight
}: VideoSectionProps): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <div
            className={`${
                isFullHeight ? 'h-[calc(100vh-65px)]' : 'h-[500px]'
            } overflow-y-auto`}>
            {trailerVideo && (
                <div
                    id="trailer"
                    key="trailer"
                    aria-hidden={true}
                    onClick={() =>
                        setVideoPicked({
                            id: 'trailer',
                            video_url: trailerVideo.video_url as string,
                            thumbnail: trailerVideo.thumbnail as string,
                            is_free: true,
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
            {chapters?.map((chapter) => {
                return (
                    <div key={chapter.id}>
                        <div className="p-4">
                            <span className="font-bold">
                                {chapter.chapter_name}
                            </span>
                        </div>
                        {chapter.subchapters.length > 0 ? (
                            chapter?.subchapters?.map((subchapter) => {
                                return (
                                    <div
                                        aria-hidden={true}
                                        onClick={() => {
                                            if (isAuthenticated) {
                                                if (setSubchapter) {
                                                    setSubchapter(subchapter);
                                                }
                                                if (asThrowPage) {
                                                    router.push(
                                                        `/kelas/${id}/belajar?type=video&sub=${subchapter.id}&chapter=${chapter.id}`
                                                    );
                                                } else {
                                                    setVideoPicked(
                                                        {
                                                            ...(subchapter.video as Video),
                                                            subchapter_id:
                                                                subchapter?.id as string
                                                        } ?? ({} as Video)
                                                    );
                                                }
                                            } else {
                                                setModalAuthOpen(1);
                                            }
                                        }}
                                        key={subchapter.id}
                                        className={`w-full flex p-4 items-center hover:bg-neutral-600 cursor-pointer ${
                                            videoPicked?.id ===
                                                subchapter?.video?.id &&
                                            'bg-neutral-600'
                                        }`}>
                                        <div className="w-1/5 flex items-center justify-center">
                                            {subchapter?.video?.is_free ||
                                            isSubscribed ? (
                                                <BsPlayCircle className="mr-4 text-xl" />
                                            ) : (
                                                <div className="mr-4">
                                                    <Lock />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col w-4/5">
                                            <span className="font-body">
                                                {subchapter?.subchapter_name}
                                            </span>
                                            <span className="text-neutral-400">
                                                {subchapter?.video?.duration}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex p-4">
                                <div className="w-1/5 flex items-center justify-center">
                                    <div className="mr-4">
                                        <ComingSoon />
                                    </div>
                                </div>
                                <div className="flex font-body text-neutral-600 flex-col w-4/5">
                                    <span>Segera Hadir</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default VideoSection;
