import { cn } from 'commons/utils';
import TiptapViewer from 'courses/components/Textbook/TiptapViewer';
import {
    useGetProblemInProblemSetQuery,
    useGetProblemSolutionQuery
} from 'exercises/redux/api/exercisesApi';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FaExclamation } from 'react-icons/fa6';

const MultipleChoiceContainer = ({
    onAnswerClicked,
    selectedAnswer
}: {
    onAnswerClicked: (id: string) => void;
    selectedAnswer: string[];
}) => {
    const router = useRouter();
    const {
        slug,
        sectionId,
        problemsetId,
        problemId,
        solution,
        exerciseProgressId
    } = router.query;
    const showSolution = useMemo(() => {
        return solution || problemsetId;
    }, [solution, problemsetId]);
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: (sectionId as string) || (problemsetId as string),
            problemId: problemId as string,
            exercise_progress_id: exerciseProgressId as string
        },
        { skip: !slug || (!sectionId && !problemsetId) || !problemId }
    );
    const { data: solutionData } = useGetProblemSolutionQuery(
        {
            slug: slug as string,
            problem_progress_id: problem?.problem_progress?.id as string
        },
        {
            skip: !slug || !showSolution || !problem?.problem_progress?.id
        }
    );

    const decideAnswerCorrectOrNot = (optionId: string): 1 | 2 | 3 | 4 => {
        if (
            solutionData?.correct_answer_ids.includes(optionId) &&
            solutionData?.user_answer_ids.includes(optionId)
        ) {
            return 1;
        } else if (
            !solutionData?.correct_answer_ids.includes(optionId) &&
            solutionData?.user_answer_ids.includes(optionId)
        ) {
            return 2;
        } else if (
            solutionData?.correct_answer_ids.includes(optionId) &&
            !solutionData?.user_answer_ids.includes(optionId)
        ) {
            if (problem?.problem.type === 'MULTIPLE_ANSWER') {
                return 3;
            }
            return 1;
        }
        return 4;
    };

    return (
        <div className="flex flex-col gap-3">
            {!showSolution && problem?.problem.type === 'MULTIPLE_ANSWER' && (
                <span className="text-accent-yellow text-xs">
                    Jawaban bisa lebih dari 1
                </span>
            )}
            {problem &&
                problem.problem.options.map((option, index) => (
                    <button
                        onClick={
                            showSolution ||
                            problem.problem_progress?.status === 'COMPLETED'
                                ? undefined
                                : () => onAnswerClicked(option.id)
                        }
                        key={index}
                        className={cn(
                            'p-3 border border-purple-7 rounded-lg w-full flex justify-center items-center cursor-pointer relative',
                            selectedAnswer.includes(option.id)
                                ? 'bg-purple-6 hover:bg-purple/60'
                                : 'bg-violet-1 hover:bg-violet-2',
                            showSolution && 'cursor-not-allowed',
                            decideAnswerCorrectOrNot(option.id) === 1 &&
                                'bg-[#00C8B3]/30 border-[#00C8B3] hover:bg-[#00C8B3]/40',
                            decideAnswerCorrectOrNot(option.id) === 2 &&
                                'bg-[#FF383C]/30 hover:bg-[#FF383C]/40 border-[#FF383C]',
                            decideAnswerCorrectOrNot(option.id) === 3 &&
                                'bg-[#FF8D28]/30 hover:bg-[#FF8D28]/40 border-[#FF8D28] border-dashed'
                        )}>
                        <TiptapViewer
                            content={option.answer}
                            className="text-center"
                        />
                        {decideAnswerCorrectOrNot(option.id) <= 3 && (
                            <div
                                className={cn(
                                    'absolute right-3 w-6 h-6 rounded-full flex items-center justify-center',
                                    decideAnswerCorrectOrNot(option.id) === 1 &&
                                        'bg-[#00C8B3]',
                                    decideAnswerCorrectOrNot(option.id) === 2 &&
                                        'bg-[#FF383C]',
                                    decideAnswerCorrectOrNot(option.id) === 3 &&
                                        'bg-[#FFCC00]'
                                )}>
                                {decideAnswerCorrectOrNot(option.id) === 1 && (
                                    <Check
                                        size={20}
                                        className="text-violet-3"
                                    />
                                )}
                                {decideAnswerCorrectOrNot(option.id) === 2 && (
                                    <X size={20} className="text-violet-3" />
                                )}
                                {decideAnswerCorrectOrNot(option.id) === 3 && (
                                    <FaExclamation
                                        size={12}
                                        className="text-violet-3"
                                    />
                                )}
                            </div>
                        )}
                    </button>
                ))}
        </div>
    );
};
export default MultipleChoiceContainer;
