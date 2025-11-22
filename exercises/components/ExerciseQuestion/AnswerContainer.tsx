import Button from 'commons/components/elements/Button';
import {
    useGetProblemInProblemSetQuery,
    useGetProblemSolutionQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import MultipleChoiceContainer from './MultipleChoice';
import OpenEnded from './OpenEnded';
import useSubmitAnswerHandler from 'exercises/hooks/useSubmitAnswerHandler';
import ExerciseQuestionFooter from '../Footer/ExerciseQuestionFooter';
import { cn } from 'commons/utils';
import AnswerInformation from './AnswerInformation';
import Book from 'commons/components/elements/Icons/Book';
import { useEffect, useMemo, useState } from 'react';
import SolutionContainer from './SolutionContainer';

const QuestionContent = () => {
    const router = useRouter();
    const { slug, sectionId, problemId, solution } = router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: sectionId as string,
            problemId: problemId as string
        },
        { skip: !slug || !sectionId || !problemId }
    );
    const { data: solutionData } = useGetProblemSolutionQuery(
        {
            slug: slug as string,
            problem_progress_id: problem?.problem_progress?.id as string
        },
        { skip: !slug || !solution || !problem?.problem_progress?.id }
    );
    const [showSolution, setShowSolution] = useState(false);

    useEffect(() => {
        setShowSolution(false);
    }, [problemId]);

    const onNextSolution = async () => {
        if (!problem?.next_problem_id && problem?.next_problemset_id) {
            router.push(
                `/latihan/${slug}/${problem?.next_problemset_id}`,
                undefined,
                { scroll: false, shallow: true }
            );
        } else {
            if (problem?.show_solution === 'AFTER_PROBLEM') {
                if (problem.next_problem_id) {
                    router.push(
                        `/latihan/${slug}/${sectionId}/${problem?.next_problem_id}`
                    );
                } else if (problem.next_problemset_id) {
                    router.push(
                        `/latihan/${slug}/${problem?.next_problemset_id}`,
                        undefined,
                        { scroll: false, shallow: true }
                    );
                } else {
                    // TODO: report page
                    router.push(`/latihan/${slug}`, undefined, {
                        scroll: false,
                        shallow: true
                    });
                }
            } else {
                router.push(
                    `/latihan/${slug}/${sectionId}/${problem?.next_problem_id}?solution=1`,
                    undefined,
                    { scroll: false, shallow: true }
                );
            }
        }
    };

    const {
        onAnswerClicked,
        selectedAnswer,
        openEndedAnswer,
        handleAnswerChange,
        saveAnswer,
        isLoading
    } = useSubmitAnswerHandler(problem!);

    const renderAnswerType = useMemo(() => {
        if (showSolution) {
            return <SolutionContainer />;
        } else {
            switch (problem?.problem.type) {
                case 'MULTIPLE_CHOICE':
                case 'MULTIPLE_ANSWER':
                    return (
                        <MultipleChoiceContainer
                            key={problemId as string}
                            onAnswerClicked={onAnswerClicked}
                            selectedAnswer={selectedAnswer}
                        />
                    );
                case 'SHORT_ANSWER':
                    return (
                        <OpenEnded
                            key={problemId as string}
                            openEndedAnswer={openEndedAnswer}
                            handleAnswerChange={handleAnswerChange}
                        />
                    );
                default:
                    return <></>;
            }
        }
    }, [
        problemId,
        onAnswerClicked,
        selectedAnswer,
        openEndedAnswer,
        handleAnswerChange,
        showSolution
    ]);

    return (
        <>
            <div
                className={cn(
                    'flex flex-col justify-between gap-2 w-full h-full lg:h-[70vh] lg:bg-violet-1 rounded-2xl relative lg:overflow-hidden',
                    solution ? 'lg:pb-12 lg:px-12 lg:pt-28' : 'lg:p-12'
                )}>
                {solution && (
                    <AnswerInformation
                        showSolution={showSolution}
                        setShowSolution={setShowSolution}
                    />
                )}
                {renderAnswerType}
                {!showSolution && (
                    <div className="w-full hidden lg:flex flex-row gap-2">
                        {solution && solutionData && (
                            <Button
                                variant="secondary"
                                onClick={() => setShowSolution(true)}
                                className="w-full flex items-center justify-center gap-2">
                                <span>Lihat Pembahasan</span>
                                <Book />
                            </Button>
                        )}
                        <Button
                            onClick={solution ? onNextSolution : saveAnswer}
                            variant="primary"
                            disabled={
                                selectedAnswer.length === 0 &&
                                openEndedAnswer === '' &&
                                problem?.problem_progress?.completed_at ===
                                    null &&
                                !isLoading &&
                                !solution
                            }
                            className="w-full">
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                'Selanjutnya'
                            )}
                        </Button>
                    </div>
                )}
            </div>
            <ExerciseQuestionFooter
                saveAnswer={solution ? onNextSolution : saveAnswer}
                isDisabled={
                    selectedAnswer.length === 0 &&
                    openEndedAnswer === '' &&
                    problem?.problem_progress?.completed_at === null &&
                    !isLoading
                }
            />
        </>
    );
};

export default QuestionContent;
