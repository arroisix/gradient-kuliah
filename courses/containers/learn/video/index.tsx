import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import VideoJS from 'commons/components/elements/Video/VideoJS';
import Modal from 'commons/components/modules/Modal';
import useElementSize from 'commons/hooks/useElementSize';
import { isNotNullAndUndefined } from 'commons/utils';
import AnotherClass from 'courses/components/AnotherClass';
import CourseDetailBox from 'courses/components/CourseDetailBox';
import CourseSummary from 'courses/components/CourseSummary';
import AiTutor from 'courses/components/LearningExperience/AiTutor';
import AiModalFeedback from 'courses/components/LearningExperience/AiTutor/AiModalFeedback';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import VideoPaywall from 'courses/components/VideoPaywall';
import { useLearning } from 'courses/contexts/LearningProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import {
    useGetCourseQuery,
    useGetPublicSubchapterDetailQuery
} from 'courses/redux/api/courseApi';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/learningExperienceApi';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

const VideoLearnContainer = (): JSX.Element => {
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
    const { data, isLoading } = isAuthenticated
        ? privateSubchapterDetails
        : publicSubchapterDetails;

    const {
        learning_progress_id,
        isLoading: isLoadingSubscription,
        is_subscribed
    } = useCourseSubscription(id as string);
    const [track] = useTrackSubchapterProgressMutation();
    const { video, subchapter } = useLearning();
    const { height: videoHeight, ref: videoRef } =
        useElementSize<HTMLDivElement>();
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [feedbackStatus, setFeedbackStatus] = useState<{
        status: 'NOT_HELPING' | 'HELPING' | 'NOT_SELECTED';
        answer_id: string;
    }>({ status: 'NOT_SELECTED', answer_id: '' });
    const { data: course } = useGetCourseQuery(undefined, {
        selectFromResult: ({ data, isLoading }) => ({
            data: data?.courses.find(({ slug }) => slug === id),
            isLoading: isLoading
        })
    });
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    return (
        <section className="relative pt-[64px] md:pt-[30px] pb-16 min-h-[100vh] flex flex-col">
            <div className="grid grid-cols-1 gap-5 lg:pl-6 lg:pr-[15px] lg:grid-cols-3 pb-1">
                <div
                    className="w-full lg:col-span-2 h-max lg:pl-8"
                    ref={videoRef}>
                    {(isLoading || isLoadingSubscription) && (
                        <div className="w-full h-[300px] bg-neutral-600 animate-pulse" />
                    )}
                    {!isLoading &&
                        !isLoadingSubscription &&
                        (is_subscribed || data?.video?.is_free ? (
                            <div className="md:rounded-lg md:overflow-hidden">
                                <VideoJS
                                    key={data?.video?.video_url}
                                    src={
                                        isNotNullAndUndefined(
                                            data?.video?.mux_playback_id
                                        )
                                            ? `${
                                                  data?.video
                                                      ?.mux_playback_id as string
                                              }${
                                                  data?.video?.token
                                                      ? `?token=${data?.video?.token}`
                                                      : ''
                                              }`
                                            : (data?.video?.video_url as string)
                                    }
                                    isMuxVideo={isNotNullAndUndefined(
                                        data?.video?.mux_playback_id
                                    )}
                                    trackProgress={
                                        isAuthenticated
                                            ? async (
                                                  last_duration,
                                                  isFinished
                                              ) =>
                                                  track({
                                                      learning_progress_id:
                                                          learning_progress_id as string,
                                                      video_progress: {
                                                          video_id: video?.id,
                                                          last_duration:
                                                              last_duration as unknown as string,
                                                          is_finished:
                                                              isFinished ??
                                                              false
                                                      }
                                                  })
                                            : undefined
                                    }
                                    next_subchapter_link={
                                        subchapter?.next_subchapter
                                            ?.chapter_id &&
                                        subchapter.next_subchapter.id
                                            ? `/kelas/${id}/belajar/video/${subchapter?.next_subchapter?.chapter_id}/${subchapter?.next_subchapter?.id}`
                                            : ''
                                    }
                                />
                            </div>
                        ) : isLandingPageRevampOn ? (
                            <VideoPaywall />
                        ) : (
                            <NeedSubscribe />
                        ))}
                    <div className="px-4 pt-4 space-y-1 lg:pt-6 sm:px-0 md:px-12 lg:px-0">
                        <h3 className="text-sm lg:text-xl text-neutral-400">
                            {course?.course_name}
                        </h3>
                        <h2 className="text-base font-extrabold md:text-2xl">
                            {data?.subchapter_name}
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
