import VideoPlayer from 'commons/components/elements/Video';
import useWindowSize from 'commons/hooks/useWindowSize';
import PopupQuestionContent from 'courses/components/Exercise/PopupQuestion';
import { useLearning } from 'courses/contexts/LearningProvider';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/privateCourseApi';

const LearnVideo = ({
    video,
    subchapter,
    learningProgress
}: {
    video: Video;
    subchapter: SubChapter;
    learningProgress?: LearningProgress;
}): JSX.Element => {
    const { width } = useWindowSize();
    const [track] = useTrackSubchapterProgressMutation();
    const { videoPicked } = useLearning();

    return (
        <div className="w-full h-full">
            <VideoPlayer
                height={width <= 768 ? '200px' : '600px'}
                popupData={video?.popup_questions}
                video={video?.video_url}
                popupComponent={<PopupQuestionContent />}
                thumbnail={video?.thumbnail}
                key={video?.video_url}
                trackProgress={async (last_duration, isFinished) =>
                    track({
                        subchapter_id: subchapter.id as string,
                        learning_progress_id: learningProgress?.id as string,
                        progress_type: 'VIDEO',
                        video_progress: {
                            video_id: videoPicked.id,
                            last_duration: last_duration as unknown as string,
                            is_finished: isFinished ?? false
                        }
                    })
                }
            />
            <div className="my-8 px-4 md:px-0">
                <h3 className="text-2xl md:text-4xl font-bold">
                    {subchapter?.subchapter_name}
                </h3>
                {/* <p>{video?.description}</p> */}
                <div>
                    <p className="text-neutral-600 my-4">PENGAJAR</p>
                    {video?.lecturers?.map((lecturer) => (
                        <div
                            className="w-full grid grid-colrs-1 md:grid-cols-2 gap-2"
                            key={lecturer.name}>
                            <div className="flex w-full items-center">
                                <div className="h-16 w-16 bg-neutral-200 rounded-full overflow-hidden flex justify-center items-center">
                                    <img
                                        src={lecturer.photo}
                                        height="100%"
                                        alt="lecturer"
                                    />
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
