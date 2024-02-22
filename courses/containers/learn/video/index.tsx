import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Modal from 'commons/components/modules/Modal';
import useElementSize from 'commons/hooks/useElementSize';
import AnotherClass from 'courses/components/AnotherClass';
import CourseDetailBox from 'courses/components/CourseDetailBox';
import CourseSummary from 'courses/components/CourseSummary';
import AiTutor from 'courses/components/LearningExperience/AiTutor';
import AiModalFeedback from 'courses/components/LearningExperience/AiTutor/AiModalFeedback';
import { useLearning } from 'courses/contexts/LearningProvider';
import {
    useGetCourseDetailQuery,
    useGetPublicSubchapterDetailQuery
} from 'courses/redux/api/courseApi';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import VideoPlayerContainer from 'courses/components/VideoPlayerContainer';

const VideoLearnContainer = ({
    subchapter: ssrSubchapterData,
    course: ssrCourseData
}: {
    subchapter: SubChapter;
    course: CourseDetail;
}): JSX.Element => {
    const { isDesktopBreakpoints } = useWindowBreakpoints();
    const router = useRouter();
    const { sub, id } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const privateSubchapterDetails = useGetSubchapterDetailQuery(
        sub as string,
        { skip: !sub || !isAuthenticated }
    );
    const publicSubchapterDetails = useGetPublicSubchapterDetailQuery(
        sub as string,
        { skip: !sub || isAuthenticated }
    );
    const { data: subchapterResponse, isLoading } = isAuthenticated
        ? privateSubchapterDetails
        : publicSubchapterDetails;

    const { video } = useLearning();
    const { height: videoHeight, ref: videoRef } =
        useElementSize<HTMLDivElement>();
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
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

    return (
        <section className="relative py-16 min-h-[100vh] flex flex-col">
            <div className="grid grid-cols-1 gap-5 lg:pl-6 lg:pr-[15px] lg:grid-cols-3 pb-1">
                <div
                    className="w-full lg:col-span-2 h-max lg:pl-8"
                    ref={videoRef}>
                    <VideoPlayerContainer
                        isLoadingData={isLoading}
                        subchapter_name={subchapter?.subchapter_name}
                        video={subchapter?.video}
                        next_subchapter={subchapter?.next_subchapter}
                    />
                    <div className="px-4 pt-4 space-y-1 lg:pt-6 sm:px-0 md:px-12 lg:px-0">
                        <h3 className="text-sm lg:text-xl text-neutral-400">
                            {course?.course_name}
                        </h3>
                        <h2 className="text-base font-extrabold md:text-2xl">
                            {subchapter?.subchapter_name}
                        </h2>
                    </div>
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
            <CourseSummary />
            <AnotherClass />
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
        </section>
    );
};

export default VideoLearnContainer;
