import Button from 'commons/components/elements/Button';
import LeaderboardCard from './LeaderboardCard';
import { RefreshCcw } from 'lucide-react';
import {
    useGetExerciseDetailV2Query,
    useGetExerciseLeaderboardQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import Skeleton from 'commons/components/elements/Skeleton';
import { useWindowSize } from 'usehooks-ts';
import { cn } from 'commons/utils';

const Leaderboard = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { width } = useWindowSize();

    const { data: leaderboard, isFetching } = useGetExerciseLeaderboardQuery(
        { exercise_slug: slug as string },
        {
            skip: !slug
        }
    );

    if (isFetching || !leaderboard) {
        return (
            <div className="mb-16">
                <Skeleton
                    isCustomSize
                    className="h-[350px] lg:h-[150px] w-full pb-16"
                />
            </div>
        );
    }

    if (leaderboard.data.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 pb-16">
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-xl text-white">Leaderboard</h2>
                <p className="text-sm text-[#8B8FA3]">
                    Daftar peserta dengan skor tertinggi
                </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 w-full relative">
                {leaderboard?.data?.slice(0, 3).map((item) => (
                    <LeaderboardCard
                        key={item.rank}
                        rank={item.rank}
                        username={item.student.username}
                        university={item.university_name}
                        score={item.score}
                        isCurrentUser={item.is_current_user}
                    />
                ))}
                <svg
                    className="absolute inset-0 m-auto pointer-events-none bottom-10"
                    width={
                        width < 425
                            ? '300'
                            : width < 768
                            ? '400'
                            : width < 1028
                            ? '750'
                            : '910'
                    }
                    height={width < 768 ? '175' : width < 1028 ? '200' : '250'}
                    viewBox="0 0 910 259"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ zIndex: 10 }}>
                    <g opacity="0.5" filter="url(#filter0_f_40005816_61137)">
                        <ellipse
                            cx="455"
                            cy="147.5"
                            rx="43.5"
                            ry="351"
                            transform="rotate(-90 455 147.5)"
                            fill="#494BA0"
                        />
                    </g>
                    <defs>
                        <filter
                            id="filter0_f_40005816_61137"
                            x="0"
                            y="0"
                            width="910"
                            height="295"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB">
                            <feFlood
                                floodOpacity="0"
                                result="BackgroundImageFix"
                            />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                            />
                            <feGaussianBlur
                                stdDeviation="52"
                                result="effect1_foregroundBlur_40005816_61137"
                            />
                        </filter>
                    </defs>
                </svg>
            </div>
        </div>
    );
};

export const LeaderboardReport = () => {
    const router = useRouter();
    const { slug, exerciseProgressId } = router.query;
    const { width } = useWindowSize();

    const { data: exercise } = useGetExerciseDetailV2Query(
        {
            exercise_slug: slug as string,
            exercise_progress_id: exerciseProgressId as string
        },
        {
            skip: !slug
        }
    );

    const { data: leaderboard, isFetching: isFetchingLeaderboard } =
        useGetExerciseLeaderboardQuery(
            { exercise_slug: slug as string },
            {
                skip: !slug
            }
        );

    const onRetry = (): void => {
        const firstProblemId = exercise?.first_problemset?.first_problem_id;
        if (firstProblemId) {
            router.push(
                `/latihan/${slug}/${exercise.first_problemset?.id}/${firstProblemId}`
            );
        }
    };

    return (
        <div className="flex flex-col gap-4 relative lg:w-[700px]">
            {isFetchingLeaderboard || !leaderboard ? (
                <Skeleton isCustomSize className="w-full h-80" />
            ) : (
                <>
                    {leaderboard.data.length > 0 && (
                        <>
                            {leaderboard.data.map((item) => (
                                <LeaderboardCard
                                    key={item.rank}
                                    rank={item.rank}
                                    username={item.student.username}
                                    university={item.university_name}
                                    score={item.score}
                                    isCurrentUser={item.is_current_user}
                                />
                            ))}
                            <svg
                                className="absolute inset-0 m-auto pointer-events-none bottom-[150px] lg:bottom-[240px]"
                                width={
                                    width < 425
                                        ? '300'
                                        : width < 768
                                        ? '400'
                                        : width < 1024
                                        ? '700'
                                        : width < 1440
                                        ? '400'
                                        : '470'
                                }
                                viewBox="0 0 910 259"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ zIndex: 10 }}>
                                <g
                                    opacity="0.5"
                                    filter="url(#filter0_f_40005816_61137)">
                                    <ellipse
                                        cx="455"
                                        cy="147.5"
                                        rx="43.5"
                                        ry="351"
                                        transform="rotate(-90 455 147.5)"
                                        fill="#494BA0"
                                    />
                                </g>
                                <defs>
                                    <filter
                                        id="filter0_f_40005816_61137"
                                        x="0"
                                        y="0"
                                        width="910"
                                        height="295"
                                        filterUnits="userSpaceOnUse"
                                        colorInterpolationFilters="sRGB">
                                        <feFlood
                                            floodOpacity="0"
                                            result="BackgroundImageFix"
                                        />
                                        <feBlend
                                            mode="normal"
                                            in="SourceGraphic"
                                            in2="BackgroundImageFix"
                                            result="shape"
                                        />
                                        <feGaussianBlur
                                            stdDeviation="52"
                                            result="effect1_foregroundBlur_40005816_61137"
                                        />
                                    </filter>
                                </defs>
                            </svg>
                        </>
                    )}
                </>
            )}

            <div
                className={cn(
                    'flex flex-col gap-3 relative z-10',
                    !isFetchingLeaderboard &&
                        !!leaderboard &&
                        leaderboard.data.length > 0 &&
                        'pt-4'
                )}>
                <Button
                    variant="primary"
                    className="w-full text-center"
                    href={`/latihan/`}
                    size="large">
                    Selesai
                </Button>
                <Button
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={onRetry}
                    size="large">
                    <RefreshCcw size={20} />
                    <span>Coba Lagi</span>
                </Button>
            </div>
        </div>
    );
};

export default Leaderboard;
