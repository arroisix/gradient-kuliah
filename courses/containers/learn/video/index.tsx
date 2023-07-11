import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import AiTutor from 'courses/components/LearningExperience/AiTutor';
import { useLearning } from 'courses/contexts/LearningProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import LearnVideo from './learnVideo';
import CourseDetailBox from 'courses/components/CourseDetailBox';
import CourseSummary from 'courses/components/CourseSummary';

const VideoLearnContainer = (): JSX.Element => {
    const router = useRouter();
    const { sub, id } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { learning_progress_id, latest_watch_video, watch_progress } =
        useCourseSubscription(id as string);
    const { data, isLoading } = useGetSubchapterDetailQuery(sub as string, {
        skip: sub === null || sub === undefined || !isAuthenticated
    });
    const { video } = useLearning();

    return (
        <section className="relative pt-[64px] md:pt-[97px] pb-16 min-h-[100vh] flex flex-col gap-8">
            <div className="w-full h-full flex gap-5 lg:gap-8 px-0 md:px-16">
                <div className="w-full lg:w-[70%] h-max md:rounded-lg md:overflow-hidden">
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
            <h2 className="font-extrabold text-base md:text-2xl px-5 md:px-16">
                Pelajaran Tiga
            </h2>
            <CourseSummary />
            {video?.ai_unique_id && <AiTutor uniqueId={video.ai_unique_id} />}
        </section>
    );
};

export default VideoLearnContainer;
