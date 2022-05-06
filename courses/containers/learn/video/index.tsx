import { useState } from 'react';
import LearnContentBox from 'courses/components/LearnContentBox';
import { useLearning } from 'courses/contexts/LearningProvider';
import LearnVideo from './learnVideo';

const VideoLearnContainer = ({ course }: { course: Course }): JSX.Element => {
    const { videoPicked, subchapterName } = useLearning();

    const [hide, setHide] = useState(false);

    return (
        <section className="min-h-screen pt-[65px] flex justify-between relative">
            <div className="w-full flex md:px-[7.5rem] md:pt-8">
                <div
                    className={`${hide ? 'w-full' : 'w-full md:w-3/4'} h-full`}>
                    <LearnVideo
                        isListHidden={hide}
                        video={videoPicked}
                        subchapterName={subchapterName}
                    />
                </div>
            </div>
            <div className="fixed right-0 w-[300px]">
                <LearnContentBox
                    chapters={course.chapters}
                    hide={hide}
                    setHide={setHide}
                />
            </div>
        </section>
    );
};

export default VideoLearnContainer;
