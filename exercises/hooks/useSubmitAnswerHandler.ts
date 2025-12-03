import {
    useFinishUserProblemSetMutation,
    useGetAllProblemInProblemSetQuery,
    useGetExerciseDetailV2Query,
    useSubmitUserAnswerMutation
} from 'exercises/redux/api/exercisesApi';
import { ProblemInProblemSet } from 'exercises/types/exercises';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useExercise } from 'exercises/contexts/ExerciseProvider';

interface SaveAnswerOptions {
    onFinishModalOpen?: () => void;
    navigateDirection?: 'next' | 'prev' | 'custom' | null;
    customProblemId?: string;
}

const useSubmitAnswerHandler = (problem: ProblemInProblemSet) => {
    const router = useRouter();
    const { slug, sectionId, problemId } = router.query;
    const {
        selectedAnswer,
        setSelectedAnswer,
        openEndedAnswer,
        setOpenEndedAnswer,
        isLoading,
        setIsLoading
    } = useExercise();
    const [submitAnswer, { isLoading: isSubmitting }] =
        useSubmitUserAnswerMutation();
    const [submitProblemset, { isLoading: isFinishing }] =
        useFinishUserProblemSetMutation();
    const { data: exercise } = useGetExerciseDetailV2Query(
        { exercise_slug: slug as string },
        {
            skip: !slug
        }
    );
    const { data: firstProblem } = useGetAllProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetProgressId: problem?.id as string,
            page: 1,
            limit: 1
        },
        { skip: !slug || !sectionId || !problem }
    );

    // Update context isLoading whenever mutation loading state changes
    useEffect(() => {
        setIsLoading(isSubmitting || isFinishing);
    }, [isSubmitting, isFinishing, setIsLoading]);

    useEffect(() => {
        // Only reset answers when actually navigating to a different problem
        // Use both problemId and problem.id to detect actual changes
        if (problem && problem.problem_progress) {
            setSelectedAnswer(
                problem.problem_progress.submitted_answer_ids || []
            );
            setOpenEndedAnswer(
                problem.problem_progress.submitted_answer_text || ''
            );
        } else {
            setSelectedAnswer([]);
            setOpenEndedAnswer('');
        }
    }, [problem?.id, setSelectedAnswer, setOpenEndedAnswer]);

    const onAnswerClicked = (id: string) => {
        if (problem?.problem.type === 'MULTIPLE_ANSWER') {
            if (selectedAnswer.includes(id)) {
                setSelectedAnswer(
                    selectedAnswer.filter((answer) => answer !== id)
                );
            } else {
                setSelectedAnswer([...selectedAnswer, id]);
            }
        } else if (problem?.problem.type === 'MULTIPLE_CHOICE') {
            if (selectedAnswer.includes(id)) {
                setSelectedAnswer([]);
            } else {
                setSelectedAnswer([id]);
            }
        }
    };

    const handleAnswerChange = (answer: string) => {
        setOpenEndedAnswer(answer);
    };

    const finishProblemSet = async (): Promise<void> => {
        // Logic to finish the problem set can be added here
        const responsePs = await submitProblemset({
            slug: slug as string,
            problemset_progress_id: problem.id
        }).unwrap();

        if (!responsePs.is_show_solution) {
            if (responsePs.next_problemset_id) {
                router.push(
                    `/latihan/${slug}/${responsePs.next_problemset_id}`,
                    undefined,
                    { scroll: false, shallow: true }
                );
            } else {
                router.push(
                    `/latihan/${slug}/report/${exercise?.latest_exercise_progress?.id}`,
                    undefined,
                    {
                        scroll: false,
                        shallow: true
                    }
                );
            }
        } else {
            // Handle showing solution for the problem set if needed
            if (problem.show_solution === 'AFTER_COMPLETE') {
                router.push(
                    `/latihan/${slug}/${sectionId}/${firstProblem?.data[0].id}?solution=1`,
                    undefined,
                    { scroll: false, shallow: true }
                );
            } else {
                router.push(
                    `/latihan/${slug}/${sectionId}/${problemId}?solution=1`,
                    undefined,
                    { scroll: false, shallow: true }
                );
            }
        }
    };

    const saveAnswer = async (options?: SaveAnswerOptions): Promise<void> => {
        if (problem && problem.problem_progress) {
            const answerPayload =
                problem.problem.type === 'SHORT_ANSWER'
                    ? { submitted_answer_text: openEndedAnswer }
                    : { submitted_answer_ids: selectedAnswer };

            try {
                const response = await submitAnswer({
                    slug: slug as string,
                    problemset_progress_id: problem.id,
                    problem_progress_id: problem.problem_progress.id,
                    problem_id: problemId as string,
                    ...answerPayload
                }).unwrap();

                if (
                    !response?.is_show_solution &&
                    options?.navigateDirection === 'custom'
                ) {
                    // Navigate to custom problem
                    if (options.customProblemId) {
                        router.push(
                            `/latihan/${slug}/${sectionId}/${options.customProblemId}`,
                            undefined,
                            { scroll: false, shallow: true }
                        );
                    }
                } else if (
                    !response?.is_show_solution &&
                    options?.navigateDirection
                ) {
                    // Navigate based on direction
                    const targetProblemId =
                        options.navigateDirection === 'next'
                            ? problem?.next_problem_id
                            : problem?.previous_problem_id;

                    if (targetProblemId) {
                        router.push(
                            `/latihan/${slug}/${sectionId}/${targetProblemId}`,
                            undefined,
                            { scroll: false, shallow: true }
                        );
                    }
                } else if (
                    !response?.is_show_solution &&
                    problem?.next_problem_id
                ) {
                    // Default behavior: navigate to next problem
                    router.push(
                        `/latihan/${slug}/${sectionId}/${problem.next_problem_id}`,
                        undefined,
                        { scroll: false, shallow: true }
                    );
                } else if (response?.is_show_solution) {
                    // Handle showing solution if needed
                    if (!problem?.next_problem_id) {
                        await submitProblemset({
                            slug: slug as string,
                            problemset_progress_id: problem.id
                        }).unwrap();
                    }

                    router.push(
                        `/latihan/${slug}/${sectionId}/${problemId}?solution=1`,
                        undefined,
                        { scroll: false, shallow: true }
                    );
                } else {
                    // Open finish modal if callback provided
                    options?.onFinishModalOpen?.();
                }
            } catch (error) {
                console.error('Failed to submit answer:', error);
                return;
            }
        }

        return;
    };

    return {
        onAnswerClicked,
        selectedAnswer,
        openEndedAnswer,
        handleAnswerChange,
        saveAnswer,
        finishProblemSet,
        isLoading
    };
};

export default useSubmitAnswerHandler;
