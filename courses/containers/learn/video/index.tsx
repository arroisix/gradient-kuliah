import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Modal from 'commons/components/modules/Modal';
import useElementSize from 'commons/hooks/useElementSize';
import CourseSummary from 'courses/components/CourseSummary';
import AiTutor from 'courses/components/LearningExperience/AiTutor';
import AiModalFeedback from 'courses/components/LearningExperience/AiTutor/AiModalFeedback';
import { useLearning } from 'courses/contexts/LearningProvider';
import { useGetCourseDetailQuery } from 'courses/redux/api/courseApi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import VideoPlayerContainer from 'courses/components/VideoPlayerContainer';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import { useGetSubchapterDetailV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicSubchapterDetailV2Query } from 'courses/redux/api/publicCourseV2Api';
import RelatedVideosSection from 'courses/components/RelatedVideosSection';
import FreeBadge from 'commons/components/elements/FreeBadge';
import RatingButton from 'courses/components/CourseRatingButton';
import ShareContentButton from 'courses/components/ShareContentButton';
import CopilotEntrypoint from 'copilot/components/CopilotEntrypoint';
import CopilotModal from 'copilot/components/CopilotModal';
import CourseDetailBox from 'courses/components/CourseDetailBox';
import DownloadVideoButton from 'courses/components/DownloadVideoButton';

const VideoLearnContainer = ({
    subchapter: ssrSubchapterData,
    course: ssrCourseData,
    recommendations
}: {
    subchapter: SubChapter;
    course: CourseDetail;
    recommendations: GetVideoRecommendationResponse;
}): JSX.Element => {
    const { isDesktopBreakpoints } = useWindowBreakpoints();
    const router = useRouter();
    const { id, slug } = router.query as { id: string; slug: string };
    const isAuthenticated = useSelector(getIsAuthenticated);
    const privateSubchapterDetails = useGetSubchapterDetailV2Query(
        { course_slug: id, subchapter_slug: slug },
        { skip: !id || !slug || !isAuthenticated }
    );
    const publicSubchapterDetails = useGetPublicSubchapterDetailV2Query(
        { course_slug: id, subchapter_slug: slug },
        { skip: !id || !slug }
    );
    const { data: subchapterResponse, isLoading } = isAuthenticated
        ? privateSubchapterDetails
        : publicSubchapterDetails;

    const { video } = useLearning();
    const { height: videoHeight, ref: videoRef } =
        useElementSize<HTMLDivElement>();
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isCopilotModalOpen, setIsCopilotModalOpen] =
        useState<boolean>(false);
    const [feedbackStatus, setFeedbackStatus] = useState<{
        status: 'NOT_HELPING' | 'HELPING' | 'NOT_SELECTED';
        answer_id: string;
    }>({ status: 'NOT_SELECTED', answer_id: '' });
    const { data: courseResponse } = useGetCourseDetailQuery(
        { slug: id as string },
        { skip: !id }
    );
    const course = courseResponse?.course_detail ?? ssrCourseData;
    const subchapter = subchapterResponse ?? ssrSubchapterData;

    const handleCopilotClick = () => {
        setIsCopilotModalOpen(true);
    };

    const currentVideoContext =
        subchapter?.video && subchapter?.subchapter_name
            ? {
                  id: subchapter.video.id,
                  title: course.course_name,
                  subtitle: subchapter.chapter_name,
                  header: subchapter.subchapter_name,
                  contentType: 'course' as const
              }
            : undefined;

    return (
        <section className="relative flex flex-col overflow-visible">
            <div className="grid grid-cols-1 gap-5 pb-px lg:pl-6 lg:grid-cols-3">
                <div
                    className="flex flex-col w-full lg:col-span-2 h-max lg:pl-8"
                    ref={videoRef}>
                    <Breadcrumb
                        className="py-4"
                        nextItem={
                            {
                                name: course?.course_name,
                                url: `/kelas/${id}`,
                                nextItem: {
                                    name: subchapter?.subchapter_name
                                }
                            } as BreadcrumbItemProps
                        }
                    />
                    <div className="order-last px-4 py-4 space-y-1 md:space-y-2 lg:pt-6 sm:px-0 md:px-12 lg:px-0">
                        <p className="text-sm text-neutral-400">
                            Kelas {course?.course_name}
                        </p>
                        <h1 className="text-base font-extrabold md:text-2xl">
                            {subchapter?.subchapter_name}
                        </h1>
                        <div className="flex items-center gap-2 justify-start overflow-x-auto">
                            {subchapter?.video?.is_free && (
                                <FreeBadge className="py-4 px-5" />
                            )}
                            <div className="flex-shrink-0">
                                <DownloadVideoButton
                                    isDownloaded={subchapter?.is_downloaded}
                                />
                            </div>
                            <div className="flex-shrink-0">
                                <RatingButton />
                            </div>
                            <div className="flex-shrink-0">
                                <ShareContentButton
                                    typeCopy="COURSE VIDEO"
                                    shareCopy={`Coba deh nonton Video ${subchapter?.subchapter_name} dari Gradient Academy!`}
                                />
                            </div>
                        </div>
                    </div>
                    <CopilotEntrypoint onClick={handleCopilotClick} />
                    <VideoPlayerContainer
                        isLoadingData={isLoading}
                        subchapter_name={subchapter?.subchapter_name}
                        video={subchapter?.video}
                        next_subchapter_slug={subchapter?.next_subchapter_slug}
                    />
                </div>
                {!isLoading && isDesktopBreakpoints ? (
                    <div
                        className="col-span-1"
                        style={{ maxHeight: videoHeight }}>
                        <CourseDetailBox />
                    </div>
                ) : (
                    <div className="col-span-1 hidden lg:block h-[300px] bg-neutral-600 rounded-lg animate-pulse" />
                )}
            </div>
            <CourseSummary ssrSubchapter={ssrSubchapterData} />
            <div>
                <RelatedVideosSection
                    title="Video Terkait"
                    videos={recommendations?.related_videos}
                />
                <RelatedVideosSection
                    title="Eksplor Video Lainnya"
                    videos={recommendations?.other_videos}
                />
            </div>
            {video?.ai_unique_id && (
                <AiTutor
                    uniqueId={video.ai_unique_id}
                    setIsShowModal={setIsShowModal}
                    setFeedbackStatus={setFeedbackStatus}
                />
            )}
            <Modal
                className="!bg-[#1D1D1D]"
                isOpen={isShowModal}
                setOpen={setIsShowModal}
                variant="dark">
                <AiModalFeedback
                    feedbackStatus={feedbackStatus}
                    setOpen={setIsShowModal}
                />
            </Modal>

            <CopilotModal
                key={subchapter?.chapter_id}
                isOpen={isCopilotModalOpen}
                setOpen={setIsCopilotModalOpen}
                xlWidth="xl:w-[29.5rem]"
                currentContext={currentVideoContext}
                chapterId={subchapter?.chapter_id}
            />
        </section>
    );
};

export default VideoLearnContainer;
