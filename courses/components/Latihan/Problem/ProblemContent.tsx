import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    useGetOrCreateExerciseProblemProgressQuery,
    useGetExerciseProblemQuery,
    useGetExerciseProgressQuery,
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
    const [showExplanation, setShowExplanation] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

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

    useEffect(() => {
        setSelectedAnswers([]);
        setOpenEndedAnswer('');
        setShowExplanation(false);
        setIsSubmitted(false);
    }, [problemId]);

    useEffect(() => {
        if (problemProgress) {
            const hasAnswer =
                problem?.question.type === 'MULTIPLE_CHOICE'
                    ? problemProgress.submitted_answer_ids &&
                      problemProgress.submitted_answer_ids.length > 0
                    : !!problemProgress.submitted_answer_text;

            setIsSubmitted(problemProgress.status === 'COMPLETED' || hasAnswer);

            if (
                problem?.question.type === 'MULTIPLE_CHOICE' &&
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

    const handleAnswerChange = (newAnswer: string | string[]) => {
        if (problem?.question.type === 'MULTIPLE_CHOICE') {
            setSelectedAnswers(newAnswer as string[]);
        } else {
            setOpenEndedAnswer(newAnswer as string);
        }
    };

    const handleSubmit = async () => {
        if (!problemProgress || !problem || isSubmitting) return;

        setIsSubmitting(true);

        const submissionData = {
            submitted_answer_ids:
                problem.question.type === 'MULTIPLE_CHOICE'
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

            if (!problem.next_navigation && exerciseProgress) {
                await updateExerciseProgress({
                    exercise_slug: slug,
                    progress_id: exerciseProgress.id,
                    data: {
                        status: 'COMPLETED',
                        completed_at: new Date().toISOString()
                    }
                }).unwrap();
            }
        } catch (error) {
            console.error('Failed to update problem progress:', error);
        } finally {
            setIsSubmitting(false);
        }
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
        problem?.question.type === 'MULTIPLE_CHOICE'
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
                            {problem.question.type === 'MULTIPLE_CHOICE' &&
                                !problem.single_answer && (
                                    <p className="text-[#FEC84B] text-xs font-normal">
                                        Jawaban bisa lebih dari 1
                                    </p>
                                )}
                        </div>
                        {problem.question.type === 'MULTIPLE_CHOICE' ? (
                            <MultipleChoiceProblem
                                options={problem.question.options}
                                selectedAnswers={selectedAnswers}
                                onAnswerSelect={handleAnswerChange}
                                isSubmitted={isSubmitted}
                            />
                        ) : (
                            <OpenEndedProblem
                                answer={openEndedAnswer}
                                onAnswerChange={handleAnswerChange}
                                isSubmitted={isSubmitted}
                                isCorrect={isCorrect}
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
