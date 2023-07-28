import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import AiTutor from 'courses/components/LearningExperience/AiTutor';
import { useLearning } from 'courses/contexts/LearningProvider';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import CourseDetailBox from 'courses/components/CourseDetailBox';
import CourseSummary from 'courses/components/CourseSummary';
import AnotherClass from 'courses/components/AnotherClass';
import useElementSize from 'commons/hooks/useElementSize';
import { isNotNullAndUndefined } from 'commons/utils';
import VideoJS from 'commons/components/elements/Video/VideoJS';
import Modal from 'commons/components/modules/Modal';
import { useState } from 'react';
import AiModalFeedback from 'courses/components/LearningExperience/AiTutor/AiModalFeedback';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/learningExperienceApi';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const VideoLearnContainer = (): JSX.Element => {
    const router = useRouter();
    const { sub, id } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data, isLoading } = useGetSubchapterDetailQuery(sub as string, {
        skip: sub === null || sub === undefined || !isAuthenticated
    });
    const { learning_progress_id, isLoading: isLoadingSubscription } =
        useCourseSubscription(id as string);
    const [track] = useTrackSubchapterProgressMutation();
    const { video, subchapter } = useLearning();
    const { height: videoHeight, ref: videoRef } =
        useElementSize<HTMLDivElement>();
    const [isShowModal, setIsShowModal] = useState<0 | 1>(0);
    const [feedbackStatus, setFeedbackStatus] = useState<{
        status: 'NOT_HELPING' | 'HELPING' | 'NOT_SELECTED';
        answer_id: string;
    }>({ status: 'NOT_SELECTED', answer_id: '' });

    return (
        <section className="relative pt-[64px] md:pt-[97px] pb-16 min-h-[100vh] flex flex-col gap-8">
            <div className="w-full h-full flex gap-5 lg:gap-8 px-0 md:px-16">
                <div
                    className="w-full lg:w-[70%] h-max md:rounded-lg md:overflow-hidden"
                    ref={videoRef}>
                    {(isLoading || isLoadingSubscription) && (
                        <div className="w-full h-[300px] bg-neutral-600 animate-pulse" />
                    )}
                    {!isLoading && !isLoadingSubscription && (
                        <div>
                            <VideoJS
                                src={
                                    isNotNullAndUndefined(
                                        data?.video?.mux_playback_id
                                    )
                                        ? `${
                                              data?.video
                                                  ?.mux_playback_id as string
                                          }${
                                              data?.video?.token
                                                  ? `?token${data?.video?.token}`
                                                  : ''
                                          }`
                                        : (data?.video?.video_url as string)
                                }
                                isMuxVideo={isNotNullAndUndefined(
                                    data?.video?.mux_playback_id
                                )}
                                trackProgress={
                                    isAuthenticated
                                        ? async (last_duration, isFinished) =>
                                              track({
                                                  learning_progress_id:
                                                      learning_progress_id as string,
                                                  video_progress: {
                                                      video_id: video.id,
                                                      last_duration:
                                                          last_duration as unknown as string,
                                                      is_finished:
                                                          isFinished ?? false
                                                  }
                                              })
                                        : undefined
                                }
                                next_subchapter_link={
                                    subchapter?.next_subchapter?.chapter_id &&
                                    subchapter.next_subchapter.id
                                        ? `/kelas/${id}/belajar/video/${subchapter?.next_subchapter?.chapter_id}/${subchapter?.next_subchapter?.id}`
                                        : ''
                                }
                            />
                        </div>
                    )}
                </div>
                {!isLoading ? (
                    <div
                        className="w-[30%] hidden lg:block"
                        style={{ height: videoHeight }}>
                        <CourseDetailBox />
                    </div>
                ) : (
                    <div className="w-[30%] hidden lg:block h-[300px] bg-neutral-600 rounded-lg animate-pulse" />
                )}
            </div>
            <h2 className="font-extrabold text-base md:text-2xl px-5 md:px-16">
                {data?.subchapter_name}
            </h2>
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
