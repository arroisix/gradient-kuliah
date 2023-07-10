import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import AiTutor from 'courses/components/LearningExperience/AiTutor';
import { useLearning } from 'courses/contexts/LearningProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import LearnVideo from './learnVideo';
import CourseDetailBox from 'courses/components/CourseDetailBox';

const VideoLearnContainer = ({
    chapters
}: {
    chapters: Chapter[];
}): JSX.Element => {
    const router = useRouter();
    const { sub, id } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const {
        is_subscribed,
        learning_progress_id,
        latest_watch_video,
        watch_progress
    } = useCourseSubscription(id as string);
    const { data, isLoading } = useGetSubchapterDetailQuery(sub as string, {
        skip: sub === null || sub === undefined || !isAuthenticated
    });
    const { video } = useLearning();

    return (
        <section className="relative pt-[97px] min-h-[100vh]">
            <div className="w-full flex gap-8 px-16">
                <div className="w-full lg:w-[70%] h-full rounded-lg overflow-hidden">
                    {!isLoading ? (
                        data ? (
                            <LearnVideo
                                key={data.id}
                                learningProgress={{
                                    id: learning_progress_id as string,
                                    watch_progress:
                                        watch_progress as SubchapterProgress[],
                                    latest_watch_video:
                                        latest_watch_video as SubchapterProgress
                                }}
                            />
                        ) : (
                            <></>
                        )
                    ) : (
                        <div className="w-full h-full bg-neutral-600 animate-pulse" />
                    )}
                </div>
                <div className="w-[30%] hidden lg:block">
                    <CourseDetailBox />
                </div>
            </div>
            {video?.ai_unique_id && <AiTutor uniqueId={video.ai_unique_id} />}
        </section>
    );
};

export default VideoLearnContainer;
