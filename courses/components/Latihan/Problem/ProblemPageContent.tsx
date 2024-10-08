import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
    useGetExerciseProblemQuery,
    useGetProblemSetDetailQuery,
    useGetOrCreateExerciseProblemProgressQuery,
    useGetExerciseProgressQuery,
    useUpdateExerciseProgressMutation,
    useUpdateExerciseProblemProgressMutation
} from 'courses/redux/api/exercisesApi';
import { useRouter } from 'next/router';
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
    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const hasTimeExpiredRef = useRef(false);

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

    useEffect(() => {
        setIsSubmitted(false);
        hasTimeExpiredRef.current = false;
    }, [problemId]);

    const isCurrentProblemSubmitted =
        isSubmitted ||
        problemProgress?.status === 'COMPLETED' ||
        (problemProgress?.submitted_answer_ids &&
            problemProgress.submitted_answer_ids.length > 0) ||
        !!problemProgress?.submitted_answer_text;

    const handleSubmit = useCallback(() => {
        setIsSubmitted(true);
    }, []);

    const [updateExerciseProgress] = useUpdateExerciseProgressMutation();
    const [updateProblemProgress] = useUpdateExerciseProblemProgressMutation();

    const handleTimeExpired = useCallback(async () => {
        if (!hasTimeExpiredRef.current) {
            hasTimeExpiredRef.current = true;
            if (problemSetData?.time_constraint === 'TOTAL_TIME') {
                if (exerciseProgress) {
                    try {
                        await updateExerciseProgress({
                            exercise_slug: slug,
                            progress_id: exerciseProgress.id,
                            data: { status: 'COMPLETED' }
                        }).unwrap();

                        const finalProblem =
                            problemSetData.problems[
                                problemSetData.problems.length - 1
                            ];

                        if (finalProblem && finalProblem.id === problemId) {
                            if (problem?.next_navigation) {
                                if (
                                    problem.next_navigation.type === 'section'
                                ) {
                                    router.push(
                                        `/latihan/${slug}/${problem.next_navigation.id}`
                                    );
                                } else {
                                    router.push(
                                        `/latihan/${slug}/${sectionId}/${problem.next_navigation.id}`
                                    );
                                }
                            } else {
                                router.push(
                                    `/latihan/${slug}/report/${exerciseProgress.id}`
                                );
                            }
                        } else {
                            router.push(
                                `/latihan/${slug}/report/${exerciseProgress.id}`
                            );
                        }
                    } catch (error) {
                        console.error(
                            'Failed to update exercise progress:',
                            error
                        );
                        hasTimeExpiredRef.current = false;
                    }
                }
            } else if (problemSetData?.time_constraint === 'PER_PROBLEM') {
                if (problemProgress) {
                    try {
                        await updateProblemProgress({
                            exercise_slug: slug,
                            exercise_progress_id: exerciseProgress!.id,
                            problem_id: problemId,
                            problem_progress_id: problemProgress.id,
                            data: { status: 'IN_PROGRESS' }
                        }).unwrap();

                        if (problem?.next_navigation) {
                            const nextUrl =
                                problem.next_navigation.type === 'problem'
                                    ? `/latihan/${slug}/${sectionId}/${problem.next_navigation.id}`
                                    : `/latihan/${slug}/${problem.next_navigation.id}`;
                            router.push(nextUrl);
                        } else {
                            router.push(
                                `/latihan/${slug}/report/${
                                    exerciseProgress!.id
                                }`
                            );
                        }
                    } catch (error) {
                        console.error(
                            'Failed to update problem progress:',
                            error
                        );
                        hasTimeExpiredRef.current = false;
                    }
                }
            }
        }
    }, [
        exerciseProgress,
        problemProgress,
        problemSetData,
        problem,
        router,
        slug,
        sectionId,
        problemId,
        updateExerciseProgress,
        updateProblemProgress
    ]);

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
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );
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
            firstProblemProgress={firstProblemProgress}
            isCurrentProblemSubmitted={isCurrentProblemSubmitted}
            onTimeExpired={handleTimeExpired}>
            <ProblemContent
                slug={slug}
                problemId={problemId}
                sectionId={sectionId}
                showSolution={showSolution}
                timeConstraint={timeConstraint}
                timeLimit={timeLimit}
                onTimeExpired={handleTimeExpired}
                onSubmit={handleSubmit}
            />
        </LatihanLayout>
    );
};

export default ProblemPageContent;
