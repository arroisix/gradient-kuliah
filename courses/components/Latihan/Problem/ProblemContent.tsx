import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    useCreateExerciseProblemProgressMutation,
    useGetExerciseProblemQuery,
    useGetExerciseProgressQuery,
    useGetLatestExerciseProblemProgressQuery,
    useUpdateExerciseProblemProgressMutation,
    useUpdateExerciseProgressMutation
} from '../../../redux/api/exercisesApi';
import MultipleChoiceProblem from './MultipleChoiceProblem';
import OpenEndedProblem from './OpenEndedProblem';
import Skeleton from 'commons/components/elements/Skeleton';

interface ProblemContentProps {
    problemId: string;
    slug: string;
    sectionId: string;
}

const ProblemContent: React.FC<ProblemContentProps> = ({
    slug,
    problemId,
    sectionId
}) => {
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [openEndedAnswer, setOpenEndedAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [localProblemProgress, setLocalProblemProgress] = useState<any>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [initializationError, setInitializationError] = useState<
        string | null
    >(null);
    const hasAttemptedInitialization = useRef(false);

    const { data: problem, isLoading: isProblemLoading } =
        useGetExerciseProblemQuery(
            { exercise_slug: slug, problem_id: problemId },
            { skip: !slug || !problemId }
        );

    const { data: exerciseProgress, isLoading: isProgressLoading } =
        useGetExerciseProgressQuery({ exercise_slug: slug }, { skip: !slug });

    const {
        data: problemProgress,
        isLoading: isProblemProgressLoading,
        refetch: refetchProblemProgress
    } = useGetLatestExerciseProblemProgressQuery(
        { problem_progress_id: exerciseProgress?.last_problem_id ?? '' },
        { skip: !exerciseProgress?.id || !exerciseProgress?.last_problem_id }
    );

    const [createProblemProgress] = useCreateExerciseProblemProgressMutation();
    const [updateProblemProgress] = useUpdateExerciseProblemProgressMutation();
    const [updateExerciseProgress] = useUpdateExerciseProgressMutation();

    useEffect(() => {
        setIsSubmitted(false);
        setSelectedAnswers([]);
        setOpenEndedAnswer('');
        hasAttemptedInitialization.current = false;
        setIsInitializing(true);
        setInitializationError(null);
    }, [problemId]);

    useEffect(() => {
        const initializeProblemProgress = async () => {
            if (
                hasAttemptedInitialization.current ||
                !exerciseProgress ||
                !problem
            ) {
                return;
            }

            hasAttemptedInitialization.current = true;

            if (problemProgress && problemProgress.problem_id === problem.id) {
                setLocalProblemProgress(problemProgress);
                if (problemProgress.status === 'COMPLETED') {
                    setIsSubmitted(true);
                }
            } else {
                try {
                    const result = await createProblemProgress({
                        exercise_slug: slug,
                        exercise_progress_id: exerciseProgress.id,
                        problem_id: problem.id
                    }).unwrap();
                    setLocalProblemProgress(result);
                } catch (error) {
                    console.error('Failed to create problem progress:', error);
                    setInitializationError(
                        'Failed to initialize problem. Please try refreshing the page.'
                    );
                }
            }
            setIsInitializing(false);
        };

        initializeProblemProgress();
    }, [
        exerciseProgress,
        problem,
        problemProgress,
        slug,
        createProblemProgress
    ]);

    const handleSubmit = async () => {
        console.log('Submit button clicked');
        if (!localProblemProgress || !problem || isSubmitting || isSubmitted) {
            console.log('Submission prevented. Reason:', {
                noProblemProgress: !localProblemProgress,
                noProblem: !problem,
                isSubmitting,
                alreadySubmitted: isSubmitted
            });
            return;
        }

        setIsSubmitting(true);
        console.log('Setting isSubmitting to true');

        const now = new Date().toISOString();
        const submissionData: any = {
            status: 'COMPLETED',
            completed_at: now
        };

        if (problem.question.type === 'MULTIPLE_CHOICE') {
            submissionData.submitted_answer_id = selectedAnswers.join(',');
        } else {
            submissionData.submitted_answer_text = openEndedAnswer;
        }

        console.log('Submission data:', submissionData);

        try {
            console.log('Updating problem progress');
            const result = await updateProblemProgress({
                exercise_slug: slug,
                exercise_progress_id: exerciseProgress!.id,
                problem_id: problem.id,
                problem_progress_id: localProblemProgress.id,
                data: submissionData
            }).unwrap();
            console.log('Problem progress updated successfully:', result);
            setLocalProblemProgress(result);
            setIsSubmitted(true);
            if (!problem?.next_navigation && exerciseProgress) {
                console.log('Updating exercise progress to COMPLETED');
                try {
                    const exerciseResult = await updateExerciseProgress({
                        exercise_slug: slug,
                        progress_id: exerciseProgress.id,
                        data: {
                            status: 'COMPLETED',
                            completed_at: new Date().toISOString()
                        }
                    }).unwrap();
                    console.log(
                        'Exercise progress updated successfully:',
                        exerciseResult
                    );
                } catch (error) {
                    console.error('Failed to update exercise progress:', error);
                }
            } else {
                console.log(
                    'Not the final problem or exercise progress not available'
                );
            }
            await refetchProblemProgress();
        } catch (error) {
            console.error('Failed to update problem progress:', error);
        } finally {
            setIsSubmitting(false);
            console.log('Setting isSubmitting to false');
        }
    };

    if (
        isInitializing ||
        isProblemLoading ||
        isProgressLoading ||
        (isProblemProgressLoading && !localProblemProgress)
    ) {
        return <Skeleton className="w-full h-full" />;
    }

    if (initializationError) {
        return <div className="text-red-500">{initializationError}</div>;
    }

    if (!problem || !exerciseProgress) {
        return <div>Problem or exercise progress not found</div>;
    }

    const isAnswerProvided =
        problem.question.type === 'MULTIPLE_CHOICE'
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
                                <p className="text-white font-medium text-base">
                                    {problem.question.text}
                                </p>
                            </div>
                            {problem.question.type === 'MULTIPLE_CHOICE' && (
                                <p className="text-[#FEC84B] text-xs font-normal">
                                    Jawaban bisa lebih dari 1
                                </p>
                            )}
                        </div>
                        {problem.question.type === 'MULTIPLE_CHOICE' ? (
                            <MultipleChoiceProblem
                                options={problem.question.options}
                                selectedAnswers={selectedAnswers}
                                onAnswerSelect={setSelectedAnswers}
                                isSubmitted={isSubmitted}
                            />
                        ) : (
                            <OpenEndedProblem
                                answer={openEndedAnswer}
                                onAnswerChange={setOpenEndedAnswer}
                            />
                        )}
                    </>
                ) : (
                    <div className="flex flex-col gap-3">
                        <h3 className="text-white text-sm font-normal mb-2">
                            Pembahasan
                        </h3>
                        <p className="text-white font-semibold text-base">
                            {problem.question.explanation}
                        </p>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-3">
                {!isSubmitted ? (
                    <button
                        className={`w-full py-3 rounded-full font-semibold transition-colors ${
                            isAnswerProvided
                                ? 'bg-[#7F56D9] text-white hover:bg-[#6941C6]'
                                : 'bg-gray-400 text-white cursor-not-allowed'
                        }`}
                        onClick={handleSubmit}
                        disabled={!isAnswerProvided || isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                ) : (
                    <button
                        className="w-full py-3 rounded-full font-semibold bg-[#4B5563] text-white hover:bg-[#374151] transition-colors"
                        onClick={() => setShowExplanation(!showExplanation)}>
                        {showExplanation ? 'Lihat Soal' : 'Lihat Pembahasan'}
                    </button>
                )}
                {isSubmitted && (
                    <Link
                        href={
                            problem.next_navigation
                                ? problem.next_navigation.type === 'problem'
                                    ? `/latihan/${slug}/${sectionId}/${problem.next_navigation.id}`
                                    : `/latihan/${slug}/${problem.next_navigation.id}`
                                : `/latihan/${slug}/report`
                        }
                        passHref>
                        <button className="w-full py-3 rounded-full font-semibold bg-[#7F56D9] text-white hover:bg-[#6941C6] transition-colors">
                            {problem.next_navigation
                                ? 'Selanjutnya'
                                : 'Lihat Laporan'}
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ProblemContent;
