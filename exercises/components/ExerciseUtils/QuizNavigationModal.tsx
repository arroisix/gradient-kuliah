import React from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from 'commons/utils';
import Button from 'commons/components/elements/Button';
import {
    useGetAllProblemInProblemSetQuery,
    useGetProblemInProblemSetQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import { ProblemNavigationItem } from 'exercises/types/exercises';

interface Problem {
    id: string;
    number: number;
    isAnswered?: boolean;
    isCurrent?: boolean;
}

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
    const { slug, sectionId, problemId } = router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: sectionId as string,
            problemId: problemId as string
        },
        { skip: !slug || !sectionId || !problemId }
    );
    const { data: allProblems } = useGetAllProblemInProblemSetQuery({
        slug: slug as string,
        problemSetProgressId: problem?.id as string,
        page: currentPage + 1,
        limit: PROBLEMS_PER_PAGE
    });

    const totalPages = Math.ceil(
        (allProblems?.count_items as number) / PROBLEMS_PER_PAGE
    );
    const startIndex = currentPage * PROBLEMS_PER_PAGE;
    const endIndex = startIndex + PROBLEMS_PER_PAGE;

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
                {allProblems?.data.map((problem: ProblemNavigationItem) => (
                    <button
                        key={problem.id}
                        onClick={() => handleProblemClick(problem.id)}
                        className={cn(
                            'relative w-12 h-12 aspect-square rounded-lg flex items-center justify-center text-white text-xl font-semibold transition-all hover:opacity-50',
                            problem.id === problemId
                                ? 'bg-transparent border-2 border-yellow-500'
                                : problem.is_answered
                                ? 'bg-violet-4'
                                : 'border-graphite-600 border-2'
                        )}>
                        <span>{problem.order}</span>
                        {problem.is_answered && problem.id !== problemId && (
                            <div className="absolute top-1 right-1 w-[14px] h-[14px] bg-purple-6 rounded-full flex items-center justify-center">
                                <Check size={12} className="text-violet-4" />
                            </div>
                        )}
                    </button>
                ))}
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
