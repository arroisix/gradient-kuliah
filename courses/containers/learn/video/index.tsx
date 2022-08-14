import LearnContentBox from 'courses/components/LearnContentBox';
import { useLearning } from 'courses/contexts/LearningProvider';
import LearnVideo from './learnVideo';

const VideoLearnContainer = ({ course }: { course: Course }): JSX.Element => {
    const { videoPicked, subchapter } = useLearning();

    return (
        <section className="min-h-screen pt-[65px] flex flex-col md:flex-row justify-between relative">
            <div className="w-full flex md:px-[7.5rem] md:pt-8">
                <div className="w-full h-full">
                    <LearnVideo
                        video={videoPicked}
                        subchapter={subchapter}
                        learningProgress={course.learning_progress}
                    />
                </div>
            </div>
            <div className="h-full">
                <LearnContentBox
                    chapters={course.chapters}
                    isSubscribed={course.is_subscribed}
                />
            </div>
        </section>
    );
};

export default VideoLearnContainer;
