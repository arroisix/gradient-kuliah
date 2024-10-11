import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
    useGetOrCreateExerciseProblemProgressQuery,
    useGetExerciseProblemQuery,
    useGetExerciseProgressQuery,
    useUpdateExerciseProblemProgressMutation,
    useGetExerciseReportQuery,
    useGetExerciseProblemSolutionQuery
} from '../../../redux/api/exercisesApi';
import MultipleChoiceProblem from './MultipleChoiceProblem';
import OpenEndedProblem from './OpenEndedProblem';
import Skeleton from 'commons/components/elements/Skeleton';
import TiptapViewer from '../../Textbook/TiptapViewer';
import ExerciseFinishModal from '../ExerciseFinishModal';

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

        const [updateProblemProgress] =
            useUpdateExerciseProblemProgressMutation();

        const { data: exerciseReport, refetch: refetchExerciseReport } =
            useGetExerciseReportQuery(
                {
                    exercise_slug: slug,
                    exercise_progress_id: exerciseProgress?.id ?? ''
                },
                { skip: !exerciseProgress?.id }
            );

        const { data: solution, isFetching: isFetchingSolution } =
            useGetExerciseProblemSolutionQuery(
                { exercise_slug: slug, problem_id: problemId },
                { skip: !isSubmitted || showSolution === 'NONE' }
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
            },
            [isSubmitted, showSolution, problem]
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

            try {
                const updatePromise = updateProblemProgress({
                    exercise_slug: slug,
                    exercise_progress_id: exerciseProgress!.id,
                    problem_id: problem.id,
                    problem_progress_id: problemProgress.id,
                    data: submissionData
                }).unwrap();

                const reportPromise = refetchExerciseReport();

                await Promise.all([updatePromise, reportPromise]);
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
            refetchExerciseReport
        ]);

        const handleFinishExercise = useCallback(async () => {
            setIsLoadingFinish(true);
            try {
                await refetchExerciseReport();
                setIsFinishModalOpen(true);
            } finally {
                setIsLoadingFinish(false);
            }
        }, [refetchExerciseReport]);

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

        if (
            !problem ||
            !exerciseProgress ||
            !problemProgress ||
            !exerciseReport
        ) {
            return (
                <div>
                    Problem, exercise progress, problem progress, or exercise
                    report not found
                </div>
            );
        }

        return (
            <div className="flex flex-col h-full">
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
                    {isSubmitted && showSolution !== 'NONE' && (
                        <button
                            className="w-full py-3 rounded-full font-semibold bg-[#4B5563] text-white hover:bg-[#374151] transition-colors"
                            onClick={() =>
                                setShowExplanation(!showExplanation)
                            }>
                            {showExplanation
                                ? 'Lihat Soal'
                                : 'Lihat Pembahasan'}
                        </button>
                    )}
                    {isSubmitted &&
                        problem.next_navigation &&
                        !isAnswerChanged && (
                            <Link
                                href={
                                    problem.next_navigation.type === 'problem'
                                        ? `/latihan/${slug}/${sectionId}/${problem.next_navigation.id}`
                                        : `/latihan/${slug}/${problem.next_navigation.id}`
                                }
                                passHref>
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
                    allProblemsAnswered={exerciseReport.all_problems_answered}
                    slug={slug}
                    exerciseProgressId={exerciseProgress.id}
                />
            </div>
        );
    }
);

ProblemContent.displayName = 'ProblemContent';

export default ProblemContent;
