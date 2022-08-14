import LearnContentBox from 'courses/components/LearnContentBox';
import { useLearning } from 'courses/contexts/LearningProvider';
import LearnNotebook from './learnNotebook';

const NotebookLearnContainer = ({
    course
}: {
    course: Course;
}): JSX.Element => {
    const { notebookPicked } = useLearning();

    return (
        <section className="min-h-screen pt-[65px] flex justify-between relative">
            <div className="w-full flex h-full px-4 md:px-[7.5rem] pt-8">
                <div className="w-full h-full">
                    <LearnNotebook notebook={notebookPicked} />
                </div>
            </div>
            <div className="fixed right-0 w-[300px]">
                <LearnContentBox
                    firstTab={1}
                    chapters={course.chapters}
                    isSubscribed={course.is_subscribed}
                />
            </div>
        </section>
    );
};

export default NotebookLearnContainer;
