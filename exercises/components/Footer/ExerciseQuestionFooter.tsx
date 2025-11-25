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
    const { setShowSolution, showSolution } = useExercise();
    const isNoNeedNavigation = useMemo(() => {
        return (
            problem?.time_constraint === 'PER_PROBLEM' ||
            problem?.show_solution === 'AFTER_PROBLEM'
        );
    }, [problem]);

    const handleProblemSelect = (selectedProblemId: string) => {
        router.push(
            `/latihan/${slug}/${sectionId}/${selectedProblemId}${
                solution ? '?solution=1' : ''
            }`,
            undefined,
            { scroll: false, shallow: true }
        );
    };

    const handleNextProblem = () => {
        if (problem?.next_problem_id) {
            router.push(
                `/latihan/${slug}/${sectionId}/${problem.next_problem_id}${
                    solution ? '?solution=1' : ''
                }`,
                undefined,
                { scroll: false, shallow: true }
            );
        }
    };

    const handlePreviousProblem = () => {
        if (problem?.previous_problem_id) {
            router.push(
                `/latihan/${slug}/${sectionId}/${problem.previous_problem_id}${
                    solution ? '?solution=1' : ''
                }`,
                undefined,
                { scroll: false, shallow: true }
            );
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
                            disabled={!problem?.previous_problem_id}
                            className={cn(
                                'text-center !p-0 !w-8 !h-8 items-center justify-center',
                                isNoNeedNavigation ? 'hidden' : 'flex'
                            )}>
                            <ChevronLeft size={14} />
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
                            disabled={!problem?.next_problem_id}
                            className={cn(
                                'text-center !p-0 !w-8 !h-8 items-center justify-center',
                                isNoNeedNavigation ? 'hidden' : 'flex'
                            )}>
                            <ChevronRight size={14} />
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
            />
        </>
    );
};

export default ExerciseQuestionFooter;
