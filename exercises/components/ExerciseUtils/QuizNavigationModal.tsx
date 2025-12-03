import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
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
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useExercise } from 'exercises/contexts/ExerciseProvider';

interface QuizNavigationModalProps {
    onProblemSelect: (problemId: string) => void;
    onClose: () => void;
    className?: string;
    saveAnswer?: (options: {
        navigateDirection: 'custom';
        customProblemId: string;
    }) => Promise<void>;
}

const PROBLEMS_PER_PAGE = 20;

// Mock data for testing different row configurations
// Uncomment one of these to test spacing
const MOCK_DATA_1_ROW = Array.from({ length: 3 }, (_, i) => ({
    id: `problem-${i + 1}`,
    order: i + 1,
    is_answered: i === 0,
    is_correct: i === 0 ? true : null,
    problem_id: `problem-${i + 1}`
}));

const MOCK_DATA_2_ROWS = Array.from({ length: 10 }, (_, i) => ({
    id: `problem-${i + 1}`,
    order: i + 1,
    is_answered: i < 3,
    is_correct: i < 3 ? (i % 2 === 0 ? true : false) : null,
    problem_id: `problem-${i + 1}`
}));

const MOCK_DATA_3_ROWS = Array.from({ length: 15 }, (_, i) => ({
    id: `problem-${i + 1}`,
    order: i + 1,
    is_answered: i < 5,
    is_correct: i < 5 ? (i % 2 === 0 ? true : false) : null,
    problem_id: `problem-${i + 1}`
}));

const MOCK_DATA_4_ROWS = Array.from({ length: 20 }, (_, i) => ({
    id: `problem-${i + 1}`,
    order: i + 1,
    is_answered: i < 10,
    is_correct: i < 10 ? (i % 2 === 0 ? true : false) : null,
    problem_id: `problem-${i + 1}`
}));

const MOCK_DATA_5_ROWS = Array.from({ length: 25 }, (_, i) => ({
    id: `problem-${i + 1}`,
    order: i + 1,
    is_answered: i < 12,
    is_correct: i < 12 ? (i % 2 === 0 ? true : false) : null,
    problem_id: `problem-${i + 1}`
}));

// Set which mock data to use (1, 2, 3, or 4 rows)
const USE_MOCK_DATA = false; // Set to true to use mock data
const MOCK_TEST_ROWS = 4; // Options: 1, 2, 3, 4

