import Button from 'commons/components/elements/Button';
import SquareSettings from 'commons/components/elements/Icons/SquareSettings';
import { cn } from 'commons/utils';
import { useGetProblemInProblemSetQuery } from 'exercises/redux/api/exercisesApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import QuizNavigationBottomSheet from '../ExerciseUtils/QuizNavigationBottomSheet';
import Book from 'commons/components/elements/Icons/Book';
import { useExercise } from 'exercises/contexts/ExerciseProvider';
import ExerciseReportNavigationFooter from './ExerciseReportNavigationFooter';
import useSubmitAnswerHandler from 'exercises/hooks/useSubmitAnswerHandler';

const ExerciseQuestionFooter: React.FC<{
    saveAnswer: () => Promise<void>;
    isDisabled: boolean;
}> = ({ saveAnswer, isDisabled }) => {
    const router = useRouter();
    const {
        slug,
        exerciseProgressId,
        sectionId,
        problemsetId,
        problemId,
        solution
    } = router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: sectionId as string,
            problemId: problemId as string,
            exercise_progress_id: exerciseProgressId as string
        },
        { skip: !slug || !sectionId || !problemId }
    );

    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const {
        setShowSolution,
        showSolution,
        selectedAnswer,
        openEndedAnswer,
        isLoading
    } = useExercise();
    const { saveAnswer: saveAnswerFromHook } = useSubmitAnswerHandler(problem!);
    const isNoNeedNavigation = useMemo(() => {
        return (
            problem?.time_constraint === 'PER_PROBLEM' ||
            problem?.show_solution === 'AFTER_PROBLEM'
        );
    }, [problem]);

    // Helper function to compare arrays
    const arraysEqual = (a: string[], b: string[]): boolean => {
        if (a.length !== b.length) return false;
        return (
            a.every((item) => b.includes(item)) &&
            b.every((item) => a.includes(item))
        );
    };

    const handleProblemSelect = (selectedProblemId: string) => {
        router.push(
            `/latihan/${slug}/${sectionId}/${selectedProblemId}${
                solution ? '?solution=1' : ''
            }`,
            undefined,
            { scroll: false, shallow: true }
        );
    };

    const handleSaveAnswerWithNavigation = async (options: {
        navigateDirection: 'custom';
        customProblemId: string;
    }) => {
        await saveAnswerFromHook(options);
    };

    const handleNextProblem = () => {
        if (problem?.next_problem_id) {
            // Check if answer has changed from what was already submitted
            const submittedAnswerIds =
                problem?.problem_progress?.submitted_answer_ids || [];
            const submittedAnswerText =
                problem?.problem_progress?.submitted_answer_text || '';

            const answerHasChanged =
                problem?.problem.type === 'SHORT_ANSWER'
                    ? openEndedAnswer !== submittedAnswerText
                    : !arraysEqual(selectedAnswer, submittedAnswerIds);

            if (answerHasChanged) {
                // Save answer before navigating to next problem
                saveAnswer();
            } else {
                // No answer to save, navigate directly
                router.push(
                    `/latihan/${slug}/${sectionId}/${problem.next_problem_id}${
                        solution ? '?solution=1' : ''
                    }`,
                    undefined,
                    { scroll: false, shallow: true }
                );
            }
        }
    };

    const handlePreviousProblem = () => {
        if (problem?.previous_problem_id) {
            // Check if answer has changed from what was already submitted
            const submittedAnswerIds =
                problem?.problem_progress?.submitted_answer_ids || [];
            const submittedAnswerText =
                problem?.problem_progress?.submitted_answer_text || '';

            const answerHasChanged =
                problem?.problem.type === 'SHORT_ANSWER'
                    ? openEndedAnswer !== submittedAnswerText
                    : !arraysEqual(selectedAnswer, submittedAnswerIds);

            if (answerHasChanged) {
                // Save answer before navigating to previous problem
                saveAnswerFromHook({ navigateDirection: 'prev' });
            } else {
                // No answer to save, navigate directly
                router.push(
                    `/latihan/${slug}/${sectionId}/${
                        problem.previous_problem_id
                    }${solution ? '?solution=1' : ''}`,
                    undefined,
                    { scroll: false, shallow: true }
                );
            }
        }
    };

    const renderOnSolutionFooter = () => {
        if (showSolution) {
            return (
                <div className="flex flex-row gap-2 items-center fixed bottom-0 left-0 w-full bg-black p-4 lg:hidden">
                    <Button
                        onClick={() =>
                            setShowSolution && setShowSolution(!showSolution)
                        }
                        variant="secondary"
                        size="normal"
                        disabled={isDisabled}
                        className="w-full flex items-center justify-center gap-2">
                        Lihat Soal
                    </Button>
                    <Button
                        onClick={saveAnswer}
                        variant="primary"
                        size="normal"
                        className="w-full"
                        disabled={isDisabled}>
                        Selanjutnya
                    </Button>
                </div>
            );
        } else {
            return (
                <div className="flex flex-row gap-2 items-center fixed bottom-0 left-0 w-full bg-black p-4 lg:hidden">
                    <Button
                        onClick={() =>
                            setShowSolution && setShowSolution(!showSolution)
                        }
                        variant="secondary"
                        size="normal"
                        disabled={isDisabled}
                        className="w-full flex items-center justify-center gap-2">
                        Lihat Pembahasan
                        <Book />
                    </Button>
                    <Button
                        onClick={saveAnswer}
                        variant="primary"
                        size="normal"
                        className="h-10"
                        disabled={isDisabled}>
                        <ChevronRight size={20} />
                    </Button>
                </div>
            );
        }
    };

    if (problemsetId) {
        return (
            <ExerciseReportNavigationFooter
                saveAnswer={saveAnswer}
                isDisabled={isDisabled}
            />
        );
    }

    return (
        <>
            {solution ? (
                renderOnSolutionFooter()
            ) : (
                <div className="flex flex-row gap-2 items-center fixed bottom-0 left-0 w-full bg-black p-4 lg:hidden">
                    <div className="flex flex-row gap-2 items-center">
                        <Button
                            variant="secondary"
                            onClick={handlePreviousProblem}
                            disabled={
                                !problem?.previous_problem_id || isLoading
                            }
                            className={cn(
                                'text-center !p-0 !w-8 !h-8 items-center justify-center',
                                isNoNeedNavigation ? 'hidden' : 'flex'
                            )}>
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <ChevronLeft size={14} />
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setIsNavigationOpen(true)}
                            className={cn(
                                '!rounded-[4px] text-center !p-0 !w-8 !h-8 items-center justify-center',
                                isNoNeedNavigation ? 'hidden' : 'flex'
                            )}>
                            <SquareSettings size={14} />
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleNextProblem}
                            disabled={!problem?.next_problem_id || isLoading}
                            className={cn(
                                'text-center !p-0 !w-8 !h-8 items-center justify-center',
                                isNoNeedNavigation ? 'hidden' : 'flex'
                            )}>
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <ChevronRight size={14} />
                            )}
                        </Button>
                    </div>
                    <Button
                        onClick={saveAnswer}
                        variant="primary"
                        size="normal"
                        disabled={isDisabled}
                        className="w-full">
                        Selanjutnya
                    </Button>
                </div>
            )}

            <QuizNavigationBottomSheet
                onProblemSelect={handleProblemSelect}
                isOpen={isNavigationOpen}
                onClose={() => setIsNavigationOpen(false)}
                saveAnswer={handleSaveAnswerWithNavigation}
            />
        </>
    );
};

export default ExerciseQuestionFooter;
