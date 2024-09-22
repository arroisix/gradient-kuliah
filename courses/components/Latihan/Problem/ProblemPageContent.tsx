import React from 'react';
import {
    useGetExerciseProblemQuery,
    useGetProblemSetDetailQuery,
    useGetOrCreateExerciseProblemProgressQuery,
    useGetExerciseProgressQuery
} from 'courses/redux/api/exercisesApi';
import ProblemContent from './ProblemContent';
import LatihanLayout from '../LatihanLayout';

interface ProblemPageContentProps {
    slug: string;
    problemId: string;
    sectionId: string;
}

const ProblemPageContent: React.FC<ProblemPageContentProps> = ({
    slug,
    problemId,
    sectionId
}) => {
    const { data: problem, isLoading: problemLoading } =
        useGetExerciseProblemQuery(
            { exercise_slug: slug, problem_id: problemId },
            { skip: !slug || !problemId }
        );

    const { data: problemSetData, isLoading: problemSetLoading } =
        useGetProblemSetDetailQuery(sectionId, { skip: !sectionId });

    const { data: exerciseProgress, isLoading: isProgressLoading } =
        useGetExerciseProgressQuery({ exercise_slug: slug }, { skip: !slug });

    const { data: problemProgress, isLoading: isProblemProgressLoading } =
        useGetOrCreateExerciseProblemProgressQuery(
            {
                exercise_slug: slug,
                exercise_progress_id: exerciseProgress?.id ?? '',
                problem_id: problemId
            },
            {
                skip: !exerciseProgress?.id,
                refetchOnMountOrArgChange: true
            }
        );

    const {
        data: firstProblemProgress,
        isLoading: isFirstProblemProgressLoading
    } = useGetOrCreateExerciseProblemProgressQuery(
        {
            exercise_slug: slug,
            exercise_progress_id: exerciseProgress?.id ?? '',
            problem_id: problemSetData?.problems[0]?.id ?? ''
        },
        {
            skip: !exerciseProgress?.id || !problemSetData?.problems[0]?.id,
            refetchOnMountOrArgChange: true
        }
    );

    if (
        problemLoading ||
        problemSetLoading ||
        isProgressLoading ||
        isProblemProgressLoading ||
        isFirstProblemProgressLoading ||
        !problem ||
        !problemSetData ||
        !problemProgress ||
        !firstProblemProgress
    ) {
        return <div>Loading...</div>;
    }

    const {
        time_constraint: timeConstraint,
        time_limit: timeLimit,
        show_solution: showSolution
    } = problemSetData;

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
            }
            timeConstraint={timeConstraint}
            timeLimit={timeLimit}
            currentProblemId={problemId}
            problemProgress={problemProgress}
            firstProblemProgress={firstProblemProgress}>
            <ProblemContent
                slug={slug}
                problemId={problemId}
                sectionId={sectionId}
                showSolution={showSolution}
            />
        </LatihanLayout>
    );
};

export default ProblemPageContent;
