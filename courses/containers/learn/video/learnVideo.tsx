import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import VideoPlayer from 'commons/components/elements/Video';
import { isNotNullAndUndefined } from 'commons/utils';
import PopupQuestionContent from 'courses/components/Exercise/PopupQuestion';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import { useLearning } from 'courses/contexts/LearningProvider';
import { useTrackSubchapterProgressMutation } from 'courses/redux/api/learningExperienceApi';
import { useSelector } from 'react-redux';

const LearnVideo = ({
    learningProgress
}: {
    learningProgress?: LearningProgress;
}): JSX.Element => {
    const [track] = useTrackSubchapterProgressMutation();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed, video } = useLearning();

    const renderVideoPlayer = (): JSX.Element => {
        if (is_subscribed || (video && video.is_free)) {
            if (learningProgress?.id) {
                return (
                    <VideoPlayer
                        autoPlay
                        token={video?.token}
                        popupData={video?.popup_questions}
                        video={video?.video_url}
                        popupComponent={<PopupQuestionContent />}
                        thumbnail={video?.thumbnail}
                        key={video?.video_url}
                        isMuxVideo={isNotNullAndUndefined(
                            video.mux_playback_id
                        )}
                        trackProgress={
                            isAuthenticated
                                ? async (last_duration, isFinished) =>
                                      track({
                                          learning_progress_id:
                                              learningProgress?.id as string,
                                          video_progress: {
                                              video_id: video.id,
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
        <div className="w-full h-full transition-all overflow-x-hidden relative">
            {renderVideoPlayer()}
        </div>
    );
};

export default LearnVideo;
