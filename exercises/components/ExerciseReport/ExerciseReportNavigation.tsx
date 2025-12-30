import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from 'commons/utils';
import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import {
    useGetAllProblemInProblemSetViaExerciseProgressQuery,
    useGetExerciseDetailV2Query,
    useGetProblemsetDetailInterstitialQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import {
    ProblemNavigationVerboseItem,
    ProblemSetItem
} from 'exercises/types/exercises';
import SquareSettings from 'commons/components/elements/Icons/SquareSettings';

interface ExerciseReportNavigationProps {
    className?: string;
}

const PROBLEMS_PER_PAGE = 20;

// Mock data for testing different row configurations
const MOCK_DATA_1_ROW = Array.from({ length: 3 }, (_, i) => ({
    problem_id: `problem-${i + 1}`,
    order: i + 1,
    is_answered: i === 0,
    is_correct: i === 0 ? true : null
}));

const MOCK_DATA_2_ROWS = Array.from({ length: 10 }, (_, i) => ({
    problem_id: `problem-${i + 1}`,
    order: i + 1,
    is_answered: i < 3,
    is_correct: i < 3 ? (i % 2 === 0 ? true : false) : null
}));

const MOCK_DATA_3_ROWS = Array.from({ length: 15 }, (_, i) => ({
    problem_id: `problem-${i + 1}`,
    order: i + 1,
    is_answered: i < 5,
    is_correct: i < 5 ? (i % 2 === 0 ? true : false) : null
}));

const MOCK_DATA_4_ROWS = Array.from({ length: 20 }, (_, i) => ({
    problem_id: `problem-${i + 1}`,
    order: i + 1,
    is_answered: i < 10,
    is_correct: i < 10 ? (i % 2 === 0 ? true : false) : null
}));

const MOCK_DATA_5_ROWS = Array.from({ length: 25 }, (_, i) => ({
    problem_id: `problem-${i + 1}`,
    order: i + 1,
    is_answered: i < 12,
    is_correct: i < 12 ? (i % 2 === 0 ? true : false) : null
}));

// Set which mock data to use (1, 2, 3, 4, or 5 rows)
const USE_MOCK_DATA = false; // Set to true to use mock data
const MOCK_TEST_ROWS = 4; // Options: 1, 2, 3, 4, 5

const ExerciseReportNavigation: React.FC<ExerciseReportNavigationProps> = ({
    className
}) => {
    const router = useRouter();
    const [selectedProblemSetId, setSelectedProblemSetId] =
        useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const { slug, exerciseProgressId, problemId, problemsetId } = router.query;

    const { data: exercise } = useGetExerciseDetailV2Query(
        {
            exercise_slug: slug as string,
            exercise_progress_id: exerciseProgressId as string
        },
        {
            skip: !slug
        }
    );

    // Set initial problem set ID from URL or default to first problem set
    React.useEffect(() => {
        if (problemsetId && typeof problemsetId === 'string') {
            setSelectedProblemSetId(problemsetId);
        } else if (exercise?.first_problemset?.id && !selectedProblemSetId) {
            setSelectedProblemSetId(exercise.first_problemset.id);
        }
    }, [exercise, problemsetId, selectedProblemSetId]);

    // Fetch all problems without pagination for navigation display
    const { data: allProblemsRaw, isLoading: isLoadingRaw } =
        useGetAllProblemInProblemSetViaExerciseProgressQuery(
            {
                slug: slug as string,
                exerciseProgress: exerciseProgressId as string,
                problemsetId: selectedProblemSetId
            },
            {
                skip: !slug || !exerciseProgressId || !selectedProblemSetId
            }
        );

    // Fetch paginated problems for modal
    const { data: allProblemsModalRaw, isLoading: isLoadingModalRaw } =
        useGetAllProblemInProblemSetViaExerciseProgressQuery(
            {
                slug: slug as string,
                exerciseProgress: exerciseProgressId as string,
                problemsetId: selectedProblemSetId,
                page: currentPage + 1,
                limit: PROBLEMS_PER_PAGE
            },
            {
                skip:
                    !slug ||
                    !exerciseProgressId ||
                    !selectedProblemSetId ||
                    !isNavigationOpen
            }
        );

    // Process data with mock support and pagination
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
            return {
                allProblems: {
                    count_items: mockData.length,
                    data: mockData
                },
                isLoading: false
            };
        }

        return {
            allProblems: allProblemsRaw as {
                count_items: number;
                data: any[];
            },
            isLoading: isLoadingRaw
        };
    }, [allProblemsRaw, isLoadingRaw]);

    // Process modal data with pagination
    const { allProblemsModal, isLoadingModal } = useMemo(() => {
        if (USE_MOCK_DATA) {
            const mockDataMap = {
                1: MOCK_DATA_1_ROW,
                2: MOCK_DATA_2_ROWS,
                3: MOCK_DATA_3_ROWS,
                4: MOCK_DATA_4_ROWS,
                5: MOCK_DATA_5_ROWS
            };
            const mockData = mockDataMap[MOCK_TEST_ROWS as 1 | 2 | 3 | 4 | 5];
            // Client-side pagination for mock data
            const startIndex = currentPage * PROBLEMS_PER_PAGE;
            const paginatedData = mockData.slice(
                startIndex,
                startIndex + PROBLEMS_PER_PAGE
            );
            return {
                allProblemsModal: {
                    count_items: mockData.length,
                    data: paginatedData
                },
                isLoadingModal: false
            };
        }

        return {
            allProblemsModal: allProblemsModalRaw as {
                count_items: number;
                data: any[];
            },
            isLoadingModal: isLoadingModalRaw
        };
    }, [allProblemsModalRaw, isLoadingModalRaw, currentPage]);

    const totalPages = Math.ceil(
        (allProblemsModal?.count_items || 0) / PROBLEMS_PER_PAGE
    );

    const { data: allProblemset } = useGetProblemsetDetailInterstitialQuery(
        {
            slug: slug as string,
            problemset_id: exercise?.first_problemset.id as string
        },
        {
            skip: !slug || !exercise?.first_problemset?.id
        }
    );

    const handleProblemSetChange = (problemSetId: string) => {
        setSelectedProblemSetId(problemSetId);
        setIsDropdownOpen(false);
        setCurrentPage(0);

        // Navigate to first problem of selected problem set
        const firstProblemInPS = allProblemset?.data?.find(
            (ps: ProblemSetItem) => ps.id === problemSetId
        )?.first_problem_id;
        if (firstProblemInPS) {
            router.push(
                `/latihan/${slug}/report/${exerciseProgressId}/${problemSetId}/${firstProblemInPS}/`,
                undefined,
                { scroll: false, shallow: true }
            );
        }
    };

    const handleProblemClick = (selectedProblemId: string) => {
        router.push(
            `/latihan/${slug}/report/${exerciseProgressId}/${selectedProblemSetId}/${selectedProblemId}/`,
            undefined,
            { scroll: false, shallow: true }
        );
    };

    const handleNextProblem = () => {
        const currentIndex = allProblems?.data?.findIndex(
            (p: ProblemNavigationVerboseItem) => p.problem_id === problemId
        );
        if (
            currentIndex !== undefined &&
            currentIndex !== -1 &&
            allProblems?.data
        ) {
            const nextProblem = allProblems.data[currentIndex + 1];
            if (nextProblem) {
                handleProblemClick(nextProblem.problem_id);
            } else {
                const currentProblemsetOrder = allProblemset?.data.findIndex(
                    (ps) => ps.id === selectedProblemSetId
                );

                if (
                    currentProblemsetOrder !== undefined &&
                    allProblemset?.data &&
                    currentProblemsetOrder < allProblemset?.data.length - 1
                ) {
                    const nextProblemset =
                        allProblemset?.data[currentProblemsetOrder + 1];
                    if (nextProblemset) {
                        router.replace(
                            `/latihan/${slug}/report/${exerciseProgressId}/${nextProblemset.id}/${nextProblemset.first_problem_id}`,
                            undefined,
                            { scroll: false, shallow: true }
                        );
                    }
                } else {
                    if (exercise?.tryout_type === 'UTBK') {
                        router.replace(
                            `/latihan/${slug}/report/${exerciseProgressId}/analisa-diri/`,
                            undefined,
                            { scroll: false, shallow: true }
                        );
                    } else {
                        router.replace(
                            `/latihan/${slug}/report/${exerciseProgressId}/leaderboard/`,
                            undefined,
                            { scroll: false, shallow: true }
                        );
                    }
                }
            }
        }
    };

    const handlePreviousProblem = () => {
        const currentIndex = allProblems?.data?.findIndex(
            (p: ProblemNavigationVerboseItem) => p.problem_id === problemId
        );
        if (
            currentIndex !== undefined &&
            currentIndex > 0 &&
            allProblems?.data
        ) {
            const prevProblem = allProblems.data[currentIndex - 1];
            if (prevProblem) {
                handleProblemClick(prevProblem.problem_id);
            }
        }
    };

    const selectedProblemSet = allProblemset?.data?.find(
        (ps: ProblemSetItem) => ps.id === selectedProblemSetId
    );

    const currentProblemIndex = allProblems?.data?.findIndex(
        (p: ProblemNavigationVerboseItem) => p.problem_id === problemId
    );
    const hasPrevious =
        currentProblemIndex !== undefined && currentProblemIndex > 0;

    // Calculate visible problems range - show 5 at a time, centered on current problem when possible
    const getVisibleProblems = () => {
        if (
            !allProblems?.data ||
            currentProblemIndex === undefined ||
            currentProblemIndex === -1
        ) {
            return allProblems?.data?.slice(0, 5) || [];
        }

        const totalProblems = allProblems.data.length;
        const displayCount = 5;

        // If total problems <= 5, show all
        if (totalProblems <= displayCount) {
            return allProblems.data;
        }

        // Calculate start index to center current problem
        let startIndex = Math.max(
            0,
            currentProblemIndex - Math.floor(displayCount / 2)
        );

        // Adjust if we're near the end
        if (startIndex + displayCount > totalProblems) {
            startIndex = totalProblems - displayCount;
        }

        return allProblems.data.slice(startIndex, startIndex + displayCount);
    };

    const visibleProblems = getVisibleProblems();

    return (
        <div
            className={cn(
                'flex items-center justify-center gap-3 relative',
                className
            )}>
            {/* Section Dropdown - Only show if more than 1 section */}
            {allProblemset && allProblemset?.data?.length > 1 && (
                <div className="w-full lg:w-auto lg:absolute lg:left-0 lg:top-auto lg:bottom-auto">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-violet-2 lg:bg-transparent text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-colors border border-white/10 min-w-[200px]">
                        <span className="text-sm font-medium truncate">
                            {selectedProblemSet
                                ? `Subtes ${
                                      (selectedProblemSet.order ?? 0) + 1
                                  }: ${selectedProblemSet.title}`
                                : 'Pilih Subtes'}
                        </span>
                        <ChevronDown
                            size={16}
                            className={cn(
                                'transition-transform flex-shrink-0',
                                isDropdownOpen && 'rotate-180'
                            )}
                        />
                    </button>

                    {isDropdownOpen && allProblemset?.data && (
                        <div className="absolute top-full left-0 mt-2 bg-[#2C2C2C] rounded-lg z-50 border border-white/10 min-w-[200px]">
                            {allProblemset.data.map(
                                (problemSet: ProblemSetItem) => (
                                    <button
                                        key={problemSet.id}
                                        onClick={() =>
                                            handleProblemSetChange(
                                                problemSet.id
                                            )
                                        }
                                        className={cn(
                                            'w-full px-4 py-3 text-left text-sm hover:bg-[#3A3A3A] transition-colors',
                                            problemSet.id ===
                                                selectedProblemSetId
                                                ? 'bg-[#3A3A3A] text-white'
                                                : 'text-white/80'
                                        )}>
                                        Subtes {(problemSet.order ?? 0) + 1}:{' '}
                                        {problemSet.title}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Navigation Controls */}
            <div className="hidden lg:flex items-center gap-2">
                <Button
                    variant="secondary"
                    disabled={!hasPrevious}
                    onClick={handlePreviousProblem}
                    className="text-center !p-0 !w-8 !h-8 items-center justify-center flex !rounded-lg">
                    <ChevronLeft size={16} />
                </Button>

                {/* Problem Number Buttons - Show 5 at a time, shifts with current problem */}
                <div className="hidden md:flex items-center gap-2">
                    {isLoading ? (
                        <Skeleton
                            repeat={5}
                            isCustomSize
                            className="w-8 h-8 rounded-lg"
                        />
                    ) : (
                        visibleProblems.map(
                            (problem: ProblemNavigationVerboseItem) => (
                                <button
                                    key={problem.problem_id}
                                    onClick={() =>
                                        handleProblemClick(problem.problem_id)
                                    }
                                    className={cn(
                                        'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all',
                                        problem.problem_id === problemId &&
                                            'ring-2 ring-yellow-500',
                                        problem.is_correct
                                            ? 'bg-[#4ADE80] text-white hover:opacity-80'
                                            : 'bg-[#EF4444] text-white hover:opacity-80'
                                    )}>
                                    {problem.order}
                                </button>
                            )
                        )
                    )}
                </div>

                {/* Navigation Modal Toggle */}
                <div className="relative">
                    <Button
                        variant="secondary"
                        onClick={() => setIsNavigationOpen(!isNavigationOpen)}
                        className={cn(
                            '!rounded-lg text-center !p-0 !w-8 !h-8 items-center justify-center flex',
                            isNavigationOpen && '!bg-purple-6'
                        )}>
                        <SquareSettings size={16} />
                    </Button>

                    {/* Quiz Navigation Modal */}
                    {isNavigationOpen && (
                        <>
                            <div
                                role="button"
                                aria-hidden
                                tabIndex={0}
                                className="fixed inset-0 z-40"
                                onClick={() => setIsNavigationOpen(false)}
                            />
                            <div className="absolute top-full right-0 mt-2 bg-[#2C2C2C] rounded-lg p-6 w-[330px] z-50 border border-white/10">
                                <h2 className="text-white text-lg font-semibold mb-4">
                                    Quiz Navigation
                                </h2>

                                <div className="grid grid-cols-5 gap-3 mb-4">
                                    {isLoadingModal ? (
                                        <Skeleton
                                            repeat={20}
                                            isCustomSize
                                            className="w-12 h-12 aspect-square rounded-lg"
                                        />
                                    ) : (
                                        allProblemsModal?.data?.map(
                                            (
                                                problem: ProblemNavigationVerboseItem
                                            ) => (
                                                <button
                                                    key={problem.problem_id}
                                                    onClick={() => {
                                                        handleProblemClick(
                                                            problem.problem_id
                                                        );
                                                        setIsNavigationOpen(
                                                            false
                                                        );
                                                    }}
                                                    className={cn(
                                                        'relative w-12 h-12 aspect-square rounded-lg flex items-center justify-center text-white text-sm font-semibold transition-all hover:opacity-80',
                                                        problem.problem_id ===
                                                            problemId &&
                                                            'ring-2 ring-yellow-500',
                                                        problem.is_correct
                                                            ? 'bg-[#4ADE80]'
                                                            : 'bg-[#EF4444]'
                                                    )}>
                                                    <span>{problem.order}</span>
                                                </button>
                                            )
                                        )
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            onClick={() =>
                                                setCurrentPage(
                                                    Math.max(0, currentPage - 1)
                                                )
                                            }
                                            variant="custom"
                                            disabled={currentPage === 0}
                                            className={cn(
                                                'text-center flex !p-0 !w-8 !h-8 items-center justify-center bg-white/25'
                                            )}>
                                            <ChevronLeft
                                                size={14}
                                                color="#ffffff"
                                            />
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setCurrentPage(
                                                    Math.min(
                                                        totalPages - 1,
                                                        currentPage + 1
                                                    )
                                                )
                                            }
                                            variant="custom"
                                            disabled={
                                                currentPage === totalPages - 1
                                            }
                                            className={cn(
                                                'text-center flex !p-0 !w-8 !h-8 items-center justify-center bg-white/25'
                                            )}>
                                            <ChevronRight
                                                size={14}
                                                color="#ffffff"
                                            />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <Button
                    variant="secondary"
                    onClick={handleNextProblem}
                    // disabled={!hasNext}
                    className="text-center !p-0 !w-8 !h-8 items-center justify-center flex !rounded-lg">
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
};

export default ExerciseReportNavigation;
