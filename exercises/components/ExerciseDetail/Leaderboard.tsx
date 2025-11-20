import LeaderboardCard from './LeaderboardCard';

const Leaderboard = () => {
    // Mock data - replace with actual API data later
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
                        height: '200px',
                        filter: 'blur(60px)',
                        opacity: 0.7
                    }}
                />
            </div>
        </div>
    );
};

export default Leaderboard;
