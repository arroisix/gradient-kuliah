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
    ChartData,
    ScriptableContext
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { cn } from 'commons/utils';
import { useGetCompetitionMapQuery } from 'courses/redux/api/learningExperienceApi';
import { EmptyChart } from './EmptyChart';
import { CopilotSummarizer } from './CopilotSummarizer';
import { InfoSolidIcon } from 'commons/components/elements/Icons/InfoSolidIcon';
import { ThumbsUpSolidIcon } from 'commons/components/elements/Icons/ThumbsUpSolidIcon';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    SubTitle
);

function generateContext(data: GetCompetitionMapResponse): string {
    const {
        histogram,
        total_participants,
        passing_grade,
        user_score,
        user_position
    } = data;

    return `
    - Jenis grafik: Histogram
    - Sumbu x: Rentang skor
    - Sumbu y: Total peserta tiap rentang skor

    Data sumbu x dan y:
    ${histogram.map(
        (v, index) =>
            `- ${v.range} (rentang skor): ${
                v.total_participants
            } total peserta${histogram.length - 1 === index ? '' : '\n'}`
    )}

    - Total peserta: ${total_participants}
    - Passing grade: ${passing_grade}
    - Skor user saat ini: ${user_score}
    ${
        user_score && passing_grade
            ? `- Skor user saat ini ${
                  user_score >= passing_grade ? 'lebih besar' : 'lebih kecil'
              } dari passing grade sebesar ${Math.abs(
                  passing_grade - user_score
              ).toFixed()} poin`
            : ''
    }
    - Peringkat user diantara semua user berdasarkan skornya: ${user_position}
    `;
}

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
                    backgroundColor: (context: ScriptableContext<'bar'>) => {
                        if (
                            !competitionMap.passing_grade ||
                            context.dataIndex !==
                                competitionMap.passing_grade_bar_index
                        ) {
                            return '#5F2BCE';
                        }

                        const { ctx, chartArea } = context.chart;
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const element = context.element;

                        if (!chartArea || !element || !element.width) {
                            return '#5331c2';
                        }

                        const leftEdge = element.x - element.width / 2;
                        const rightEdge = element.x + element.width / 2;

                        const gradient = ctx.createLinearGradient(
                            leftEdge,
                            0,
                            rightEdge,
                            0
                        );

                        gradient.addColorStop(0, '#F2C04C');
                        gradient.addColorStop(0.5, '#E48E0D');
                        gradient.addColorStop(1, '#E4B50D');

                        return gradient;
                    },
                    borderColor: (context) => {
                        return context.dataIndex ===
                            competitionMap.user_bar_index
                            ? '#EF7F73'
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
                    titleFont: { size: 12, lineHeight: 1.6 },
                    titleColor: '#FFFFFF',
                    titleMarginBottom: 2,

                    bodyAlign: 'center',
                    bodyFont: { size: 16, weight: 600, lineHeight: 1.4 },
                    bodyColor: '#FFFFFF',

                    callbacks: {
                        title: function () {
                            return 'Jumlah Peserta';
                        },
                        label: function (ctx) {
                            return ctx.formattedValue;
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
                    'animate-pulse bg-[#333333] rounded-2xl w-full max-w-[343px] min-h-[384px] mx-auto',
                    'lg:col-span-5 lg:max-w-full lg:max-h-full lg:mx-0'
                )}></div>
        );
    }

    if (!competitionMap) {
        return (
            <div
                className={cn(
                    'bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl w-full max-w-[343px] min-h-[384px] mx-auto flex flex-col',
                    'lg:col-span-5 lg:max-w-full lg:max-h-full lg:mx-0 lg:px-6'
                )}>
                <div className="space-y-1 mb-6">
                    <h2 className="text-white font-semibold leading-[140%]">
                        Peta Persaingan Skor Try Out
                    </h2>

                    <p className="text-[#999999] text-sm leading-[160%]">
                        Posisimu {'<posisi>'} dari {'<total_peserta>'} peserta
                    </p>
                </div>

                <div className="flex-grow h-full grid place-items-center">
                    <EmptyChart />
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'relative bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl w-full max-w-[343px] mx-auto space-y-6',
                'lg:col-span-5 lg:max-w-full lg:mx-0 lg:px-6 lg:flex lg:flex-col lg:justify-between lg:gap-6'
            )}>
            <div>
                <h2 className="text-white font-semibold leading-[140%] mb-1">
                    Peta Persaingan Skor Try Out
                </h2>

                <p className="text-[#999999] text-sm leading-[160%] mb-6">
                    Posisimu {competitionMap.user_position} dari{' '}
                    {competitionMap.total_participants} peserta
                </p>

                <div className="aspect-[4/3]">
                    <Bar data={chartData} options={chartOptions} />
                </div>

                <div className="flex justify-center items-center gap-4 mt-6">
                    <div className="flex flex-col gap-1 items-center">
                        <div className="w-3 h-3 bg-transparent border-2 border-[#EF7F73] rounded-sm"></div>
                        <span className="text-[#999999] font-medium text-xs leading-tight">
                            Posisimu
                        </span>
                    </div>
                    <div
                        className={cn(
                            'flex flex-col gap-1 items-center',
                            competitionMap.passing_grade ? '' : 'opacity-20'
                        )}>
                        <div className="bg-gradient-to-r from-[#F2C04C] via-[#E48E0D] to-[#E4B50D] rounded-sm w-3 h-3"></div>
                        <span className="text-[#999999] font-medium text-xs leading-tight">
                            Passing Grade
                        </span>
                    </div>
                </div>

                <div className="bg-[#20222E] border border-[#4B4E5F] rounded-xl overflow-hidden mt-6">
                    <div className="bg-[#20222E] py-2 flex justify-center items-center gap-2">
                        {(competitionMap.user_score ?? 0) <
                        (competitionMap.passing_grade ?? 0) ? (
                            <InfoSolidIcon className="shrink-0 text-[#F2C04C] w-4 h-4" />
                        ) : (
                            <ThumbsUpSolidIcon className="shrink-0 text-[#03AC5C] w-4 h-4" />
                        )}

                        <span className="text-white text-xs">
                            {(competitionMap.user_score ?? 0) <
                            (competitionMap.passing_grade ?? 0)
                                ? 'Yuk tingkatkan lagi!'
                                : 'Mantep sih ini!'}
                        </span>
                    </div>

                    <div className="bg-[#282B3C] rounded-xl flex justify-between items-center py-3 px-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[#999999] font-medium text-xs leading-tight">
                                Skor Tryout
                            </span>

                            <span className="text-white font-semibold text-xl leading-[140%] text-center">
                                {competitionMap.user_score}
                            </span>
                        </div>

                        {competitionMap.passing_grade ? (
                            <>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#999999] font-medium text-xs leading-tight">
                                        Passing Grade
                                    </span>

                                    <span className="text-white font-semibold text-xl leading-[140%] text-center">
                                        {competitionMap.passing_grade}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-[#999999] font-medium text-xs leading-tight">
                                        {(competitionMap.user_score ?? 0) >=
                                        competitionMap.passing_grade
                                            ? 'Lebih Poin'
                                            : 'Kurang Poin'}
                                    </span>

                                    <span
                                        className={cn(
                                            'font-semibold text-xl leading-[140%] text-center',
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
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-fit h-[30px] grid place-items-center">
                                    <span className="bg-[#999999] w-3 h-0.5"></span>
                                </div>

                                <div className="w-fit h-[30px] grid place-items-center">
                                    <span className="bg-[#999999] w-3 h-0.5"></span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <CopilotSummarizer
                context={generateContext(competitionMap)}
                chart_type="bar"
            />
        </div>
    );
}

export { CompetitionMap };
