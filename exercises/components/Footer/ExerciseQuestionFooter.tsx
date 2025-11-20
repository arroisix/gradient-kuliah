import Button from 'commons/components/elements/Button';
import SquareSettings from 'commons/components/elements/Icons/SquareSettings';
import { cn } from 'commons/utils';
import { useGetProblemInProblemSetQuery } from 'exercises/redux/api/exercisesApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import QuizNavigationBottomSheet from '../ExerciseUtils/QuizNavigationBottomSheet';

const ExerciseQuestionFooter: React.FC = () => {
    const router = useRouter();
    const { slug, sectionId, problemId } = router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: sectionId as string,
            problemId: problemId as string
        },
        { skip: !slug || !sectionId || !problemId }
    );

    const [isNavigationOpen, setIsNavigationOpen] = useState(false);

    const handleProblemSelect = (selectedProblemId: string) => {
        router.push(
            `/latihan/${slug}/${sectionId}/${selectedProblemId}`,
            undefined,
            { scroll: false, shallow: true }
        );
    };

    const handleNextProblem = () => {
        if (problem?.next_problem_id) {
            router.push(
                `/latihan/${slug}/${sectionId}/${problem.next_problem_id}`,
                undefined,
                { scroll: false, shallow: true }
            );
        }
    };

    const handlePreviousProblem = () => {
        if (problem?.previous_problem_id) {
            router.push(
                `/latihan/${slug}/${sectionId}/${problem.previous_problem_id}`,
                undefined,
                { scroll: false, shallow: true }
            );
        }
    };

    return (
        <>
            <div className="flex flex-row gap-2 items-center fixed bottom-0 left-0 w-full bg-black p-4 lg:hidden">
                <div className="flex flex-row gap-2 items-center">
                    <Button
                        variant="secondary"
                        onClick={handlePreviousProblem}
                        disabled={!problem?.previous_problem_id}
                        className={cn(
                            'text-center !p-0 !w-8 !h-8 items-center justify-center',
                            problem?.time_constraint === 'PER_PROBLEM'
                                ? 'hidden'
                                : 'flex'
                        )}>
                        <ChevronLeft size={14} />
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setIsNavigationOpen(true)}
                        className={cn(
                            '!rounded-[4px] text-center !p-0 !w-8 !h-8 items-center justify-center',
                            problem?.time_constraint === 'PER_PROBLEM'
                                ? 'hidden'
                                : 'flex'
                        )}>
                        <SquareSettings size={14} />
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleNextProblem}
                        disabled={!problem?.next_problem_id}
                        className={cn(
                            'text-center !p-0 !w-8 !h-8 items-center justify-center',
                            problem?.time_constraint === 'PER_PROBLEM'
                                ? 'hidden'
                                : 'flex'
                        )}>
                        <ChevronRight size={14} />
                    </Button>
                </div>
                <Button
                    variant="primary"
                    size="normal"
                    disabled
                    className="w-full">
                    Selanjutnya
                </Button>
            </div>

            <QuizNavigationBottomSheet
                onProblemSelect={handleProblemSelect}
                isOpen={isNavigationOpen}
                onClose={() => setIsNavigationOpen(false)}
            />
        </>
    );
};

export default ExerciseQuestionFooter;
