import { useAuth } from 'authentication/contexts/AuthProvider';
import { cn, getUTBKRemainingDays } from 'commons/utils';
import { SpiderChartCard } from './SpiderChartCard';

function Analytics(): JSX.Element {
    const { profile } = useAuth();
    const remainingDays = getUTBKRemainingDays();

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div
                className={cn(
                    'flex flex-col gap-1 mb-8',
                    'lg:flex-row lg:justify-between lg:items-center'
                )}>
                <h1 className="text-white font-bold leading-tight text-2xl w-full max-w-[192px] truncate">
                    Halo, {profile?.username}
                </h1>

                <span
                    className={cn(
                        'text-[#E9D5FF] font-bold text-xs uppercase tracking-[1.1px] leading-[30px]',
                        'lg:text-center'
                    )}>
                    UTBK {remainingDays} hari lagi
                </span>
            </div>

            <div className="flex gap-6">
                <div className="flex-grow"></div>
                <SpiderChartCard />
            </div>
        </div>
    );
}

export { Analytics };
