import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
    useGetOrCreateExerciseProblemProgressQuery,
    useGetExerciseProblemQuery,
    useGetExerciseProgressQuery,
    useUpdateExerciseProblemProgressMutation,
    useGetExerciseProblemSolutionQuery
} from 'exercises/redux/api/exercisesApi';
import MultipleChoiceProblem from './MultipleChoiceProblem';
import OpenEndedProblem from './OpenEndedProblem';
import Skeleton from 'commons/components/elements/Skeleton';
import TiptapViewer from '../../../courses/components/Textbook/TiptapViewer';
import ExerciseFinishModal from '../Modal/ExerciseFinishModal';
import { useTracker } from 'tracker/tracker';

interface ProblemContentProps {
    problemId: string;
    slug: string;
    sectionId: string;
    showSolution: string;
    timeConstraint: string;
    timeLimit: number;
    onTimeExpired: () => void;
    onSubmit: () => void;
}

const ProblemContent: React.FC<ProblemContentProps> = React.memo(
    ({ slug, problemId, sectionId, showSolution, onSubmit }) => {
        const tracker = useTracker();

        const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
        const [openEndedAnswer, setOpenEndedAnswer] = useState('');
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [isSubmitted, setIsSubmitted] = useState(false);
        const [showExplanation, setShowExplanation] = useState(false);
        const [isCorrect, setIsCorrect] = useState(false);
        const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
        const [isAnswerChanged, setIsAnswerChanged] = useState(false);
        const [isLoadingFinish, setIsLoadingFinish] = useState(false);

        const { data: problem, isLoading: isProblemLoading } =
            useGetExerciseProblemQuery(
                { exercise_slug: slug, problem_id: problemId },
                { skip: !slug || !problemId }
            );

        const {
            data: exerciseProgress,
            isLoading: isProgressLoading,
            refetch: refetchExerciseProgress
        } = useGetExerciseProgressQuery({ exercise_slug: slug });

        const {
            data: problemProgress,
            isLoading: isProblemProgressLoading,
            refetch: refetchProblemProgress
        } = useGetOrCreateExerciseProblemProgressQuery(
            {
                exercise_slug: slug,
                exercise_progress_id: exerciseProgress?.id ?? '',
                problem_id: problemId
            },
            {
                skip: !exerciseProgress?.id
                // refetchOnMountOrArgChange: true
            }
        );

        const [updateProblemProgress] =
            useUpdateExerciseProblemProgressMutation();

        const { data: solution, isFetching: isFetchingSolution } =
            useGetExerciseProblemSolutionQuery(
                { exercise_slug: slug, problem_id: problemId },
                { skip: !isSubmitted || showSolution !== 'AFTER_PROBLEM' }
            );

        useEffect(() => {
            setSelectedAnswers([]);
            setOpenEndedAnswer('');
            setShowExplanation(false);
            setIsSubmitted(false);
        }, [problemId]);

        useEffect(() => {
            if (sectionId) {
                refetchExerciseProgress();
            }
        }, [sectionId, refetchExerciseProgress]);

        useEffect(() => {
            if (problemProgress && problem) {
                const hasAnswer =
                    problem.question.type === 'MULTIPLE_CHOICE' ||
                    problem.question.type === 'MULTIPLE_ANSWER'
                        ? problemProgress.submitted_answer_ids &&
                          problemProgress.submitted_answer_ids.length > 0
                        : !!problemProgress.submitted_answer_text;

                setIsSubmitted(
                    problemProgress.status === 'COMPLETED' || hasAnswer
                );

                if (
                    (problem.question.type === 'MULTIPLE_CHOICE' ||
                        problem.question.type === 'MULTIPLE_ANSWER') &&
                    problemProgress.submitted_answer_ids
                ) {
                    setSelectedAnswers(problemProgress.submitted_answer_ids);
                } else if (
                    problem.question.type !== 'MULTIPLE_CHOICE' &&
                    problemProgress.submitted_answer_text
                ) {
                    setOpenEndedAnswer(problemProgress.submitted_answer_text);
                    setIsCorrect(problemProgress.is_correct ?? false);
                }
            }
        }, [problemProgress, problem]);

        const handleAnswerChange = useCallback(
            (newAnswer: string | string[]) => {
                if (isSubmitted && showSolution !== 'AFTER_COMPLETE') return;

                if (
                    problem?.question.type === 'MULTIPLE_CHOICE' ||
                    problem?.question.type === 'MULTIPLE_ANSWER'
                ) {
                    setSelectedAnswers(newAnswer as string[]);
                } else {
                    setOpenEndedAnswer(newAnswer as string);
                }

                if (isSubmitted) {
                    setIsAnswerChanged(true);
                }
                tracker?.genericTrack('Click Question Answer Choice', {
                    EXERCISE_SLUG: slug,
                    SECTION_SLUG: sectionId,
                    PROBLEM_ID: problemId,
                    ANSWER_ID: Array.isArray(newAnswer)
                        ? newAnswer.join(',')
                        : newAnswer,
                    PROBLEM_TYPE: problem?.question.type
                });
            },
            [isSubmitted, showSolution, problem, tracker]
        );

        const handleSubmit = useCallback(async () => {
            if (!problemProgress || !problem || isSubmitting) return;

            setIsSubmitting(true);

            const submissionData = {
                submitted_answer_ids:
                    problem?.question.type === 'MULTIPLE_CHOICE' ||
                    problem?.question.type === 'MULTIPLE_ANSWER'
                        ? selectedAnswers
                        : undefined,
                submitted_answer_text:
                    problem.question.type !== 'MULTIPLE_CHOICE'
                        ? openEndedAnswer
                        : undefined
            };

            setIsSubmitted(true);
            setIsAnswerChanged(false);
            onSubmit();

            tracker?.genericTrack('Submit User Answer', {
                EXERCISE_SLUG: slug,
                SECTION_SLUG: sectionId,
                PROBLEM_ID: problemId,
                ANSWER_IDS: Array.isArray(selectedAnswers)
                    ? selectedAnswers.join(',')
                    : openEndedAnswer,
                PROBLEM_TYPE: problem?.question.type
            });

            try {
                await updateProblemProgress({
                    exercise_slug: slug,
                    exercise_progress_id: exerciseProgress!.id,
                    problem_id: problem.id,
                    problem_progress_id: problemProgress.id,
                    data: submissionData
                });
            } catch (error) {
                console.error('Failed to update problem progress:', error);
                setIsSubmitted(false);
                setIsAnswerChanged(true);
            } finally {
                setIsSubmitting(false);
            }
        }, [
            problem,
            problemProgress,
            isSubmitting,
            selectedAnswers,
            openEndedAnswer,
            slug,
            exerciseProgress,
            updateProblemProgress,
            onSubmit,
            tracker
        ]);

        const handleNextQuestion = () => {
            tracker?.genericTrack('Click Selanjutnya Button', {
                EXERCISE_SLUG: slug,
                SECTION_SLUG: sectionId,
                PROBLEM_ID: problemId
            });
        };

        const toggleExplanation = () => {
            const eventName = showExplanation
                ? 'Click Lihat Soal'
                : 'Click Lihat Pembahasan';
            tracker?.genericTrack(eventName, {
                EXERCISE_SLUG: slug,
                SECTION_SLUG: sectionId,
                PROBLEM_ID: problemId
            });
            setShowExplanation(!showExplanation);
        };

        const handleFinishExercise = useCallback(async () => {
            tracker?.genericTrack('Click Finish Latihan', {
                EXERCISE_SLUG: slug
            });
            setIsLoadingFinish(true);

            await refetchProblemProgress();
            setIsFinishModalOpen(true);
            setIsLoadingFinish(false);
        }, [slug, tracker]);

        const handleConfirmFinish = useCallback(() => {
            setIsFinishModalOpen(false);
        }, []);

        const isLoading =
            isProblemLoading || isProgressLoading || isProblemProgressLoading;

        const isAnswerProvided = useMemo(() => {
            if (!problem) return false;
            return problem.question.type === 'MULTIPLE_CHOICE' ||
                problem.question.type === 'MULTIPLE_ANSWER'
                ? selectedAnswers.length > 0
                : openEndedAnswer.trim() !== '';
        }, [problem, selectedAnswers, openEndedAnswer]);

        if (isLoading) {
            return <Skeleton className="w-full h-full" />;
        }

        if (!problem || !exerciseProgress || !problemProgress) {
            return (
                <div>
                    Problem, exercise progress, problem progress, or exercise
                    report not found
                </div>
            );
        }

        return (
            <div className="flex flex-col h-full" key={problem.id}>
                <div className="flex-grow overflow-y-auto">
                    {!showExplanation ? (
                        <div className="flex flex-col space-y-6">
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col space-y-2">
                                    <h3 className="text-white text-sm font-normal">
                                        Nomor {problem.current_problem_number}
                                    </h3>
                                    <TiptapViewer
                                        content={problem.question.question}
                                    />
                                </div>
                                {problem.question.type === 'MULTIPLE_ANSWER' &&
                                    !problem.single_answer && (
                                        <p className="text-[#FEC84B] text-xs font-normal">
                                            Jawaban bisa lebih dari 1
                                        </p>
                                    )}
                            </div>
                            {problem?.question.type === 'MULTIPLE_CHOICE' ||
                            problem?.question.type === 'MULTIPLE_ANSWER' ? (
                                <MultipleChoiceProblem
                                    options={problem.question.options}
                                    selectedAnswers={selectedAnswers}
                                    onAnswerSelect={handleAnswerChange}
                                    isSubmitted={isSubmitted}
                                    isSingleAnswer={problem.single_answer}
                                    showSolution={showSolution}
                                    solution={solution}
                                />
                            ) : (
                                <OpenEndedProblem
                                    answer={openEndedAnswer}
                                    onAnswerChange={handleAnswerChange}
                                    isSubmitted={isSubmitted}
                                    isCorrect={isCorrect}
                                    showSolution={showSolution}
                                    solution={solution}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-3">
                            <h3 className="text-white text-sm font-normal">
                                Pembahasan
                            </h3>
                            <div className="overflow-y-auto">
                                {isFetchingSolution ? (
                                    <p>Loading solution...</p>
                                ) : solution ? (
                                    <TiptapViewer content={solution.solution} />
                                ) : (
                                    <p>Solution not available</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-3 mt-4">
                    {(!isSubmitted ||
                        (showSolution === 'AFTER_COMPLETE' &&
                            isAnswerChanged)) && (
                        <button
                            className={`w-full py-3 rounded-full font-semibold transition-colors ${
                                isAnswerProvided
                                    ? 'bg-[#7F56D9] text-white hover:bg-[#6941C6]'
                                    : 'bg-gray-400 text-white cursor-not-allowed'
                            } flex items-center justify-center`}
                            onClick={handleSubmit}
                            disabled={!isAnswerProvided || isSubmitting}>
                            {isSubmitting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : isAnswerChanged ? (
                                'Resubmit'
                            ) : (
                                'Submit'
                            )}
                        </button>
                    )}
                    {isSubmitted && showSolution === 'AFTER_PROBLEM' && (
                        <button
                            className="w-full py-3 rounded-full font-semibold bg-[#4B5563] text-white hover:bg-[#374151] transition-colors"
                            onClick={toggleExplanation}>
                            {showExplanation
                                ? 'Lihat Soal'
                                : 'Lihat Pembahasan'}
                        </button>
                    )}
                    {isSubmitted &&
                        problem.next_navigation &&
                        !isAnswerChanged && (
                            <Link
                                replace
                                href={
                                    problem.next_navigation.type === 'problem'
                                        ? `/exercises/${slug}/${sectionId}/${problem.next_navigation.id}`
                                        : `/exercises/${slug}/${problem.next_navigation.id}`
                                }
                                passHref
                                onClick={handleNextQuestion}>
                                <button className="w-full py-3 rounded-full font-semibold bg-[#7F56D9] text-white hover:bg-[#6941C6] transition-colors">
                                    Selanjutnya
                                </button>
                            </Link>
                        )}
                    {isSubmitted &&
                        !problem.next_navigation &&
                        !isAnswerChanged && (
                            <button
                                className="w-full py-3 rounded-full font-semibold bg-[#7F56D9] text-white hover:bg-[#6941C6] transition-colors flex items-center justify-center"
                                onClick={handleFinishExercise}
                                disabled={isLoadingFinish}>
                                {isLoadingFinish ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    'Selesaikan Latihan'
                                )}
                            </button>
                        )}
                </div>
                <ExerciseFinishModal
                    isOpen={isFinishModalOpen}
                    onClose={() => setIsFinishModalOpen(false)}
                    onConfirm={handleConfirmFinish}
                    onReturnToExercise={() => setIsFinishModalOpen(false)}
                    allProblemsAnswered={problemProgress.all_problems_answered}
                    slug={slug}
                    exerciseProgressId={exerciseProgress.id}
                />
            </div>
        );
    }
);

ProblemContent.displayName = 'ProblemContent';

export default ProblemContent;
