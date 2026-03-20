import Button from 'commons/components/elements/Button';
import { TranscriptIcon } from 'commons/components/elements/Icons/TranscriptIcon';
import { ShareButton } from './ShareButton';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';
import dynamic from 'next/dynamic';
import { LecturerProfile } from './LecturerProfile';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useWindowSize } from 'usehooks-ts';
import { MdFileDownload } from 'react-icons/md';
import { useRouter } from 'next/router';
import { AiFillStar } from 'react-icons/ai';

const Modal = dynamic(() => import('commons/components/modules/Modal'));
const CopilotModal = dynamic(() => import('copilot/components/CopilotModal'));
const VideoTranscript = dynamic(() => import('./VideoTranscript'));
const RatingButton = dynamic(
    () => import('courses/components/utbk/RatingButton')
);

interface MateriVideoProfileProps {
    course: CourseDetail;
    subchapter: SubChapter;
    isKelasRoute: boolean;
    isTranscriptOpen: boolean;
    setIsTranscriptOpen: Dispatch<SetStateAction<boolean>>;
}

function MateriVideoProfile({
    course,
    subchapter,
    isKelasRoute,
    isTranscriptOpen,
    setIsTranscriptOpen
}: MateriVideoProfileProps): JSX.Element {
    const router = useRouter();
    const [isCopilotModalOpen, setIsCopilotModalOpen] =
        useState<boolean>(false);
    const [isClient, setIsClient] = useState(false);

    const { isAuthenticated } = useAuth();
    const { width } = useWindowSize();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const currentVideoContext =
        subchapter?.video && subchapter?.subchapter_name
            ? {
                  id: subchapter.video.id,
                  title: course ? course.course_name : '',
                  subtitle: subchapter.chapter_name,
                  header: subchapter.subchapter_name,
                  contentType: 'course' as const
              }
            : undefined;

    const videoDescription = (
        subchapter?.video as Video & {
            description?: string;
        }
    )?.description;

    const lecturers =
        isKelasRoute && course?.lecturers?.length
            ? course.lecturers
            : subchapter.video?.lecturers;

    const handleCopilotClick = () => {
        const currentPath = (router.asPath || router.pathname || '').split(
            '?'
        )[0];

        if (!isAuthenticated && currentPath.startsWith('/kelas')) {
            router.push(`/masuk?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }

        setIsCopilotModalOpen(true);
    };

    return (
        <div className="mx-4 mt-4 lg:mx-0 lg:mt-10">
            {!isKelasRoute && (
                <p className="text-white text-xs lg:text-base">
                    Kelas Persiapan UTBK SNBT - {course.course_name}
                </p>
            )}

            <h1 className="text-white font-bold text-base mt-3 lg:text-2xl lg:mt-4">
                {subchapter.subchapter_name}
            </h1>

            <div className="flex flex-col">
                <div className="order-2 lg:order-1 flex items-center gap-3 mt-6 lg:mt-4">
                    {subchapter?.video?.transcript ? (
                        <Button
                            disabled={!course || !subchapter}
                            onClick={() => setIsTranscriptOpen(true)}
                            variant="neutral"
                            className="group flex-shrink flex items-center gap-1.5 text-sm !p-2 lg:!py-2 lg:!px-4">
                            <TranscriptIcon className="fill-white w-4 h-4 group-disabled:fill-neutral-300/30" />
                            <span className="hidden lg:block">Transcript</span>
                        </Button>
                    ) : (
                        <></>
                    )}

                    {isAuthenticated ? (
                        <div className="flex-shrink-0">
                            <RatingButton disabled={!course || !subchapter} />
                        </div>
                    ) : (
                        <></>
                    )}

                    {isKelasRoute ? (
                        <>
                            <div className="lg:hidden">
                                <Button
                                    onClick={() =>
                                        router.push('/kelas/downloads')
                                    }
                                    variant="neutral"
                                    size="small"
                                    className="group flex-shrink flex items-center gap-1.5 text-sm !p-2 lg:!py-2 lg:!px-4">
                                    <MdFileDownload className="text-white w-4 h-4" />
                                </Button>
                            </div>

                            <div className="hidden lg:block">
                                <ShareButton
                                    disabled={!course || !subchapter}
                                    typeCopy="COURSE VIDEO"
                                    shareCopy={`Coba deh nonton Video ${subchapter?.subchapter_name} dari Gradient Academy!`}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-shrink-0">
                            <ShareButton
                                disabled={!course || !subchapter}
                                typeCopy="COURSE VIDEO"
                                shareCopy={`Coba deh nonton Video ${subchapter?.subchapter_name} dari Gradient Academy!`}
                            />
                        </div>
                    )}

                    <Button
                        disabled={!course || !subchapter}
                        onClick={handleCopilotClick}
                        variant="primary"
                        className="flex-grow max-w-[256px] flex-shrink-0 !py-2 !px-4 flex justify-center items-center gap-1.5 text-sm [&>svg]:w-4 [&>svg]:h-4 lg:flex-grow-0">
                        <CopilotIconFill />
                        <span>Tanya Copilot AI</span>
                    </Button>

                    <CopilotModal
                        key={subchapter?.chapter_id}
                        isOpen={isCopilotModalOpen}
                        setOpen={setIsCopilotModalOpen}
                        xlWidth="xl:w-[29.5rem]"
                        currentContext={currentVideoContext}
                        chapterId={subchapter?.chapter_id}
                    />
                </div>

                {isKelasRoute && videoDescription && (
                    <div className="order-3 mt-6 flex flex-col gap-3 lg:hidden">
                        <h4 className="text-xs text-[#999999] font-semibold">
                            DEKSRIPSI
                        </h4>
                        <p className="text-white text-sm">{videoDescription}</p>
                    </div>
                )}

                {isKelasRoute && !!course.rating && course.rating > 0 && (
                    <div className="order-4 mt-4 mb-20 inline-flex items-center lg:hidden">
                        <div className="gap-1 px-2 py-[6px] bg-[#F2C04C80] w-fit rounded-[32px] flex flex-row items-center">
                            <AiFillStar className="w-4 h-4 text-[#F2C04C]" />
                            <span className="font-semibold text-white">
                                {typeof course?.rating === 'number'
                                    ? course.rating.toFixed(1)
                                    : '-'}
                            </span>
                        </div>
                    </div>
                )}

                {isKelasRoute && (
                    <div className="hidden lg:block order-3 mt-10 mb-20 lg:mb-0 rounded-2xl bg-[#181818] p-6 relative">
                        {!!course.rating && course.rating > 0 && (
                            <div className="absolute -top-4 right-5 inline-flex items-center">
                                <div className="gap-1 px-2 py-[6px] bg-[#F2C04C80] w-fit rounded-[32px] flex flex-row items-center">
                                    <AiFillStar className="w-4 h-4 text-[#F2C04C]" />
                                    <span className="font-semibold text-white">
                                        {typeof course?.rating === 'number'
                                            ? course.rating.toFixed(1)
                                            : '-'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <h4 className="text-xs text-[#999999] font-semibold">
                                PENGAJAR
                            </h4>
                            <LecturerProfile lecturers={lecturers} />
                        </div>

                        {videoDescription && (
                            <div className="mt-6 flex flex-col gap-3 relative pr-16">
                                <h4 className="text-xs text-[#999999] font-semibold">
                                    DEKSRIPSI
                                </h4>
                                <p className="text-white text-sm">
                                    {videoDescription}
                                </p>
                            </div>
                        )}

                        {!videoDescription &&
                            !!course.rating &&
                            course.rating > 0 && (
                                <div className="mt-6 inline-flex items-center">
                                    <div className="gap-1 px-2 py-[6px] bg-[#F2C04C80] w-fit rounded-[32px] flex flex-row items-center">
                                        <AiFillStar className="w-4 h-4 text-[#F2C04C]" />
                                        <span className="font-semibold text-white">
                                            {typeof course?.rating === 'number'
                                                ? course.rating.toFixed(1)
                                                : '-'}
                                        </span>
                                    </div>
                                </div>
                            )}
                    </div>
                )}

                <div
                    className={`order-1 mt-3 lg:order-2 lg:mt-10 ${
                        isKelasRoute ? 'lg:hidden' : ''
                    }`}>
                    <LecturerProfile lecturers={lecturers} />
                </div>
            </div>

            {isClient && width < 1024 ? (
                <Modal
                    isOpen={isTranscriptOpen}
                    setOpen={(value) => setIsTranscriptOpen(value)}
                    permanent={true}
                    variant="dark"
                    containerClassName="modal modal-open modal-bottom lg:modal-middle min-h-[100px]"
                    className="bg-[#181818] overflow-hidden h-screen p-0">
                    <VideoTranscript
                        transcript={subchapter.video?.transcript}
                        setIsOpen={setIsTranscriptOpen}
                    />
                </Modal>
            ) : (
                <></>
            )}
        </div>
    );
}

export default MateriVideoProfile;
