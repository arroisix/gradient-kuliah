import React from 'react';
import {
    useGetExerciseProblemQuery,
    useGetProblemSetDetailQuery
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

    if (problemLoading || problemSetLoading || !problem || !problemSetData) {
        return <div>Loading...</div>;
    }

    const { time_constraint: timeConstraint, time_limit: timeLimit } =
        problemSetData;

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
            currentProblemId={problemId}>
            <ProblemContent
                slug={slug}
                problemId={problemId}
                sectionId={sectionId}
            />
        </LatihanLayout>
    );
};

export default ProblemPageContent;
