import Button from 'commons/components/elements/Button';
import ThumbsUp from 'commons/components/elements/Icons/ThumbsUp';
import { cn } from 'commons/utils';
import {
    useGetProblemInProblemSetQuery,
    useGetProblemSolutionQuery
} from 'exercises/redux/api/exercisesApi';
import { ChevronLeft, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { FaExclamation } from 'react-icons/fa6';

const AnswerInformation = ({
    showSolution,
    setShowSolution
}: {
    showSolution: boolean;
    setShowSolution: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const router = useRouter();
    const { slug, sectionId, problemId, solution } = router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: sectionId as string,
            problemId: problemId as string
        },
        { skip: !slug || !sectionId || !problemId }
    );
    const { data: solutionData } = useGetProblemSolutionQuery(
        {
            slug: slug as string,
            problem_progress_id: problem?.problem_progress?.id as string
        },
        { skip: !slug || !solution || !problem?.problem_progress?.id }
    );

    const decideCopy = () => {
        // if all correct answers are selected by users
        // check all user answers are in correct answers
        if (problem?.problem.type !== 'SHORT_ANSWER') {
            const correctAnswerIds = solutionData?.correct_answer_ids || [];
            const userAnswerIds =
                problem?.problem_progress?.submitted_answer_ids || [];

            const allCorrect = correctAnswerIds.every((id) =>
                userAnswerIds.includes(id)
            );
            const noIncorrect = userAnswerIds.every((id) =>
                correctAnswerIds.includes(id)
            );

            if (allCorrect && noIncorrect) {
                return 'Sempurna! Semua jawaban kamu benar.';
            }

            // if partial correct answers are selected by users
            if (userAnswerIds.some((id) => correctAnswerIds.includes(id))) {
                return 'Ada jawaban yang salah.';
            }

            return 'Semua Jawaban kamu salah';
        } else {
            const correctAnswersText =
                solutionData?.correct_answer_text?.map((ans) =>
                    ans.toLowerCase().trim()
                ) || [];
            const userAnswerText =
                solutionData?.user_answer_text.toLowerCase().trim() || '';

            if (correctAnswersText.includes(userAnswerText)) {
                return 'Sempurna! Jawaban kamu benar.';
            } else {
                return 'Jawaban kamu salah.';
            }
        }
    };

    const decideIcon = () => {
        // if all correct answers are selected by users
        // check all user answers are in correct answers
        if (problem?.problem.type !== 'SHORT_ANSWER') {
            const correctAnswerIds = solutionData?.correct_answer_ids || [];
            const userAnswerIds =
                problem?.problem_progress?.submitted_answer_ids || [];

            const allCorrect = correctAnswerIds.every((id) =>
                userAnswerIds.includes(id)
            );
            const noIncorrect = userAnswerIds.every((id) =>
                correctAnswerIds.includes(id)
            );

            if (allCorrect && noIncorrect) {
                return <ThumbsUp />;
            }

            // if partial correct answers are selected by users
            if (userAnswerIds.some((id) => correctAnswerIds.includes(id))) {
                return (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-accent-yellow">
                        <FaExclamation size={12} className="text-violet-3" />
                    </div>
                );
            }

            return (
                <div
                    className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center',
                        'bg-[#FF383C]'
                    )}>
                    <X size={20} className="text-violet-3" />
                </div>
            );
        } else {
            const correctAnswersText =
                solutionData?.correct_answer_text?.map((ans) =>
                    ans.toLowerCase().trim()
                ) || [];
            const userAnswerText =
                solutionData?.user_answer_text?.toLowerCase().trim() || '';

            if (correctAnswersText.includes(userAnswerText)) {
                return <ThumbsUp />;
            } else {
                return (
                    <div
                        className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center',
                            'bg-[#FF383C]'
                        )}>
                        <X size={20} className="text-violet-3" />
                    </div>
                );
            }
        }
    };

    if (showSolution) {
        return (
            <div className="w-full bg-violet-1/50 rounded-lg lg:rounded-none lg:absolute top-0 left-0 flex items-center gap-4 text-white text-xs p-4">
                <Button
                    variant="primary"
                    onClick={() => setShowSolution(false)}
                    className={cn(
                        'text-center !p-0 !w-8 !h-8 items-center justify-center',
                        problem?.time_constraint === 'PER_PROBLEM'
                            ? 'hidden'
                            : 'flex'
                    )}>
                    <ChevronLeft size={14} />
                </Button>
                <span className="font-semibold text-white text-base">
                    Pembahasan
                </span>
            </div>
        );
    }

    return (
        <div className="w-full bg-violet-3 h-12 rounded-lg lg:rounded-none lg:absolute top-0 left-0 flex items-center justify-center gap-2 text-white text-xs">
            {decideIcon()}
            {decideCopy()}
        </div>
    );
};

export default AnswerInformation;
