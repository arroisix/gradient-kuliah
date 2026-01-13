import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { cn } from 'commons/utils';
import {
    useGetExerciseDetailV2Query,
    useGetProblemsetDetailInterstitialQuery
} from 'exercises/redux/api/exercisesApi';
import { ProblemSetItem } from 'exercises/types/exercises';
import { useRouter } from 'next/router';

const SubtestResultSummary = () => {
    const router = useRouter();
    const { slug } = router.query;

    const { data: exercise, isLoading: isLoadingGetExerciseDetail } =
        useGetExerciseDetailV2Query(
            { exercise_slug: slug as string },
            {
                skip: !slug
            }
        );

    const { data: problemsetDetail, isLoading: isLoadingGetProblemsetDetail } =
        useGetProblemsetDetailInterstitialQuery(
            {
                slug: slug as string,
                problemset_id: exercise?.first_problemset?.id as string,
                with_score: true
            },
            {
                skip:
                    !slug ||
                    !exercise?.first_problemset?.id ||
                    isLoadingGetExerciseDetail ||
                    exercise?.tryout_type !== 'UTBK'
            }
        );

    if (exercise?.tryout_type !== 'UTBK') {
        return null;
    }

    if (isLoadingGetExerciseDetail || isLoadingGetProblemsetDetail) {
        return (
            <div className="w-full lg:max-w-2xl">
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'w-full flex flex-col gap-6 p-6 rounded-2xl bg-[#191920]',
                exercise?.tryout_type !== 'UTBK' && 'lg:max-w-2xl'
            )}>
            <h2 className="text-white font-bold">Detail per Subtest</h2>

            <div className="flex flex-col gap-4">
                {problemsetDetail?.data?.map((subtest) => (
                    <SubtestResultSummaryCard
                        key={subtest.id}
                        subtest={subtest}
                    />
                ))}
            </div>
        </div>
    );
};

const SubtestResultSummaryCard = ({ subtest }: { subtest: ProblemSetItem }) => {
    const router = useRouter();
    const { slug } = router.query;

    const { data: exercise } = useGetExerciseDetailV2Query({
        exercise_slug: slug as string
    });

    const correctPercentage =
        !!subtest.total_questions && subtest.total_questions > 0
            ? ((subtest.correct_answers || 0) / subtest.total_questions) * 100
            : 0;
    const incorrectPercentage =
        !!subtest.total_questions && subtest.total_questions > 0
            ? ((subtest.total_questions - (subtest.correct_answers || 0)) /
                  subtest.total_questions) *
              100
            : 0;

    const onClickDiscussion = () => {
        router.push(
            `/latihan/${slug}/report/${exercise?.latest_exercise_progress?.id}/${subtest.id}/${subtest.first_problem_id}`
        );
    };

    return (
        <div className="rounded-2xl px-4 py-3 bg-[#20222E]">
            <div className="flex flex-col gap-2 mb-2 lg:mb-6">
                <div className="flex flex-row justify-between">
                    <h3 className="text-white font-semibold">
                        {subtest.title}
                    </h3>
                    <div className="flex flex-row items-center gap-1">
                        <span className="hidden text-white font-semibold lg:block">
                            {subtest.score}
                        </span>
                        {exercise?.tryout_type !== 'UTBK' && (
                            <span className="text-[#999999]">
                                / {subtest.total_score}
                            </span>
                        )}
                    </div>
                </div>

                <div className="w-full h-2 bg-transparent rounded-full overflow-hidden flex gap-1">
                    {/* Correct answers - Green */}
                    <div
                        className="h-full bg-state-success transition-all duration-500 rounded-full"
                        style={{ width: `${correctPercentage}%` }}
                    />
                    {/* Incorrect answers - Red */}
                    <div
                        className="h-full bg-state-error transition-all duration-500 rounded-full"
                        style={{ width: `${incorrectPercentage}%` }}
                    />
                </div>
            </div>

            <div className="lg:flex lg:items-center lg:justify-between">
                <div className="flex justify-between items-center mb-4 lg:mb-0">
                    <p className="text-[#999999] text-sm">
                        <span className="text-white">
                            {subtest.correct_answers} benar
                        </span>{' '}
                        dari {subtest.total_questions} soal
                    </p>

                    <span className="text-white font-semibold text-sm lg:hidden">
                        {subtest.score}
                    </span>
                </div>

                <Button
                    variant="primary"
                    onClick={onClickDiscussion}
                    className="shrink-0 text-xs !py-1.5 block ml-auto lg:text-sm lg:!py-2">
                    Lihat Pembahasan
                </Button>
            </div>
        </div>
    );
};

export default SubtestResultSummary;
