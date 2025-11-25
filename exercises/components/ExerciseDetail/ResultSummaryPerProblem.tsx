import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
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
import AnswerLegend from '../ExerciseQuestion/AnswerLegend';

interface ResultSummaryPerProblemProps {
    onProblemSelect?: (problemId: string) => void;
    className?: string;
}

const PROBLEMS_PER_PAGE = 20;

const ResultSummaryPerProblem: React.FC<ResultSummaryPerProblemProps> = ({
    onProblemSelect,
    className
}) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = React.useState(0);
    const [selectedProblemSetId, setSelectedProblemSetId] =
        React.useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const { slug, exerciseProgressId } = router.query;

    const { data: exercise } = useGetExerciseDetailV2Query(
        {
            exercise_slug: slug as string,
            exercise_progress_id: exerciseProgressId as string
        },
        {
            skip: !slug
        }
    );

    // Set initial problem set ID when exercise data loads
    React.useEffect(() => {
        if (exercise?.first_problemset?.id && !selectedProblemSetId) {
            setSelectedProblemSetId(exercise.first_problemset.id);
        }
    }, [exercise, selectedProblemSetId]);

    const { data: allProblems, isLoading } =
        useGetAllProblemInProblemSetViaExerciseProgressQuery(
            {
                slug: slug as string,
                exerciseProgress:
                    (exerciseProgressId as string) ||
                    (exercise?.latest_exercise_progress?.id as string),
                problemsetId: selectedProblemSetId
            },
            {
                skip:
                    !slug ||
                    (!(exerciseProgressId as string) &&
                        !(exercise?.latest_exercise_progress?.id as string)) ||
                    !selectedProblemSetId
            }
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
        if (onProblemSelect) {
            onProblemSelect(problemId);
        }
    };

    const handleProblemSetChange = (problemSetId: string) => {
        setSelectedProblemSetId(problemSetId);
        setIsDropdownOpen(false);
        setCurrentPage(0);
    };

    const selectedProblemSet = allProblemset?.data?.find(
        (ps: ProblemSetItem) => ps.id === selectedProblemSetId
    );

    return (
        <div
            className={cn(
                'px-4 py-6 bg-violet-3 rounded-r-lg rounded-l-lg lg:rounded-l-none',
                className
            )}>
            <h2 className="text-white/60 text-sm font-medium mb-4">
                Detail Jawaban Per Soal
            </h2>
            {/* Dropdown for Problem Set Selection */}
            {allProblemset && allProblemset?.data?.length > 1 && (
                <>
                    <div className="relative mb-4">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-[#2C2C2C] text-white px-4 py-3 rounded-lg flex items-center justify-between hover:bg-[#3A3A3A] transition-colors">
                            <span className="text-sm font-medium">
                                {`Section ${
                                    (selectedProblemSet?.order ?? 0) + 1
                                }: ${selectedProblemSet?.title}` ||
                                    'Select Problem Set'}
                            </span>
                            <ChevronDown
                                size={16}
                                className={cn(
                                    'transition-transform',
                                    isDropdownOpen && 'rotate-180'
                                )}
                            />
                        </button>

                        {isDropdownOpen && allProblemset?.data && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#2C2C2C] rounded-lg overflow-hidden z-10 border border-white/10">
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
                                            {problemSet.title}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="grid grid-cols-5 gap-3 mb-6 place-self-center">
                {isLoading ? (
                    <Skeleton
                        repeat={20}
                        isCustomSize
                        className="w-full aspect-square rounded-xl"
                    />
                ) : (
                    allProblems?.data.map(
                        (problem: ProblemNavigationVerboseItem) => (
                            <button
                                key={problem.problem_id}
                                onClick={() =>
                                    handleProblemClick(problem.problem_id)
                                }
                                className={cn(
                                    'aspect-square rounded-xl flex items-center justify-center text-white text-lg font-semibold transition-all hover:opacity-80 w-12 h-12',
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

            {/* Legend */}
            <AnswerLegend removeYellowLegend={true} className="mb-6" />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        onClick={handlePrevPage}
                        variant="secondary"
                        disabled={currentPage === 0}
                        className={cn(
                            'text-center flex !p-0 !w-10 !h-10 items-center justify-center rounded-full bg-[#3A3A3A] border-none hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed'
                        )}>
                        <ChevronLeft size={20} />
                    </Button>
                    <Button
                        onClick={handleNextPage}
                        variant="secondary"
                        disabled={currentPage === totalPages - 1}
                        className={cn(
                            'text-center flex !p-0 !w-10 !h-10 items-center justify-center rounded-full bg-[#3A3A3A] border-none hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed'
                        )}>
                        <ChevronRight size={20} />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ResultSummaryPerProblem;