const QuizNavigationModal: React.FC<QuizNavigationModalProps> = ({
    onProblemSelect,
    onClose,
    className,
    saveAnswer
}) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = React.useState(0);
    const { selectedAnswer, openEndedAnswer } = useExercise();
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
        if (USE_MOCK_DATA) {
            const mockDataMap = {
                1: MOCK_DATA_1_ROW,
                2: MOCK_DATA_2_ROWS,
                3: MOCK_DATA_3_ROWS,
                4: MOCK_DATA_4_ROWS,
                5: MOCK_DATA_5_ROWS
            };
            const mockData = mockDataMap[MOCK_TEST_ROWS as 1 | 2 | 3 | 4 | 5];
            // Paginate mock data
            const startIndex = currentPage * PROBLEMS_PER_PAGE;
            const paginatedData = mockData.slice(
                startIndex,
                startIndex + PROBLEMS_PER_PAGE
            );
            return {
                allProblems: {
                    count_items: mockData.length,
                    data: paginatedData
                },
                isLoading: false
            };
        }

        if (problemsetId) {
            const mappedData = allProblemsViaProgress?.data?.map(
                (problem: ProblemNavigationVerboseItem) => ({
                    ...problem,
                    id: problem.problem_id
                })
            );

            return {
                allProblems: {
                    ...allProblemsViaProgress,
                    data: mappedData
                } as {
                    count_items: number;
                    data: ProblemNavigationItem[];
                },
                isLoading: isLoadingViaProgress
            };
        } else {
            return {
                allProblems: allProblemsInPS as {
                    count_items: number;
                    data: ProblemNavigationItem[];
                },
                isLoading: isLoadingProblems
            };
        }
    }, [
        allProblemsInPS,
        allProblemsViaProgress,
        isLoadingProblems,
        isLoadingViaProgress,
        problemsetId,
        currentPage
    ]);

    const totalPages = Math.ceil(
        (allProblems?.count_items || 0) / PROBLEMS_PER_PAGE
    );

    // Calculate height based on actual items in current page
    const itemsInCurrentPage = allProblems?.data?.length || 0;
    const actualRowsPerPage = Math.ceil(itemsInCurrentPage / 5);
    const containerHeight = `${
        actualRowsPerPage * 52 + (actualRowsPerPage - 1) * 12
    }px`; // 52px per item (w-12 h-12) + 12px gap

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

    const handleProblemClick = (clickedProblemId: string) => {
        // Check if there's an unsaved answer (new answer or changed answer)
        const hasNewAnswer =
            (selectedAnswer && selectedAnswer.length > 0) ||
            (openEndedAnswer && openEndedAnswer.trim() !== '');

        // Check if answer has changed from what was already submitted
        const submittedAnswerIds =
            problem?.problem_progress?.submitted_answer_ids || [];
        const submittedAnswerText =
            problem?.problem_progress?.submitted_answer_text || '';

        const answerHasChanged =
            (problem?.problem.type === 'SHORT_ANSWER'
                ? openEndedAnswer !== submittedAnswerText
                : !arraysEqual(selectedAnswer, submittedAnswerIds)) ||
            (hasNewAnswer &&
                submittedAnswerIds.length === 0 &&
                !submittedAnswerText);

        if (hasNewAnswer && answerHasChanged && saveAnswer) {
            // Save answer before navigating to selected problem
            saveAnswer({
                navigateDirection: 'custom',
                customProblemId: clickedProblemId
            });
        } else {
            // No answer to save, navigate directly
            onProblemSelect(clickedProblemId);
        }

        onClose();
    };

    // Helper function to compare arrays
    const arraysEqual = (a: string[], b: string[]): boolean => {
        if (a.length !== b.length) return false;
        return (
            a.every((item) => b.includes(item)) &&
            b.every((item) => a.includes(item))
        );
    };

    return (
        <div className={cn('bg-[#2C2C2C] rounded-lg p-6 w-[330px]', className)}>
            {!className?.includes('bg-transparent') && (
                <h2 className="text-white text-xl font-semibold mb-6">
                    Quiz Navigation
                </h2>
            )}

            <div
                className="grid grid-cols-5 place-self-center gap-3 mb-6"
                style={{ height: containerHeight }}>
                {isLoading ? (
                    <Skeleton
                        repeat={5}
                        isCustomSize
                        className="w-12 h-12 aspect-square rounded-lg"
                    />
                ) : (
                    allProblems?.data?.map((problem: ProblemNavigationItem) => {
                        const isCurrentProblem = problem.id === problemId;

                        return (
                            <button
                                key={problem.id}
                                onClick={() => handleProblemClick(problem.id)}
                                className={cn(
                                    'relative w-12 h-12 aspect-square rounded-lg flex items-center justify-center text-white text-xl font-semibold transition-all hover:opacity-50',
                                    isCurrentProblem && [
                                        problem.is_answered
                                            ? 'bg-violet-4 hover:bg-purple-6 border-2 border-yellow-500'
                                            : 'bg-transparent border-2 border-yellow-500',
                                        problem.is_correct !== null &&
                                            problem.is_correct &&
                                            'bg-state-success hover:bg-accent-green border-2 border-yellow-500',
                                        problem.is_correct !== null &&
                                            !problem.is_correct &&
                                            'bg-state-error hover:bg-accent-red border-2 border-yellow-500'
                                    ],
                                    !isCurrentProblem && [
                                        problem.is_answered
                                            ? 'bg-violet-4 hover:bg-purple-6'
                                            : 'bg-transparent border-graphite-600 border-2',
                                        problem.is_correct !== null &&
                                            problem.is_correct &&
                                            'bg-state-success hover:bg-accent-green',
                                        problem.is_correct !== null &&
                                            !problem.is_correct &&
                                            'bg-state-error hover:bg-accent-red'
                                    ]
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
                        );
                    })
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={handlePrevPage}
                        variant="custom"
                        disabled={currentPage === 0}
                        className={cn(
                            'text-center flex !p-0 !w-8 !h-8 items-center justify-center  bg-white/25'
                        )}>
                        <FiChevronLeft size={14} color="#ffffff" />
                    </Button>
                    <Button
                        onClick={handleNextPage}
                        variant="custom"
                        disabled={currentPage === totalPages - 1}
                        className={cn(
                            'text-center flex !p-0 !w-8 !h-8 items-center justify-center bg-white/25'
                        )}>
                        <FiChevronRight size={14} color="#ffffff" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default QuizNavigationModal;
