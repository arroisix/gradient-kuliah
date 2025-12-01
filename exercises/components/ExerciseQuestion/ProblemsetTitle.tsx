import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useExercise } from 'exercises/contexts/ExerciseProvider';
import { useGetProblemInProblemSetQuery } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import AnswerInformation from './AnswerInformation';

const ProblemsetTitle = () => {
    const router = useRouter();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const { showSolution } = useExercise();
    const { slug, exerciseProgressId, sectionId, problemId, solution } =
        router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: sectionId as string,
            problemId: problemId as string,
            exercise_progress_id: exerciseProgressId as string
        },
        { skip: !slug || !sectionId || !problemId }
    );

    if (isMobileBreakpoints && showSolution) {
        return null;
    }

    if (isMobileBreakpoints && solution && !showSolution) {
        return (
            <>
                <div className="w-full">
                    <h3 className="lg:font-semibold text-sm lg:text-xl text-graphie-400 lg:text-white">
                        Section {(problem?.problemset_order ?? 0) + 1}:{' '}
                        {problem?.problemset_name}
                    </h3>
                </div>
                <AnswerInformation
                    setShowSolution={() => undefined}
                    showSolution={false}
                />
            </>
        );
    }

    return (
        <div className="w-full">
            <h3 className="lg:font-semibold text-sm lg:text-xl text-graphie-400 lg:text-white">
                Section {(problem?.problemset_order ?? 0) + 1}:{' '}
                {problem?.problemset_name}
            </h3>
        </div>
    );
};

export default ProblemsetTitle;
