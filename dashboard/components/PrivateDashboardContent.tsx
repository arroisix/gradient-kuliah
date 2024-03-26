import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetDashboardContentQuery } from 'dashboard/redux/api/dashboardApi';
import React from 'react';
import DashboardCard from './DashboardCard';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

const PrivateDashboardContent = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const { data, isLoading } = useGetDashboardContentQuery();
    return (
        <>
            <div className="space-y-4" data-tour="step-1">
                <h4 className="text-lg font-extrabold md:text-xl">
                    Baru Rilis
                </h4>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:gap-6">
                    {isLoading ? (
                        <Skeleton repeat={isMobileBreakpoints ? 2 : 4} />
                    ) : (
                        <>
                            {data?.just_released.map((item) => (
                                <DashboardCard key={item.id} {...item} />
                            ))}
                        </>
                    )}
                </div>
            </div>
            <h4>Kelasku</h4>
            <div className="space-y-4" data-tour="step-2">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Bacaan Untukmu
                    </h4>
                    <Button
                        href="/astronotes#bank-soal"
                        variant="custom"
                        eventName="Click 'Lihat Semua' in Bank Soal Section"
                        className="text-xs text-black bg-white whitespace-nowrap">
                        Lihat Semua
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 xl:gap-6">
                    {isLoading ? (
                        <Skeleton repeat={isMobileBreakpoints ? 2 : 5} />
                    ) : (
                        <>
                            {data?.book_recommendation.map((item) => (
                                <DashboardCard key={item.id} {...item} />
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className="space-y-4" data-tour="step-2">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Kelas Untukmu
                    </h4>
                    <Button
                        href="/astronotes#bank-soal"
                        variant="custom"
                        eventName="Click 'Lihat Semua' in Bank Soal Section"
                        className="text-xs text-black bg-white whitespace-nowrap">
                        Lihat Semua
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 xl:gap-6">
                    {isLoading ? (
                        <Skeleton repeat={isMobileBreakpoints ? 2 : 5} />
                    ) : (
                        <>
                            {data?.book_recommendation.map((item) => (
                                <DashboardCard key={item.id} {...item} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default PrivateDashboardContent;
