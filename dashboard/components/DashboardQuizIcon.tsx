import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import KuisIcon from 'dashboard/assets/KuisIcon';

const DashboardQuizIcon = () => {
    const { data } = useGetConfigQuery();

    if (data?.configs.is_tryout_campaign_active) {
        return (
            <div className="relative w-[54px] h-[59px]">
                <div className="absolute -top-2 -right-1.5 z-10 scale-75 origin-top-right">
                    {/* Outer wrapper with gradient border */}
                    <div
                        className="p-[1px] rounded-lg"
                        style={{
                            background:
                                'linear-gradient(90deg, #7264EB 0%, #FFEAAB 100%)',
                            transform: 'rotate(6deg)'
                        }}>
                        {/* Inner content with purple background */}
                        <div
                            className="px-4 py-1 rounded-[7px] text-white text-[10px] font-bold whitespace-nowrap"
                            style={{
                                background:
                                    'linear-gradient(135deg, #36236A 0%, #6C5096 65%, #494BA0 90%)'
                            }}>
                            UTS & UAS
                        </div>
                    </div>
                </div>
                <KuisIcon width={54} height={59} />
            </div>
        );
    }

    return <KuisIcon width={64} height={69} />;
};

export default DashboardQuizIcon;
