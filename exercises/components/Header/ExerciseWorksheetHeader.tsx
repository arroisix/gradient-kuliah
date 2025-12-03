import Button from 'commons/components/elements/Button';
import SquareSettings from 'commons/components/elements/Icons/SquareSettings';
import { ChevronLeft, ChevronRight, XIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import Timer from '../ExerciseUtils/Timer';
import {
    useGetAllProblemInProblemSetQuery,
    useGetProblemInProblemSetQuery
} from 'exercises/redux/api/exercisesApi';
import { cn } from 'commons/utils';
import { useState, useRef, useMemo } from 'react';
import QuizNavigationDropdown from '../ExerciseUtils/QuizNavigationDropdown';
import ExerciseCloseModal from '../Modal/ExerciseCloseModal';
import useSubmitAnswerHandler from 'exercises/hooks/useSubmitAnswerHandler';
import ExerciseFinishModal from '../Modal/ExerciseFinishModal';
import { useExercise } from 'exercises/contexts/ExerciseProvider';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { BsArrowLeft } from 'react-icons/bs';

const ExerciseWorksheetHeader = () => {
    const router = useRouter();
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
    const { data: firstProblem } = useGetAllProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetProgressId: problem?.id as string,
            page: 1,
            limit: 1
        },
        { skip: !slug || !sectionId || !problem }
    );
    const {
        showSolution,
        setShowSolution,
        selectedAnswer,
        openEndedAnswer,
        isFinishModalOpen,
        setIsFinishModalOpen,
        isLoading
    } = useExercise();
    const { isMobileBreakpoints } = useWindowBreakpoints();

    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const settingsButtonRef = useRef<HTMLButtonElement>(null);
    const { finishProblemSet, saveAnswer } = useSubmitAnswerHandler(problem!);
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
                saveAnswer({ navigateDirection: 'next' });
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
                saveAnswer({ navigateDirection: 'prev' });
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

    // Helper function to compare arrays
    const arraysEqual = (a: string[], b: string[]): boolean => {
        if (a.length !== b.length) return false;
        return (
            a.every((item) => b.includes(item)) &&
            b.every((item) => a.includes(item))
        );
    };

    const handleConfirmClose = (): void => {
        setIsModalOpen(false);
        router.push(`/latihan/${slug}`);
    };

    const onTimeExpired = async () => {
        if (!solution) {
            // wait until firstProblem is loaded
            while (!firstProblem) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }

            alert('Waktu kamu habis!');
            await finishProblemSet();
        }
    };

    const onFinishProblemset = async () => {
        await finishProblemSet();
        setIsFinishModalOpen(false);
    };

    return (
        <header className="w-full flex items-center justify-between gap-4 relative min-h-[16px]">
            {isMobileBreakpoints && showSolution ? (
                <button
                    className="flex items-center gap-2 text-white cursor-pointer"
                    onClick={() => setShowSolution && setShowSolution(false)}>
                    <BsArrowLeft size={20} />
                    <span className="font-semibold">Pembahasan</span>
                </button>
            ) : (
                <XIcon
                    role="button"
                    tabIndex={0}
                    size={24}
                    className={cn(
                        'absolute lg:relative top-0 left-0 cursor-pointer'
                    )}
                    onClick={() => setIsModalOpen(true)}
                />
            )}
            {problem &&
                problem.time_constraint &&
                !solution &&
                firstProblem && (
                    <Timer
                        timeConstraint={problem.time_constraint ?? 'NONE'}
                        timeLimit={problem?.time_limit ?? 0}
                        currentProblemId={problem?.problem.id ?? ''}
                        firstProblemProgress={problem}
                        problemProgress={problem?.problem_progress}
                        onTimeExpired={onTimeExpired}
                        isCurrentProblemSubmitted={!!solution}
                    />
                )}
            <div
                className={cn(
                    'flex flex-row gap-2 items-center relative',
                    !(problem && problem.time_constraint) && 'mt-4 lg:mt-0'
                )}>
                <Button
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    ref={settingsButtonRef}
                    variant="secondary"
                    onClick={() => setIsNavigationOpen(!isNavigationOpen)}
                    className={cn(
                        '!rounded-[4px] text-center !p-0 !w-8 !h-8 items-center justify-center',
                        isNoNeedNavigation ? 'hidden' : 'hidden lg:flex',
                        isNavigationOpen && '!bg-purple-6'
                    )}>
                    <SquareSettings size={14} />
                </Button>

                <QuizNavigationDropdown
                    onProblemSelect={handleProblemSelect}
                    isOpen={isNavigationOpen}
                    onClose={() => setIsNavigationOpen(false)}
                    anchorEl={settingsButtonRef.current}
                    saveAnswer={saveAnswer}
                />

                <Button
                    variant="secondary"
                    disabled={!problem?.previous_problem_id || isLoading}
                    onClick={handlePreviousProblem}
                    className={cn(
                        'text-center !p-0 !w-8 !h-8 items-center justify-center',
                        isNoNeedNavigation ? 'hidden' : 'hidden lg:flex'
                    )}>
                    {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <ChevronLeft size={14} />
                    )}
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleNextProblem}
                    disabled={!problem?.next_problem_id || isLoading}
                    className={cn(
                        'text-center !p-0 !w-8 !h-8 items-center justify-center',
                        isNoNeedNavigation ? 'hidden' : 'hidden lg:flex'
                    )}>
                    {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <ChevronRight size={14} />
                    )}
                </Button>
            </div>
            <ExerciseCloseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmClose}
            />
            <ExerciseFinishModal
                isOpen={isFinishModalOpen}
                onClose={() => setIsFinishModalOpen(false)}
                onConfirm={onFinishProblemset}
            />
        </header>
    );
};

export default ExerciseWorksheetHeader;
