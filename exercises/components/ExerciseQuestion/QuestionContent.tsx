import { cn } from 'commons/utils';
import TiptapViewer from 'courses/components/Textbook/TiptapViewer';
import { useExercise } from 'exercises/contexts/ExerciseProvider';
import { useGetProblemInProblemSetQuery } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';

const QuestionContent = () => {
    const { showSolution } = useExercise();
    const router = useRouter();
    const { slug, sectionId, problemsetId, problemId, exerciseProgressId } =
        router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: (sectionId as string) || (problemsetId as string),
            problemId: problemId as string,
            exercise_progress_id: exerciseProgressId as string
        },
        { skip: !slug || (!sectionId && !problemsetId) || !problemId }
    );

    return (
        <div
            className={cn(
                'flex flex-col gap-2 w-full h-full lg:overflow-y-auto',
                showSolution && 'hidden lg:flex'
            )}>
            <h2 className="lg:font-semibold text-sm lg:text-2xl text-white">
                Nomor {(problem?.problem?.order ?? 0) + 1}
            </h2>
            <TiptapViewer
                content={problem?.problem.question}
                className="lg:!text-xl text-white"
            />
        </div>
    );
};

export default QuestionContent;
