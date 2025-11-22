import TiptapViewer from 'courses/components/Textbook/TiptapViewer';
import {
    useGetProblemInProblemSetQuery,
    useGetProblemSolutionQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';

const SolutionContainer = () => {
    const router = useRouter();
    const { slug, sectionId, problemId, solution } = router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: sectionId as string,
            problemId: problemId as string
        },
        { skip: !slug || !sectionId || !problemId }
    );
    const { data: solutionData } = useGetProblemSolutionQuery(
        {
            slug: slug as string,
            problem_progress_id: problem?.problem_progress?.id as string
        },
        { skip: !slug || !solution || !problem?.problem_progress?.id }
    );
    return (
        <div className="flex flex-col gap-3 lg:overflow-y-auto">
            <TiptapViewer
                content={solutionData?.solution}
                className="text-center"
            />
        </div>
    );
};
export default SolutionContainer;
