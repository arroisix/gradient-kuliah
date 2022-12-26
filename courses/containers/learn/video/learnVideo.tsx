import VideoPlayer from 'commons/components/elements/Video';
import PopupQuestionContent from 'courses/components/Exercise/PopupQuestion';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import { useLearning } from 'courses/contexts/LearningProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';

const LearnVideo = ({
    video,
    subchapter,
    learningProgress
}: {
    video: Video;
    subchapter: SubChapter;
    learningProgress?: LearningProgress;
}): JSX.Element => {
    const [track] = useTrackSubchapterProgressMutation();
    const router = useRouter();
    const { sub, id } = router.query;
    const { videoPicked } = useLearning();
    const { is_subscribed } = useCourseSubscription(id as string);

    const renderVideoPlayer = (): JSX.Element => {
        if (is_subscribed || videoPicked?.is_free) {
            if (
                videoPicked?.video_url !== null &&
                videoPicked?.id !== undefined &&
                learningProgress?.id
            ) {
                return (
                    <VideoPlayer
                        autoPlay
                        popupData={video?.popup_questions}
                        video={video?.video_url}
                        popupComponent={<PopupQuestionContent />}
                        thumbnail={video?.thumbnail}
                        key={video?.video_url}
                        trackProgress={
                            is_subscribed
                                ? async (last_duration, isFinished) =>
                                      track({
                                          subchapter_id:
                                              (subchapter?.id as string) ?? sub,
                                          learning_progress_id:
                                              learningProgress?.id as string,
                                          progress_type: 'VIDEO',
                                          video_progress: {
                                              video_id: videoPicked?.id,
                                              last_duration:
                                                  last_duration as unknown as string,
                                              is_finished: isFinished ?? false
                                          }
                                      })
                                : undefined
                        }
                    />
                );
            }

            return (
                <div className="w-full h-3/4 bg-neutral-600 animate-pulse" />
            );
        }

        return <NeedSubscribe />;
    };

    return (
        <div className="w-full h-full transition-all">
            {renderVideoPlayer()}
            <div className="my-8 px-4 md:px-[7.5rem] pb-4 md:pb-[7.5rem]">
                <h3 className="text-2xl md:text-4xl font-bold">
                    {subchapter?.subchapter_name}
                </h3>
                {/* <p>{video?.description}</p> */}
                <div className="w-full">
                    <p className="text-neutral-600 my-4">PENGAJAR</p>
                    {video?.lecturers?.map((lecturer) => (
                        <div
                            className="w-full grid grid-colrs-1 md:grid-cols-2 gap-2"
                            key={lecturer.name}>
                            <div className="flex w-full items-center">
                                <div>
                                    <div className="h-16 w-16 bg-neutral-200 rounded-full overflow-hidden flex justify-center items-center">
                                        <img
                                            src={lecturer.photo}
                                            height="100%"
                                            alt="lecturer"
                                        />
                                    </div>
                                </div>
                                <div className="ml-2">
                                    <h5 className="md:text-xl text-neutral-200">
                                        {lecturer.name}
                                    </h5>
                                    <h5 className="md:text-xl font-bold">
                                        {lecturer.role}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LearnVideo;
