import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    SubTitle,
    ChartOptions,
    ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { cn } from 'commons/utils';
import { useGetCompetitionMapQuery } from 'courses/redux/api/learningExperienceApi';
import { EmptyChart } from './EmptyChart';
import { CopilotSolidIcon } from 'commons/components/elements/Icons/CopilotSolidIcon';
import { StarsSolidIcon } from 'commons/components/elements/Icons/StarsSolidIcon';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    SubTitle
);

function CompetitionMap(): JSX.Element {
    const { data: competitionMap, isLoading } = useGetCompetitionMapQuery();

    const { labels, data } = useMemo(() => {
        if (!competitionMap) {
            return { labels: [], data: [] };
        }

        const labels = [];
        const data = [];
        for (const v of competitionMap.histogram) {
            labels.push(v.range);
            data.push(v.total_participants);
        }

        return { labels, data };
    }, [competitionMap]);

    const chartData: ChartData<'bar'> = useMemo(() => {
        if (!competitionMap) {
            return { labels: [], datasets: [] };
        }

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Jumlah Peserta',
                    data: data,
                    borderRadius: { topLeft: 8, topRight: 8 },
                    borderSkipped: 'bottom',
                    hoverBackgroundColor: '#36236A',
                    backgroundColor: (context) => {
                        if (
                            competitionMap.passing_grade &&
                            context.dataIndex ===
                                competitionMap.passing_grade_bar_index
                        ) {
                            return '#B6A6F3';
                        }
                        return '#5F2BCE';
                    },
                    borderColor: (context) => {
                        return context.dataIndex ===
                            competitionMap.user_bar_index
                            ? '#F2C04C'
                            : 'transparent';
                    },
                    borderWidth: (context) => {
                        return context.dataIndex ===
                            competitionMap.user_bar_index
                            ? 2
                            : 0;
                    }
                }
            ]
        };
    }, [competitionMap, data, labels]);

    const chartOptions: ChartOptions<'bar'> = useMemo(() => {
        if (!competitionMap) {
            return {};
        }

        const options: ChartOptions<'bar'> = {
            responsive: true,
            maintainAspectRatio: false,
            // make cursor pointer on hover
            onHover: (event, chartElement) => {
                if (event.native?.target) {
                    const target = event.native.target as HTMLElement;
                    target.style.cursor =
                        chartElement.length > 0 ? 'pointer' : 'default';
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#737373' }
                },
                y: {
                    display: true,
                    ticks: {
                        display: false,
                        maxTicksLimit: 5
                    },
                    grid: { color: '#4B4E5F', drawTicks: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    // hides the color box in the tooltip
                    displayColors: false,

                    borderColor: '#666666',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 12,

                    titleAlign: 'center',
                    titleFont: { size: 14, weight: 600 },
                    bodyAlign: 'center',
                    bodyFont: { size: 12, weight: 500 },

                    callbacks: {
                        beforeTitle: function (items) {
                            if (items.length === 0) {
                                return '';
                            }

                            const item = items[0];
                            if (
                                item.dataIndex === competitionMap.user_bar_index
                            ) {
                                return 'Nilai Kamu';
                            }

                            return 'Skor Try Out';
                        },
                        title: function (items) {
                            if (items.length === 0) {
                                return '';
                            }

                            const item = items[0];
                            if (
                                item.dataIndex === competitionMap.user_bar_index
                            ) {
                                return `${competitionMap.user_score}`;
                            }

                            return item.label;
                        },
                        label: function (ctx) {
                            return `Dari ${ctx.formattedValue} peserta`;
                        }
                    }
                }
            }
        };

        return options;
    }, [competitionMap]);

    if (isLoading) {
        return (
            <div
                className={cn(
                    'animate-pulse bg-[#333333] rounded-2xl w-full max-w-[343px] h-96 mx-auto',
                    'lg:col-span-5 lg:max-w-full lg:mx-0'
                )}></div>
        );
    }

    if (!competitionMap) {
        return (
            <div
                className={cn(
                    'bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl w-full max-w-[343px] mx-auto',
                    'lg:col-span-5 lg:max-w-full lg:mx-0 lg:px-6'
                )}>
                <EmptyChart />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl w-full max-w-[343px] mx-auto',
                'lg:col-span-5 lg:max-w-full lg:mx-0 lg:px-6'
            )}>
            <h2 className="text-white font-semibold leading-[140%] mb-1">
                Radar Kekuatan
            </h2>

            <p className="text-[#999999] text-sm leading-[160%] mb-6">
                Posisimu vs {competitionMap.total_participants} pesaing
            </p>

            <div className="aspect-[4/3]">
                <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
                <div className="flex flex-col gap-1 items-center">
                    <div className="w-3 h-3 bg-transparent border-2 border-[#F2C04C] rounded-sm"></div>
                    <span className="text-[#999999] font-medium text-xs leading-tight">
                        Posisimu
                    </span>
                </div>
                <div
                    className={cn(
                        'flex flex-col gap-1 items-center',
                        competitionMap.passing_grade ? '' : 'opacity-20'
                    )}>
                    <div className="w-3 h-3 bg-[#B6A6F3] rounded-sm"></div>
                    <span className="text-[#999999] font-medium text-xs leading-tight">
                        Passing Grade
                    </span>
                </div>
            </div>

            <div className="bg-[#20222E] border border-[#282B3C] p-3 rounded-xl flex justify-between items-center mt-6">
                <div className="flex flex-col gap-1">
                    <span className="text-[#999999] text-sm leading-[160%]">
                        Status
                    </span>

                    {competitionMap.passing_grade ? (
                        <span className="text-white font-semibold leading-[140%]">
                            {(competitionMap.user_score ?? 0) >=
                            competitionMap.passing_grade
                                ? 'Aman'
                                : 'Belum Aman'}
                        </span>
                    ) : (
                        <div className="w-fit h-[22px] grid place-items-center">
                            <span className="bg-white w-2 h-0.5"></span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    {competitionMap.passing_grade ? (
                        <>
                            <span
                                className={cn(
                                    'font-semibold text-2xl leading-tight text-right',
                                    (competitionMap.user_score ?? 0) >=
                                        competitionMap.passing_grade
                                        ? 'text-[#03AC5C]'
                                        : 'text-[#F2C04C]'
                                )}>
                                {(competitionMap.user_score ?? 0) >=
                                competitionMap.passing_grade
                                    ? '+'
                                    : ''}
                                {Math.abs(
                                    competitionMap.passing_grade -
                                        (competitionMap.user_score ?? 0)
                                ).toFixed()}
                            </span>

                            <span className="text-[#999999] font-medium text-xs leading-tight">
                                {(competitionMap.user_score ?? 0) >=
                                competitionMap.passing_grade
                                    ? 'Lebih Poin'
                                    : 'Kurang Poin'}
                            </span>
                        </>
                    ) : (
                        <div className="w-fit h-[30px] grid place-items-center">
                            <span className="bg-[#999999] w-3 h-0.5"></span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#20222E] border border-[#282B3C] px-3 py-2 rounded-xl flex justify-between items-center gap-2 mt-6">
                <StarsSolidIcon className="shrink-0 text-[#F2C04C] w-4 h-4" />
                <p className="text-white text-sm leading-[160%]">
                    Copilot bisa bantu baca posisimu.
                </p>
                <button
                    type="button"
                    className="shrink-0 bg-[#5F2BCE] hover:opacity-75 transition-all rounded-full w-8 h-8 grid place-items-center">
                    <CopilotSolidIcon className="text-white w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export { CompetitionMap };
