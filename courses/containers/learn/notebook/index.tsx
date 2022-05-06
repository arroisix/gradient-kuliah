import { useState } from 'react';
import LearnContentBox from 'courses/components/LearnContentBox';
import { useLearning } from 'courses/contexts/LearningProvider';
import LearnNotebook from './learnNotebook';

const NotebookLearnContainer = ({
    course
}: {
    course: Course;
}): JSX.Element => {
    const { notebookPicked } = useLearning();
    const [hide, setHide] = useState(false);

    return (
        <section className="min-h-screen pt-[65px] flex justify-between relative">
            <div className="w-full flex h-full px-4 md:px-[7.5rem] pt-8">
                <div
                    className={`${hide ? 'w-full' : 'w-full md:w-3/4'} h-full`}>
                    <LearnNotebook notebook={notebookPicked} />
                </div>
            </div>
            <div className="fixed right-0 w-[300px]">
                <LearnContentBox
                    firstTab={1}
                    chapters={course.chapters}
                    hide={hide}
                    setHide={setHide}
                />
            </div>
        </section>
    );
};

export default NotebookLearnContainer;
