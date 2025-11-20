import Button from 'commons/components/elements/Button';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import ProblemSetVector from './ProblemSetVector';
import { cn } from 'commons/utils';
import { useMemo } from 'react';

const ProblemSetInformation = () => {
    const router = useRouter();
    const { slug } = router.query;

    const { data: exercise, isLoading } = useGetExerciseDetailV2Query(
        { exercise_slug: slug as string },
        {
            skip: !slug
        }
    );

    const progressPercentage = useMemo(() => {
        if (!exercise?.latest_exercise_progress) {
            return 0;
        }
        const { submitted_answers, total_questions } =
            exercise.latest_exercise_progress;
        if (total_questions === 0) {
            return 0;
        }
        return Math.min(
            100,
            Math.round((submitted_answers / total_questions) * 100)
        );
    }, [exercise]);

    const decideCTAAction = (): string => {
        if (exercise?.latest_exercise_progress?.status === 'IN_PROGRESS') {
            // Continue to the latest problem
            const latestProblemId =
                exercise.latest_problemset_progress.last_problem_id;
            if (latestProblemId) {
                return `/latihan/${slug}/${exercise.latest_problemset_progress?.problemset_id}/${latestProblemId}`;
            }
        } else {
            // Start from the first problem of the first problem set
            const firstProblemId = exercise?.first_problemset.first_problem_id;
            if (firstProblemId) {
                return `/latihan/${slug}/${exercise.first_problemset?.id}/${firstProblemId}`;
            }
        }
        const firstProblemId = exercise?.first_problemset.first_problem_id;
        return `/latihan/${slug}/${exercise?.first_problemset?.id}/${firstProblemId}`;
    };

    return (
        <div className="flex flex-col rounded-2xl bg-violet-3 w-full justify-between p-12 min-h-[290px] relative overflow-hidden">
            <div className="flex flex-col gap-3 items-center justify-center">
                <h1>
                    Section{' '}
                    {(exercise?.latest_problemset_progress?.order
                        ? (exercise?.latest_problemset_progress
                              ?.order as number) + 1
                        : (exercise?.first_problemset?.order as number)) + 1}
                    :{' '}
                    {exercise?.latest_problemset_progress?.name ??
                        exercise?.first_problemset?.name}
                </h1>
                <h3 className="text-[#BBBBBB] text-center">
                    Dengan menekan ‘Mulai Latihan’ kamu akan langsung diarahkan
                    ke soal
                </h3>
            </div>
            <div className="w-full z-[10] flex flex-col gap-4">
                {exercise?.latest_exercise_progress &&
                    exercise?.latest_exercise_progress?.status !==
                        'COMPLETED' && (
                        <div className="space-y-2 w-full">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-graphite-400">
                                    Progress
                                </span>
                                <span className="text-purple-6">
                                    {progressPercentage}%
                                </span>
                            </div>
                            <div
                                className={cn(
                                    'h-2 rounded-full',
                                    'bg-[#191920]'
                                )}>
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all duration-300',
                                        'bg-[#B6A6F3]'
                                    )}
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                    )}

                <Button
                    variant="primary"
                    className="w-full text-center"
                    href={decideCTAAction()}>
                    {exercise?.latest_exercise_progress?.status ===
                    'IN_PROGRESS'
                        ? 'Lanjut Mengerjakan'
                        : 'Mulai Latihan'}
                </Button>
            </div>
            <div className="absolute bottom-0 left-0 w-full">
                <ProblemSetVector />
            </div>
            <div
                className="absolute -right-8 -bottom-4"
                style={{
                    background: `radial-gradient(ellipse 150% 100% at bottom, #F2C04C 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    opacity: 0.7,
                    width: '50%',
                    height: '50%'
                }}
            />
        </div>
    );
};

export default ProblemSetInformation;
