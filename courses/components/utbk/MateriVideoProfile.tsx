import Button from 'commons/components/elements/Button';
import { TranscriptIcon } from 'commons/components/elements/Icons/TranscriptIcon';
import { ShareButton } from './ShareButton';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';
import dynamic from 'next/dynamic';
import { LecturerProfile } from './LecturerProfile';
import { useState } from 'react';
import { useAuth } from 'authentication/contexts/AuthProvider';

const Modal = dynamic(() => import('commons/components/modules/Modal'));
const CopilotModal = dynamic(() => import('copilot/components/CopilotModal'));
const VideoTranscript = dynamic(() => import('./VideoTranscript'));
const RatingButton = dynamic(
    () => import('courses/components/utbk/RatingButton')
);

interface MateriVideoProfileProps {
    course: CourseDetail;
    subchapter: SubChapter;
}

function MateriVideoProfile({
    course,
    subchapter
}: MateriVideoProfileProps): JSX.Element {
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
    const [isCopilotModalOpen, setIsCopilotModalOpen] =
        useState<boolean>(false);

    const { isAuthenticated } = useAuth();

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

    return (
        <div className="mx-4 mt-4 lg:mx-0 lg:mt-10">
            <p className="text-white text-xs lg:text-base">
                Kelas Persiapan UTBK SNBT - {course.course_name}
            </p>

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

                    <div className="flex-shrink-0">
                        <ShareButton
                            disabled={!course || !subchapter}
                            typeCopy="COURSE VIDEO"
                            shareCopy={`Coba deh nonton Video ${subchapter?.subchapter_name} dari Gradient Academy!`}
                        />
                    </div>

                    <Button
                        disabled={!course || !subchapter}
                        onClick={() => setIsCopilotModalOpen(true)}
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

                <div className="order-1 mt-3 lg:order-2 lg:mt-10">
                    <LecturerProfile lecturers={subchapter.video?.lecturers} />
                </div>
            </div>

            {isTranscriptOpen ? (
                <Modal
                    isOpen={isTranscriptOpen}
                    setOpen={(value) => setIsTranscriptOpen(value)}
                    permanent={true}
                    variant="dark"
                    containerClassName="modal modal-open modal-bottom lg:modal-middle min-h-[100px]"
                    className="bg-[#181818] h-screen p-0">
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
