import { useState } from 'react';
import LearnContentBox from 'courses/components/LearnContentBox';
import { useLearning } from 'courses/contexts/LearningProvider';
import LearnVideo from './learnVideo';

const VideoLearnContainer = ({ course }: { course: Course }): JSX.Element => {
    const { videoPicked, subchapter } = useLearning();

    const [hide, setHide] = useState(false);

    return (
        <section className="min-h-screen pt-[65px] flex justify-between relative">
            <div className="w-full flex md:px-[7.5rem] md:pt-8">
                <div
                    className={`${hide ? 'w-full' : 'w-full md:w-3/4'} h-full`}>
                    <LearnVideo
                        isListHidden={hide}
                        video={videoPicked}
                        subchapter={subchapter}
                        learningProgress={course.learning_progress}
                    />
                </div>
            </div>
            <div className="fixed right-0 w-[300px] z-10">
                <LearnContentBox
                    chapters={course.chapters}
                    hide={hide}
                    setHide={setHide}
                    isSubscribed={course.is_subscribed}
                />
            </div>
        </section>
    );
};

export default VideoLearnContainer;
