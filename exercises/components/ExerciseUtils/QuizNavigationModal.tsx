import React, { useMemo } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from 'commons/utils';
import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import {
    useGetAllProblemInProblemSetQuery,
    useGetAllProblemInProblemSetViaExerciseProgressQuery,
    useGetProblemInProblemSetQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import {
    ProblemNavigationItem,
    ProblemNavigationVerboseItem
} from 'exercises/types/exercises';

interface QuizNavigationModalProps {
    onProblemSelect: (problemId: string) => void;
    onClose: () => void;
    className?: string;
}

const PROBLEMS_PER_PAGE = 20;

const QuizNavigationModal: React.FC<QuizNavigationModalProps> = ({
    onProblemSelect,
    onClose,
    className
}) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = React.useState(0);
    const {
        slug,
        exerciseProgressId,
        problemsetId,
        sectionId,
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
    const { data: allProblemsInPS, isLoading: isLoadingProblems } =
        useGetAllProblemInProblemSetQuery(
            {
                slug: slug as string,
                problemSetProgressId: problem?.id as string,
                page: currentPage + 1,
                limit: PROBLEMS_PER_PAGE,
                solution: solution as string
            },
            { skip: !slug || problemsetId !== undefined }
        );
    const { data: allProblemsViaProgress, isLoading: isLoadingViaProgress } =
        useGetAllProblemInProblemSetViaExerciseProgressQuery(
            {
                slug: slug as string,
                exerciseProgress: exerciseProgressId as string,
                problemsetId: problemsetId as string,
                page: currentPage + 1,
                limit: PROBLEMS_PER_PAGE
            },
            { skip: !slug || !exerciseProgressId || !problemsetId }
        );

    const { allProblems, isLoading } = useMemo(() => {
        if (problemsetId) {
            return {
                allProblems: {
                    ...allProblemsViaProgress,
                    data: allProblemsViaProgress?.data.map(
                        (problem: ProblemNavigationVerboseItem) => ({
                            ...problem,
                            id: problem.problem_id
                        })
                    )
                },
                isLoading: isLoadingViaProgress
            };
        } else {
            return {
                allProblems: allProblemsInPS,
                isLoading: isLoadingProblems
            };
        }
    }, [
        allProblemsInPS,
        allProblemsViaProgress,
        isLoadingProblems,
        isLoadingViaProgress
    ]);

    const totalPages = Math.ceil(
        (allProblems?.count_items as number) / PROBLEMS_PER_PAGE
    );

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleProblemClick = (problemId: string) => {
        onProblemSelect(problemId);
        onClose();
    };

    return (
        <div className={cn('bg-[#2C2C2C] rounded-lg p-6 w-[330px]', className)}>
            {!className?.includes('bg-transparent') && (
                <h2 className="text-white text-xl font-semibold mb-6">
                    Quiz Navigation
                </h2>
            )}

            <div className="grid grid-cols-5 gap-3 mb-6">
                {isLoading ? (
                    <Skeleton
                        repeat={5}
                        isCustomSize
                        className="w-12 h-12 aspect-square rounded-lg"
                    />
                ) : (
                    allProblems?.data?.map((problem: ProblemNavigationItem) => (
                        <button
                            key={problem.id}
                            onClick={() => handleProblemClick(problem.id)}
                            className={cn(
                                'relative w-12 h-12 aspect-square rounded-lg flex items-center justify-center text-white text-xl font-semibold transition-all hover:opacity-50',
                                problem.id === problemId &&
                                    'border-2 border-yellow-500',
                                problem.is_answered
                                    ? 'bg-violet-4 hover:bg-purple-6'
                                    : 'bg-transparent border-graphite-600 border-2',
                                problem.is_correct !== null &&
                                    problem.is_correct &&
                                    'bg-state-success hover:bg-accent-green',
                                problem.is_correct !== null &&
                                    !problem.is_correct &&
                                    'bg-state-error hover:bg-accent-red'
                            )}>
                            <span>{problem.order}</span>
                            {problem.is_answered &&
                                problem.is_correct === null && (
                                    <div className="absolute top-1 right-1 w-[14px] h-[14px] bg-purple-7 rounded-full flex items-center justify-center">
                                        <Check
                                            size={8}
                                            className="text-violet-4"
                                        />
                                    </div>
                                )}
                        </button>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={handlePrevPage}
                        variant="secondary"
                        disabled={currentPage === 0}
                        className={cn(
                            'text-center flex !p-0 !w-8 !h-8 items-center justify-center'
                        )}>
                        <ChevronLeft size={14} />
                    </Button>
                    <Button
                        onClick={handleNextPage}
                        variant="secondary"
                        disabled={currentPage === totalPages - 1}
                        className={cn(
                            'text-center flex !p-0 !w-8 !h-8 items-center justify-center'
                        )}>
                        <ChevronRight size={14} />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default QuizNavigationModal;
