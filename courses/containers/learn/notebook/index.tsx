import LearnContentBox from 'courses/components/LearnContentBox';
import { useLearning } from 'courses/contexts/LearningProvider';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LearnNotebook from './learnNotebook';

const NotebookLearnContainer = ({
    course
}: {
    course: Course;
}): JSX.Element => {
    const router = useRouter();
    const { sub } = router.query;
    const { setNotebookPicked, notebookPicked } = useLearning();
    const { data } = useGetSubchapterDetailQuery(sub as string, {
        skip: sub === null || sub === undefined
    });

    useEffect(() => {
        if (data) {
            setNotebookPicked(data.notebook as Notebook);
        }
    }, [data]);

    return (
        <section className="min-h-screen pt-[65px] flex flex-col md:flex-row justify-between relative">
            <div className="w-full flex h-full px-4 md:px-[7.5rem] pt-8">
                <div className="w-full h-full">
                    <LearnNotebook notebook={notebookPicked} />
                </div>
            </div>
            <div className="h-full min-w-[30vw]">
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
