import Button from 'commons/components/elements/Button';
import LeaderboardCard from './LeaderboardCard';
import { RefreshCcw } from 'lucide-react';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';

const Leaderboard = () => {
    const leaderboardData = [
        {
            rank: 1,
            username: 'ahmad912',
            university: 'Institut Teknologi Bandung',
            score: 95
        },
        {
            rank: 2,
            username: 'sarsati_',
            university: 'Universitas Indonesia',
            score: 90
        },
        {
            rank: 3,
            username: 'budayz',
            university: 'Universitas Indonesia',
            score: 85
        }
    ];

    return (
        <div className="flex flex-col gap-4 pb-16">
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-xl text-white">Leaderboard</h2>
                <p className="text-sm text-[#8B8FA3]">
                    Daftar peserta dengan skor tertinggi
                </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 w-full relative">
                {leaderboardData.map((item) => (
                    <LeaderboardCard
                        key={item.rank}
                        rank={item.rank}
                        username={item.username}
                        university={item.university}
                        score={item.score}
                    />
                ))}
                <div
                    className="absolute left-0 right-0 bottom-0 h-1 z-[1]"
                    style={{
                        background: `radial-gradient(ellipse 150% 100% at bottom, #494BA0 0%, transparent 70%)`,
                        height: '100px',
                        filter: 'blur(60px)',
                        opacity: 0.7
                    }}
                />
            </div>
        </div>
    );
};

export const LeaderboardReport = () => {
    // Mock data - replace with actual API data later
    const router = useRouter();
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

    const leaderboardData = [
        {
            rank: 1,
            username: 'ahmad912',
            university: 'Institut Teknologi Bandung',
            score: 95
        },
        {
            rank: 2,
            username: 'sarsati_',
            university: 'Universitas Indonesia',
            score: 90
        },
        {
            rank: 3,
            username: 'budayz',
            university: 'Universitas Indonesia',
            score: 85
        }
    ];

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
            {leaderboardData.map((item) => (
                <LeaderboardCard
                    key={item.rank}
                    rank={item.rank}
                    username={item.username}
                    university={item.university}
                    score={item.score}
                />
            ))}
            <div
                className="absolute left-auto right-auto bottom-auto top-auto h-1 z-[1]"
                style={{
                    background: `radial-gradient(ellipse 150% 100% at bottom, #494BA0 0%, transparent 70%)`,
                    height: '100px',
                    filter: 'blur(60px)',
                    opacity: 0.7
                }}
            />
            <div className="space-y-3 pt-4 flex flex-col gap-2">
                <Button
                    variant="primary"
                    className="w-full text-center"
                    href={`/latihan/`}>
                    Selesai
                </Button>
                <Button
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={onRetry}>
                    <RefreshCcw size={20} />
                    <span>Coba Lagi</span>
                </Button>
            </div>
        </div>
    );
};

export default Leaderboard;
