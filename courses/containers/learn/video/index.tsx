import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import LearnContentBox from 'courses/components/LearnContentBox';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import LearnVideo from './learnVideo';

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
        latest_subchapter,
        subchapter_progress
    } = useCourseSubscription(id as string);
    const { data, isLoading } = useGetSubchapterDetailQuery(sub as string, {
        skip: sub === null || sub === undefined || !isAuthenticated
    });

    return (
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh]">
            <div className="w-full h-full overflow-scroll">
                {!isLoading ? (
                    data ? (
                        <LearnVideo
                            key={data.id}
                            learningProgress={{
                                id: learning_progress_id as string,
                                subchapter_progress:
                                    subchapter_progress as SubchapterProgress[],
                                latest_subchapter:
                                    latest_subchapter as SubchapterProgress
                            }}
                        />
                    ) : (
                        <></>
                    )
                ) : (
                    <div className="w-full h-3/4 bg-neutral-600 animate-pulse" />
                )}
            </div>
            <div className="w-full md:w-[25vw]">
                {id && (
                    <LearnContentBox
                        slug={id as string}
                        chapters={chapters}
                        isSubscribed={is_subscribed}
                    />
                )}
            </div>
        </section>
    );
};

export default VideoLearnContainer;
