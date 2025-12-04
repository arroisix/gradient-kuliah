import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { cn } from 'commons/utils';
import TiptapViewer from 'courses/components/Textbook/TiptapViewer';
import { useExercise } from 'exercises/contexts/ExerciseProvider';
import {
    useGetAllProblemInProblemSetQuery,
    useGetProblemInProblemSetQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

const QuestionContent = () => {
    const { showSolution } = useExercise();
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const isReportPage = router.pathname.includes('/report/');
    const { slug, sectionId, problemsetId, problemId, exerciseProgressId } =
        router.query;

    const isSolutionPage = useMemo(() => {
        return problemsetId;
    }, [problemsetId]);

    const { data: problem, isLoading: isLoadingProblem } =
        useGetProblemInProblemSetQuery(
            {
                slug: slug as string,
                problemSetId: (sectionId as string) || (problemsetId as string),
                problemId: problemId as string,
                exercise_progress_id: exerciseProgressId as string
            },
            { skip: !slug || (!sectionId && !problemsetId) || !problemId }
        );
    const { data: allProblemsInPS, isLoading: isLoadingAllProblems } =
        useGetAllProblemInProblemSetQuery(
            {
                slug: slug as string,
                problemSetProgressId: problem?.id as string,
                page: 1,
                limit: 1
            },
            { skip: !slug || !problem?.id }
        );

    useEffect(() => {
        const checkOverflow = () => {
            if (contentRef.current && !isExpanded) {
                const isContentOverflowing =
                    contentRef.current.scrollHeight >
                    contentRef.current.clientHeight;
                setIsOverflowing(isContentOverflowing);
            }
        };

        // Setup ResizeObserver untuk mendeteksi perubahan ukuran
        const resizeObserver = new ResizeObserver(checkOverflow);
        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [isExpanded]);

    const handleContentReady = () => {
        if (contentRef.current && !isExpanded) {
            const isContentOverflowing =
                contentRef.current.scrollHeight >
                contentRef.current.clientHeight;
            setIsOverflowing(isContentOverflowing);
        }
    };

    if (isLoadingProblem || isLoadingAllProblems) {
        return (
            <div className="flex flex-col gap-4 w-full">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-2/5" />
            </div>
        );
    }

    if (isSolutionPage)
        return (
            <div
                className={cn(
                    'flex flex-col gap-2 w-full',
                    showSolution && 'hidden lg:flex'
                )}>
                <div className="flex items-center gap-1">
                    <h2 className="lg:font-semibold text-sm lg:text-2xl text-white">
                        Nomor {(problem?.problem?.order ?? 0) + 1}
                    </h2>
                    <h2 className="text-graphite-400 text-sm lg:text-2xl">
                        / {allProblemsInPS?.count_items ?? 0}
                    </h2>
                </div>
                <div
                    ref={contentRef}
                    className={cn(
                        'relative overflow-hidden',
                        !isExpanded && 'max-h-[calc(100vh*1/2)]'
                    )}>
                    <TiptapViewer
                        content={problem?.problem.question}
                        className="lg:!text-xl text-white"
                        onContentReady={handleContentReady}
                    />
                    {!isExpanded && isOverflowing && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
                    )}
                </div>
                {isOverflowing && (
                    <Button
                        variant="custom"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn(
                            'mt-4 px-4 py-2 bg-blue-600 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors w-fit flex flex-row items-center gap-2 self-center',
                            isExpanded
                                ? 'bg-tranparent border-[1px] border-[#999999]'
                                : 'bg-[#4B4E5F]'
                        )}>
                        {isExpanded ? 'Tutup' : 'Lihat Semua'}
                        {isExpanded ? (
                            <BiChevronUp size={24} />
                        ) : (
                            <BiChevronDown size={24} />
                        )}
                    </Button>
                )}
            </div>
        );

    return (
        <div
            className={cn(
                'flex flex-col gap-2 w-full h-full lg:overflow-y-auto',
                showSolution && 'hidden lg:flex'
            )}>
            <div className="flex items-center gap-1">
                <h2 className="lg:font-semibold text-sm lg:text-2xl text-white">
                    Nomor {(problem?.problem?.order ?? 0) + 1}
                </h2>
                <h2 className="text-graphite-400 text-sm lg:text-2xl">
                    / {allProblemsInPS?.count_items ?? 0}
                </h2>
            </div>
            <TiptapViewer
                content={problem?.problem.question}
                className="lg:!text-xl text-white"
            />
        </div>
    );
};

export default QuestionContent;
