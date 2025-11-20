import React from 'react';
import { cn } from 'commons/utils';

interface LeaderboardCardProps {
    rank: number;
    username: string;
    university: string;
    score: number;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
    rank,
    username,
    university,
    score
}) => {
    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]';
            case 2:
                return 'bg-gradient-to-br from-[#C0C0C0] to-[#808080]';
            case 3:
                return 'bg-gradient-to-br from-[#CD7F32] to-[#8B4513]';
            default:
                return 'bg-[#2A2D3A]';
        }
    };

    const getBorderColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'border-[#FFD700]';
            case 2:
                return 'border-[#C0C0C0]';
            case 3:
                return 'border-[#CD7F32]';
            default:
                return 'border-[#3A3D4A]';
        }
    };

    return (
        <div
            className={cn(
                'flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.02] w-full z-[2] bg-black',
                getBorderColor(rank)
            )}>
            {/* Rank Badge */}
            <div className="flex items-center justify-center flex-shrink-0">
                <div className="relative">
                    <div
                        className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg',
                            getRankColor(rank)
                        )}>
                        {rank}
                    </div>
                    {/* Medal/Ribbon decoration for top 3 */}
                    {rank <= 3 && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                            <svg
                                width="24"
                                height="12"
                                viewBox="0 0 24 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 0L8 12L12 10L16 12L12 0Z"
                                    fill={
                                        rank === 1
                                            ? '#FFD700'
                                            : rank === 2
                                            ? '#C0C0C0'
                                            : '#CD7F32'
                                    }
                                    opacity="0.8"
                                />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-base truncate">
                    {username}
                </h3>
                <p className="text-sm text-[#8B8FA3] truncate">{university}</p>
            </div>

            {/* Score */}
            <div className="text-3xl font-bold text-white flex-shrink-0">
                {score}
            </div>
        </div>
    );
};

export default LeaderboardCard;
