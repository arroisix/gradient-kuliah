import { Check, RefreshCcw, X } from 'lucide-react';
import {
    exerciseApi,
    useGetExerciseDetailV2Query
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import Button from 'commons/components/elements/Button';
import { cn } from 'commons/utils';
import { useDispatch } from 'react-redux';

const ResultSummary = ({ isReportMode }: { isReportMode?: boolean }) => {
    const router = useRouter();
    const dispatch = useDispatch();
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
    const { latest_exercise_progress } = exercise || {};

    if (!latest_exercise_progress) {
        return null;
    }

    const { score, correct_answers, incorrect_answers, total_questions } =
        latest_exercise_progress;

    const correctPercentage =
        total_questions > 0 ? (correct_answers / total_questions) * 100 : 0;
    const incorrectPercentage =
        total_questions > 0 ? (incorrect_answers / total_questions) * 100 : 0;

    const onRetry = (): void => {
        const firstProblemId = exercise?.first_problemset?.first_problem_id;
        if (firstProblemId) {
            dispatch(exerciseApi.util.invalidateTags(['EXERCISES']));
            router.push(
                `/latihan/${slug}/${exercise.first_problemset?.id}/${firstProblemId}`
            );
        }
    };

    return (
        <div
            className={cn(
                'w-full pt-6 lg:p-6 space-y-6 bg-violet-1 rounded-l-xl rounded-r-xl',
                exercise?.tryout_type !== 'UTBK' &&
                    'lg:rounded-r-none lg:max-w-2xl'
            )}>
            {/* Title and History Link */}
            <div className="flex items-center justify-between lg:px-0 px-6">
                <h1 className="font-bold text-white">Nilai Akhir Kamu</h1>
                <a
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                    href={`/latihan/${exercise?.slug}/report/${exercise?.latest_exercise_progress?.id}/riwayat`}>
                    <RefreshCcw size={16} />
                    <span className="text-sm font-medium">Lihat Riwayat</span>
                </a>
            </div>

            {/* Score Display */}
            <div className="!mt-1 lg:!mt-2 lg:px-0 px-6">
                <div className="flex items-baseline gap-2">
                    <span className="text-[32px] leading-[120%] font-bold text-white">
                        {parseFloat(score?.toFixed(2)).toString()}
                    </span>
                    {exercise?.tryout_type !== 'UTBK' && (
                        <span className="text-white/60">/ 100</span>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            {exercise?.tryout_type !== 'UTBK' && (
                <div className="space-y-3 lg:px-0 px-6">
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

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-state-success text-white flex items-center justify-center">
                                <Check size={7} />
                            </div>
                            <span className="text-white font-medium text-sm">
                                {correct_answers} Soal
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-white font-medium text-sm">
                                {incorrect_answers} Soal
                            </span>
                            <div className="w-3 h-3 rounded-full bg-state-error text-white flex items-center justify-center">
                                <X size={7} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isReportMode || exercise?.tryout_type === 'UTBK' ? (
                <div className="space-y-3 bg-violet-3 py-4 px-6 rounded-b-lg lg:rounded-lg flex flex-col gap-4 lg:gap-8">
                    <div className="flex flex-col gap-2 text-white">
                        {incorrect_answers > 0 ? (
                            <h3 className="font-semibold">
                                Kamu salah di{' '}
                                {
                                    exercise?.latest_exercise_progress
                                        .incorrect_answers
                                }{' '}
                                soal
                            </h3>
                        ) : (
                            <h3 className="font-semibold">
                                Luar Biasa! Skor Sempurna
                            </h3>
                        )}
                        {incorrect_answers > 0 ? (
                            <span className="text-sm">
                                Lihat pembahasan untuk memahami salahnya dan
                                naikkan skor.
                            </span>
                        ) : (
                            <span className="text-sm">
                                Kamu menguasai materi ini dengan baik.
                            </span>
                        )}
                    </div>
                    {exercise?.tryout_type !== 'UTBK' && (
                        <Button
                            variant="primary"
                            className="w-full text-center"
                            href={`/latihan/${exercise?.slug}/report/${exercise?.latest_exercise_progress?.id}/${exercise?.first_problemset?.id}/${exercise?.first_problemset?.first_problem_id}/`}>
                            Lihat Pembahasan
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-3 pt-4 flex flex-col gap-1 p-6 lg:p-0">
                    <Button
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={onRetry}>
                        <RefreshCcw size={20} />
                        <span>Coba Lagi</span>
                    </Button>

                    <Button
                        variant="secondary"
                        className="w-full text-center"
                        href={`/latihan/${exercise?.slug}/report/${exercise?.latest_exercise_progress?.id}/${exercise?.first_problemset?.id}/${exercise?.first_problemset?.first_problem_id}/`}>
                        Lihat Pembahasan
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ResultSummary;
