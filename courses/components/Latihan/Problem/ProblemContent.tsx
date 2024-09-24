import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    useGetOrCreateExerciseProblemProgressQuery,
    useGetExerciseProblemQuery,
    useGetExerciseProgressQuery,
    useUpdateExerciseProblemProgressMutation,
    useUpdateExerciseProgressMutation,
    useGetExerciseDetailQuery,
    useGetExerciseReportQuery
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
}

const ProblemContent: React.FC<ProblemContentProps> = ({
    slug,
    problemId,
    sectionId,
    showSolution,
    timeConstraint,
    timeLimit,
    onTimeExpired
}) => {
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [openEndedAnswer, setOpenEndedAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [allProblemsAnswered, setAllProblemsAnswered] = useState(false);
    const [isAnswerChanged, setIsAnswerChanged] = useState(false);

    const { data: problem, isLoading: isProblemLoading } =
        useGetExerciseProblemQuery(
            { exercise_slug: slug, problem_id: problemId },
            { skip: !slug || !problemId }
        );

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

    const [updateProblemProgress] = useUpdateExerciseProblemProgressMutation();
    const [updateExerciseProgress] = useUpdateExerciseProgressMutation();

    const { data: exerciseDetail } = useGetExerciseDetailQuery({
        exercise_slug: slug
    });
    const { data: exerciseReport, refetch: refetchExerciseReport } =
        useGetExerciseReportQuery(
            {
                exercise_slug: slug,
                exercise_progress_id: exerciseProgress?.id ?? ''
            },
            { skip: !exerciseProgress?.id }
        );

    useEffect(() => {
        setSelectedAnswers([]);
        setOpenEndedAnswer('');
        setShowExplanation(false);
        setIsSubmitted(false);
    }, [problemId]);

    useEffect(() => {
        if (problemProgress) {
            const hasAnswer =
                problem?.question.type === 'MULTIPLE_CHOICE' ||
                problem?.question.type === 'MULTIPLE_ANSWER'
                    ? problemProgress.submitted_answer_ids &&
                      problemProgress.submitted_answer_ids.length > 0
                    : !!problemProgress.submitted_answer_text;

            setIsSubmitted(problemProgress.status === 'COMPLETED' || hasAnswer);

            if (
                (problem?.question.type === 'MULTIPLE_CHOICE' ||
                    problem?.question.type === 'MULTIPLE_ANSWER') &&
                problemProgress.submitted_answer_ids
            ) {
                setSelectedAnswers(problemProgress.submitted_answer_ids);
            } else if (
                problem?.question.type !== 'MULTIPLE_CHOICE' &&
                problemProgress.submitted_answer_text
            ) {
                setOpenEndedAnswer(problemProgress.submitted_answer_text);
                setIsCorrect(problemProgress.is_correct ?? false);
            }
        }
    }, [problemProgress, problem]);

    const checkAllProblemsAnswered = useCallback(() => {
        if (exerciseDetail && exerciseReport) {
            const totalProblems = exerciseDetail.total_problems;
            const answeredProblems = exerciseReport.problems.length;
            setAllProblemsAnswered(totalProblems === answeredProblems);
        }
    }, [exerciseDetail, exerciseReport]);

    const handleAnswerChange = (newAnswer: string | string[]) => {
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
    };

    useEffect(() => {
        checkAllProblemsAnswered();
    }, [checkAllProblemsAnswered]);

    const handleSubmit = async () => {
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

        try {
            await updateProblemProgress({
                exercise_slug: slug,
                exercise_progress_id: exerciseProgress!.id,
                problem_id: problem.id,
                problem_progress_id: problemProgress.id,
                data: submissionData
            }).unwrap();

            setIsSubmitted(true);
            setIsAnswerChanged(false);

            await refetchExerciseReport();

            checkAllProblemsAnswered();
        } catch (error) {
            console.error('Failed to update problem progress:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTimeExpired = useCallback(async () => {
        if (timeConstraint === 'TOTAL_TIME') {
            await updateExerciseProgress({
                exercise_slug: slug,
                progress_id: exerciseProgress!.id,
                data: { status: 'COMPLETED' }
            }).unwrap();
        } else if (timeConstraint === 'PER_PROBLEM') {
            handleSubmit();
        }
        onTimeExpired();
    }, [
        timeConstraint,
        slug,
        exerciseProgress,
        updateExerciseProgress,
        handleSubmit,
        onTimeExpired
    ]);

    useEffect(() => {
        if (timeConstraint !== 'NONE' && timeLimit > 0) {
            const timer = setTimeout(handleTimeExpired, timeLimit * 1000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [timeConstraint, timeLimit, handleTimeExpired]);

    const handleFinishExercise = () => {
        setIsFinishModalOpen(true);
    };

    const handleConfirmFinish = () => {
        setIsFinishModalOpen(false);
    };

    if (isProblemLoading || isProgressLoading || isProblemProgressLoading) {
        return <Skeleton className="w-full h-full" />;
    }

    if (!problem || !exerciseProgress || !problemProgress) {
        return (
            <div>Problem, exercise progress, or problem progress not found</div>
        );
    }

    const isAnswerProvided =
        problem?.question.type === 'MULTIPLE_CHOICE' ||
        problem?.question.type === 'MULTIPLE_ANSWER'
            ? selectedAnswers.length > 0
            : openEndedAnswer.trim() !== '';

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col space-y-6">
                {!showExplanation ? (
                    <>
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-2">
                                <h3 className="text-white text-sm font-normal">
                                    Nomor {problem.current_problem_number}
                                </h3>
                                <TiptapViewer
                                    content={problem.question.question}
                                />
                            </div>
                            {problem.question.type === 'MULTIPLE_CHOICE' &&
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
                            />
                        ) : (
                            <OpenEndedProblem
                                answer={openEndedAnswer}
                                onAnswerChange={handleAnswerChange}
                                isSubmitted={isSubmitted}
                                isCorrect={isCorrect}
                                showSolution={showSolution}
                            />
                        )}
                    </>
                ) : (
                    <div className="flex flex-col gap-3">
                        <h3 className="text-white text-sm font-normal mb-2">
                            Pembahasan
                        </h3>
                        <TiptapViewer content={problem.question.solution} />
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-3">
                {(!isSubmitted ||
                    (showSolution === 'AFTER_COMPLETE' && isAnswerChanged)) && (
                    <button
                        className={`w-full py-3 rounded-full font-semibold transition-colors ${
                            isAnswerProvided
                                ? 'bg-[#7F56D9] text-white hover:bg-[#6941C6]'
                                : 'bg-gray-400 text-white cursor-not-allowed'
                        }`}
                        onClick={handleSubmit}
                        disabled={!isAnswerProvided || isSubmitting}>
                        {isSubmitting
                            ? 'Submitting...'
                            : isAnswerChanged
                            ? 'Resubmit'
                            : 'Submit'}
                    </button>
                )}
                {isSubmitted && showSolution === 'PER_PROBLEM' && (
                    <button
                        className="w-full py-3 rounded-full font-semibold bg-[#4B5563] text-white hover:bg-[#374151] transition-colors"
                        onClick={() => setShowExplanation(!showExplanation)}>
                        {showExplanation ? 'Lihat Soal' : 'Lihat Pembahasan'}
                    </button>
                )}
                {isSubmitted && problem.next_navigation && !isAnswerChanged && (
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
                            className="w-full py-3 rounded-full font-semibold bg-[#7F56D9] text-white hover:bg-[#6941C6] transition-colors"
                            onClick={handleFinishExercise}>
                            Selesaikan Latihan
                        </button>
                    )}
            </div>
            <ExerciseFinishModal
                isOpen={isFinishModalOpen}
                onClose={() => setIsFinishModalOpen(false)}
                onConfirm={handleConfirmFinish}
                onReturnToExercise={() => setIsFinishModalOpen(false)}
                allProblemsAnswered={allProblemsAnswered}
                slug={slug}
                exerciseProgressId={exerciseProgress.id}
            />
        </div>
    );
};

export default ProblemContent;
