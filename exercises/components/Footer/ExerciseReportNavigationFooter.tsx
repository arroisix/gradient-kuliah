import Button from 'commons/components/elements/Button';
import SquareSettings from 'commons/components/elements/Icons/SquareSettings';
import { cn } from 'commons/utils';
import { useGetAllProblemInProblemSetViaExerciseProgressQuery } from 'exercises/redux/api/exercisesApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import QuizNavigationBottomSheet from '../ExerciseUtils/QuizNavigationBottomSheet';
import { ExerciseDetail } from 'exercises/types/exercises';
import Link from 'next/link';

const ExerciseReportNavigationFooter: React.FC<{
    exercise: ExerciseDetail | undefined;
}> = ({ exercise }) => {
    const router = useRouter();
    const { slug, exerciseProgressId, problemsetId, problemId } = router.query;

    const { data: allProblemsData, isLoading: isLoadingProblems } =
        useGetAllProblemInProblemSetViaExerciseProgressQuery(
            {
                slug: slug as string,
                exerciseProgress: exerciseProgressId as string,
                problemsetId: problemsetId as string
            },
            { skip: !slug || !exerciseProgressId || !problemsetId }
        );
    const allProblems = allProblemsData?.data || [];
    const isLoading = isLoadingProblems;
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);

    // Find current problem index
    const currentProblemIndex = allProblems.findIndex(
        (p: any) => p.problem_id === problemId
    );
    const hasPrevious = currentProblemIndex > 0;
    const hasNext =
        currentProblemIndex < allProblems.length - 1 &&
        currentProblemIndex !== -1;

    // Show 5 problems at a time, centered on current
    const getVisibleProblems = () => {
        if (allProblems.length <= 5 || currentProblemIndex === -1) {
            return allProblems;
        }
        let start = Math.max(0, currentProblemIndex - 2);
        if (start + 5 > allProblems.length) {
            start = allProblems.length - 5;
        }
        return allProblems.slice(start, start + 5);
    };
    const visibleProblems = getVisibleProblems();

    const handleProblemSelect = (selectedProblemId: string) => {
        router.push(
            `/latihan/${slug}/report/${exerciseProgressId}/${problemsetId}/${selectedProblemId}`,
            undefined,
            { scroll: false, shallow: true }
        );
        setIsNavigationOpen(false);
    };
    const handleNextProblem = () => {
        if (hasNext) {
            const nextProblem = allProblems[currentProblemIndex + 1];
            if (nextProblem) handleProblemSelect(nextProblem.problem_id);
        }
    };
    const handlePreviousProblem = () => {
        if (hasPrevious) {
            const prevProblem = allProblems[currentProblemIndex - 1];
            if (prevProblem) handleProblemSelect(prevProblem.problem_id);
        }
    };

    return (
        <>
            {/* Mobile Navigation Bar */}
            <div
                className={`${
                    exercise?.tryout_type === 'MATERI' ? 'flex-row' : 'flex-col'
                } flex gap-2 items-center fixed bottom-0 left-0 w-full bg-black p-4 lg:hidden z-10`}>
                <div
                    className={`${
                        exercise?.tryout_type === 'MATERI' ? '' : 'w-full'
                    } flex flex-row gap-2 items-center justify-center`}>
                    <Button
                        variant="secondary"
                        onClick={handlePreviousProblem}
                        disabled={!hasPrevious}
                        className="text-center !p-0 !w-8 !h-8 items-center justify-center flex rounded-md">
                        <ChevronLeft size={16} />
                    </Button>

                    {/* Problem Number Buttons */}
                    {exercise?.tryout_type !== 'MATERI' ? (
                        isLoading ? (
                            <div className="flex gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-md bg-gray-700 animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : (
                            visibleProblems.map((problem) => {
                                return (
                                    <button
                                        key={problem.problem_id}
                                        onClick={() =>
                                            handleProblemSelect(
                                                problem.problem_id
                                            )
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
                                );
                            })
                        )
                    ) : (
                        <></>
                    )}

                    {/* Grid/Settings Button */}
                    {exercise?.tryout_type !== 'MATERI' ? (
                        <Button
                            variant="secondary"
                            onClick={() => setIsNavigationOpen(true)}
                            className="!rounded-md text-center !p-0 !w-8 !h-8 items-center justify-center flex">
                            <SquareSettings size={16} />
                        </Button>
                    ) : (
                        <></>
                    )}

                    <Button
                        variant="secondary"
                        onClick={handleNextProblem}
                        disabled={!hasNext}
                        className="text-center !p-0 !w-8 !h-8 items-center justify-center flex rounded-md">
                        <ChevronRight size={16} />
                    </Button>
                </div>

                {exercise?.tryout_type === 'MATERI' ? (
                    <Link
                        href={
                            exercise?.course.chapter_slug
                                ? `/utbk/materi/${exercise?.course.slug}/${exercise?.course.chapter_slug}/${exercise?.course.subchapter_slug}`
                                : `/kelas/${exercise?.course.slug}/${exercise?.course.subchapter_slug}`
                        }
                        className="bg-[#333333] hover:bg-[#333333]/60 transition-all duration-300 text-white text-center rounded-full text-sm leading-tight font-semibold p-2 px-4 w-full">
                        Selesai
                    </Link>
                ) : (
                    <></>
                )}
            </div>

            {/* Bottom Sheet Navigation */}
            <QuizNavigationBottomSheet
                onProblemSelect={handleProblemSelect}
                isOpen={isNavigationOpen}
                onClose={() => setIsNavigationOpen(false)}
            />
        </>
    );
};

export default ExerciseReportNavigationFooter;
