import Button from 'commons/components/elements/Button';
import SquareSettings from 'commons/components/elements/Icons/SquareSettings';
import { ChevronLeft, ChevronRight, XIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import Timer from '../ExerciseUtils/Timer';
import { useGetProblemInProblemSetQuery } from 'exercises/redux/api/exercisesApi';
import { cn } from 'commons/utils';
import { useState, useRef } from 'react';
import QuizNavigationDropdown from '../ExerciseUtils/QuizNavigationDropdown';

const ExerciseWorksheetHeader = () => {
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
    const settingsButtonRef = useRef<HTMLButtonElement>(null);

    const handleProblemSelect = (selectedProblemId: string) => {
        console.log('Navigate to problem:', selectedProblemId);
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
        <header className="w-full flex items-center justify-between gap-4 relative">
            <XIcon
                size={24}
                className="absolute lg:relative top-0 left-0 cursor-pointer"
            />
            {problem && problem.time_constraint && <Timer />}
            <Timer />
            <div className="flex flex-row gap-2 items-center relative">
                <Button
                    // @ts-ignore
                    ref={settingsButtonRef}
                    variant="secondary"
                    onClick={() => setIsNavigationOpen(!isNavigationOpen)}
                    className={cn(
                        '!rounded-[4px] text-center !p-0 !w-8 !h-8 items-center justify-center',
                        problem?.time_constraint === 'PER_PROBLEM'
                            ? 'hidden'
                            : 'hidden lg:flex',
                        isNavigationOpen && '!bg-purple-6'
                    )}>
                    <SquareSettings size={14} />
                </Button>

                <QuizNavigationDropdown
                    onProblemSelect={handleProblemSelect}
                    isOpen={isNavigationOpen}
                    onClose={() => setIsNavigationOpen(false)}
                    anchorEl={settingsButtonRef.current}
                />

                <Button
                    variant="secondary"
                    disabled={!problem?.previous_problem_id}
                    onClick={handlePreviousProblem}
                    className={cn(
                        'text-center !p-0 !w-8 !h-8 items-center justify-center',
                        problem?.time_constraint === 'PER_PROBLEM'
                            ? 'hidden'
                            : 'hidden lg:flex'
                    )}>
                    <ChevronLeft size={14} />
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleNextProblem}
                    disabled={!problem?.next_problem_id}
                    className={cn(
                        'text-center !p-0 !w-8 !h-8 items-center justify-center',
                        problem?.time_constraint === 'PER_PROBLEM'
                            ? 'hidden'
                            : 'hidden lg:flex'
                    )}>
                    <ChevronRight size={14} />
                </Button>
            </div>
        </header>
    );
};

export default ExerciseWorksheetHeader;
