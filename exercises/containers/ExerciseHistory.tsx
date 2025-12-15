import React from 'react';
import LatihanLayout from './LatihanLayout';
import { useRouter } from 'next/router';
import { FiChevronLeft } from 'react-icons/fi';
import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { RefreshCcw } from 'lucide-react';
import {
    exerciseApi,
    useGetExerciseDetailV2Query,
    useGetExerciseHistoryQuery
} from 'exercises/redux/api/exercisesApi';
import { ExerciseHistoryItem } from 'exercises/types/exercises';
import { cn } from 'commons/utils';
import { useDispatch } from 'react-redux';

const ExerciseHistory: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { slug, exerciseProgressId } = router.query;

    const { data, isFetching } = useGetExerciseHistoryQuery(
        {
            exercise_slug: slug as string
        },
        {
            skip: !slug
        }
    );

    const { data: exercise } = useGetExerciseDetailV2Query(
        {
            exercise_slug: slug as string,
            exercise_progress_id: exerciseProgressId as string
        },
        {
            skip: !slug || !exerciseProgressId
        }
    );

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
        <LatihanLayout className="h-full items-center flex flex-col">
            <div className="w-full flex items-center justify-center gap-4 relative mt-1">
                <a
                    className="absolute top-auto bottom-auto left-0 cursor-pointer w-8 h-8 bg-white/25 rounded-full flex items-center justify-center"
                    href={`/latihan/${slug}/report/${exerciseProgressId}`}>
                    <FiChevronLeft size={20} color="white" />
                </a>
                <h1 className="w-[70%] md:w-full text-white text-lg md:text-xl font-semibold text-center">
                    Riwayat Pengerjaan Try Out
                </h1>
            </div>

            <div className="w-full mt-6 flex flex-col gap-3 items-center">
                {isFetching || !data ? (
                    <>
                        <Skeleton
                            isCustomSize
                            className="w-full max-w-[350px] md:w-[450px] md:max-w-full h-28"
                        />
                        <Skeleton
                            isCustomSize
                            className="w-full max-w-[350px] md:w-[450px] md:max-w-full h-28"
                        />
                        <Skeleton
                            isCustomSize
                            className="w-full max-w-[350px] md:w-[450px] md:max-w-full h-28"
                        />
                    </>
                ) : (
                    <>
                        {[...data.history]
                            .reverse()
                            .map((historyItem, index) => (
                                <ExerciseHistoryCard
                                    key={historyItem.id}
                                    isLastestAttempt={index === 0}
                                    historyItem={historyItem}
                                />
                            ))}
                    </>
                )}
            </div>

            <Button
                variant="secondary"
                className="mt-6 w-full max-w-[350px] md:w-[450px] md:max-w-full flex flex-row gap-2 items-center justify-center"
                onClick={onRetry}>
                <RefreshCcw size={16} />
                Coba Lagi
            </Button>
        </LatihanLayout>
    );
};

const ExerciseHistoryCard = ({
    isLastestAttempt,
    historyItem
}: {
    isLastestAttempt: boolean;
    historyItem: ExerciseHistoryItem;
}) => {
    const router = useRouter();
    const { slug } = router.query;

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Ags',
            'Sep',
            'Oct',
            'Nov',
            'Des'
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day} ${month} ${year} | ${hours}.${minutes}`;
    };

    return (
        <div
            className={cn(
                'w-full max-w-[350px] md:w-[450px] md:max-w-full p-4 rounded-lg bg-[#191920] flex flex-col gap-4',
                isLastestAttempt && 'border-l-2 border-[#5F2BCE]'
            )}>
            <div className="flex flex-row justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-white font-semibold">
                        Percobaan #{historyItem.attempt}
                    </h2>
                    <p className="text-sm">
                        {isLastestAttempt
                            ? 'Saat ini'
                            : formatDate(historyItem.date)}
                    </p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                    <div className="flex flex-row items-end">
                        <p className="font-bold text-white text-2xl">
                            {Number.isInteger(historyItem.score)
                                ? historyItem.score
                                : historyItem.score.toFixed(2)}
                        </p>
                        <p className="font-bold">/100</p>
                    </div>

                    {historyItem.score_change !== null &&
                        historyItem.score_change !== 0 && (
                            <p
                                className={cn(
                                    'font-medium text-sm',
                                    historyItem.score_change > 0
                                        ? 'text-[#2AC079]'
                                        : 'text-[#EB5D49]'
                                )}>
                                {historyItem.score_change > 0 ? '+' : ''}
                                {historyItem.score_change} poin
                            </p>
                        )}
                </div>
            </div>

            {!isLastestAttempt && (
                <div className="w-full flex justify-center">
                    <a
                        className="cursor-pointer text-[#B6A6F3] text-xs text-semibold"
                        href={`/latihan/${slug}/report/${historyItem.id}`}>
                        Lihat Detail
                    </a>
                </div>
            )}
        </div>
    );
};

export default ExerciseHistory;
