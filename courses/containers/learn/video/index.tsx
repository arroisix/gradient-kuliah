import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import LearnContentBox from 'courses/components/LearnContentBox';
import { useLearning } from 'courses/contexts/LearningProvider';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LearnVideo from './learnVideo';

const VideoLearnContainer = ({ course }: { course: Course }): JSX.Element => {
    const router = useRouter();
    const { sub } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { setVideoPicked } = useLearning();
    const { data, isLoading } = useGetSubchapterDetailQuery(sub as string, {
        skip: sub === null || sub === undefined || !isAuthenticated
    });

    useEffect(() => {
        if (data) {
            setVideoPicked(data.video as Video);
        }
    }, [data]);

    return (
        <section className="min-h-screen pt-[65px] flex flex-col md:flex-row justify-between relative">
            <div className="w-full flex md:px-[7.5rem] md:pt-8">
                <div className="w-full h-full">
                    {!isLoading ? (
                        data ? (
                            <LearnVideo
                                video={data.video as Video}
                                subchapter={data}
                                key={sub as string}
                                learningProgress={course.learning_progress}
                            />
                        ) : (
                            <></>
                        )
                    ) : (
                        <div className="w-full h-1/2 bg-neutral-600 animate-pulse rounded-lg"></div>
                    )}
                </div>
            </div>
            <div className="h-full min-w-[30vw]">
                <LearnContentBox
                    chapters={course.chapters}
                    isSubscribed={course.is_subscribed}
                />
            </div>
        </section>
    );
};

export default VideoLearnContainer;
