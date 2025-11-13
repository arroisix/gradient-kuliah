import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import KuisIcon from 'dashboard/assets/KuisIcon';

const DashboardQuizIcon = () => {
    const { data } = useGetConfigQuery();

    if (data?.configs.is_tryout_campaign_active) {
        return (
            <>
                <style>
                    {`
                        @keyframes shimmer {
                            0% {
                                background-position: -200% 0;
                            }
                            100% {
                                background-position: 200% 0;
                            }
                        }
                    `}
                </style>
                <div className="relative w-[44px] h-[49px]">
                    <div className="absolute -top-2 -right-2 z-10 scale-75 origin-top-right">
                        {/* Outer wrapper with gradient border */}
                        <div
                            className="p-[1px] rounded-lg relative overflow-hidden"
                            style={{
                                background:
                                    'linear-gradient(90deg, #7264EB 0%, #FFEAAB 100%)',
                                transform: 'rotate(6deg)'
                            }}>
                            {/* Shimmer effect overlay - subtle */}
                            <div
                                className="absolute inset-0 pointer-events-none z-20"
                                style={{
                                    background:
                                        'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.5) 30%, transparent 40%)',
                                    backgroundSize: '200% 100%',
                                    animation:
                                        'shimmer 1.5s ease-in-out infinite'
                                }}
                            />
                            {/* Inner content with purple background */}
                            <div
                                className="px-3 py-1 rounded-[7px] text-white text-[10px] font-bold whitespace-nowrap relative"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #36236A 0%, #6C5096 65%, #494BA0 90%)'
                                }}>
                                UTS & UAS
                            </div>
                        </div>
                    </div>
                    <KuisIcon width={44} height={49} />
                </div>
            </>
        );
    }

    return <KuisIcon width={54} height={59} />;
};

export default DashboardQuizIcon;
