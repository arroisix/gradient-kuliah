import { useAuth } from 'authentication/contexts/AuthProvider';
import { cn, getUTBKRemainingDays } from 'commons/utils';
import { SpiderChartCard } from './SpiderChartCard';
import { AdmissionChance } from './AdmissionChance';
import { useGetStudentTargetInstitutionsQuery } from 'dashboard/redux/api/dashboardApi';
import { useGetStudentTryoutLatestResultQuery } from 'exercises/redux/api/exercisesApi';
import LoadingIndicator from './LoadingIndicator';
import { AnalyticsWall } from './AnalyticsWall';
import SetTargetDrawer from 'exercises/components/Entrypoint/SetTargetDrawer';

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
                <AnalyticsWall />
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
                        'space-y-6',
                        'lg:space-y-0 lg:flex lg:justify-center lg:gap-6'
                    )}>
                    <SetTargetDrawer>
                        <AdmissionChance />
                    </SetTargetDrawer>

                    <SpiderChartCard />
                </div>
            </div>
        </div>
    );
}

export { Analytics };
