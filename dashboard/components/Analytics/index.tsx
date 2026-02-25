import { useAuth } from 'authentication/contexts/AuthProvider';
import { cn, getUTBKRemainingDays } from 'commons/utils';
import { SpiderChartCard } from './SpiderChartCard';
import { AdmissionChance } from './AdmissionChance';
import { useGetStudentTargetInstitutionsQuery } from 'dashboard/redux/api/dashboardApi';
import { useGetStudentTryoutLatestResultQuery } from 'exercises/redux/api/exercisesApi';
import LoadingIndicator from './LoadingIndicator';
import { AnalyticsWall } from './AnalyticsWall';
import SetTargetDrawer from 'exercises/components/Entrypoint/SetTargetDrawer';
import { CompetitionMap } from './CompetitionMap';

function Analytics(): JSX.Element {
    const { profile } = useAuth();
    const remainingDays = getUTBKRemainingDays();

    const { data: targetInstitutions, isLoading: isLoadingTarget } =
        useGetStudentTargetInstitutionsQuery();

    const { data: tryoutLatest, isLoading: isLoadingTryoutLatest } =
        useGetStudentTryoutLatestResultQuery();

    if (isLoadingTarget || isLoadingTryoutLatest) {
        return <LoadingIndicator />;
    }

    if (
        targetInstitutions?.length === 0 ||
        !tryoutLatest?.is_has_latest_result
    ) {
        return (
            <SetTargetDrawer>
                <div className="w-full h-full grid place-items-center py-6 px-4">
                    <AnalyticsWall />
                </div>
            </SetTargetDrawer>
        );
    }

    return (
        <div className={cn('m-4', 'lg:mx-12 lg:my-8')}>
            <div className="w-full max-w-[934px] mx-auto">
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

                <div
                    className={cn(
                        'space-y-6 mb-6',
                        'lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6'
                    )}>
                    <div
                        className={cn(
                            'w-full max-w-[343px] mx-auto',
                            'lg:col-span-8 lg:max-w-full lg:mx-0'
                        )}>
                        <SetTargetDrawer>
                            <AdmissionChance />
                        </SetTargetDrawer>
                    </div>

                    <SpiderChartCard />
                </div>

                <div
                    className={cn(
                        'space-y-6',
                        'lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6'
                    )}>
                    <div
                        className={cn(
                            'bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl w-full max-w-[343px] mx-auto',
                            'lg:col-span-7 lg:max-w-full lg:mx-0 lg:px-6'
                        )}></div>
                    <CompetitionMap />
                </div>
            </div>
        </div>
    );
}

export { Analytics };
