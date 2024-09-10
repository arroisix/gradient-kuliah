import { useRouter } from 'next/router';
import LatihanLayout from '../../../../../courses/components/Latihan/LatihanLayout';
import ProblemContent from '../../../../../courses/components/Latihan/Problem/ProblemContent';
import { useGetExerciseProblemQuery } from 'courses/redux/api/exercisesApi';

const ProblemPage = () => {
    const router = useRouter();
    const { slug, problemId, sectionId } = router.query;

    const { data: problem, isLoading } = useGetExerciseProblemQuery(
        { exercise_slug: slug as string, problem_id: problemId as string },
        { skip: !slug || !problemId }
    );

    if (isLoading || !problem) {
        return <div>Loading...</div>;
    }

    return (
        <LatihanLayout
            showNavigation={true}
            prevLink={
                problem.prev_navigation
                    ? problem.prev_navigation.type === 'problem'
                        ? `/latihan/${slug}/${sectionId}/${problem.prev_navigation.id}`
                        : `/latihan/${slug}/${problem.prev_navigation.id}`
                    : null
            }
            nextLink={
                problem.next_navigation
                    ? problem.next_navigation.type === 'problem'
                        ? `/latihan/${slug}/${sectionId}/${problem.next_navigation.id}`
                        : `/latihan/${slug}/${problem.next_navigation.id}`
                    : null
            }>
            <ProblemContent
                slug={slug as string}
                problemId={problemId as string}
                sectionId={sectionId as string}
            />
        </LatihanLayout>
    );
};

export default ProblemPage;
