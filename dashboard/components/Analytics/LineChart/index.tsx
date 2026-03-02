import React, { useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
    ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { cn, formatDate } from 'commons/utils';
import { useGetLineChartQuery } from 'courses/redux/api/learningExperienceApi';
import { EmptyChart } from '../EmptyChart';
import { CopilotSolidIcon } from 'commons/components/elements/Icons/CopilotSolidIcon';
import { StarsSolidIcon } from 'commons/components/elements/Icons/StarsSolidIcon';
import { CourseDropdown } from './CourseDropdown';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function LineChart(): JSX.Element {
    const [selectedCourseId, setSelectedCourseId] = useState('');

    const {
        data: response,
        isLoading: isLoadingChart,
        isFetching: isFetchingChart
    } = useGetLineChartQuery({
        course_id: selectedCourseId
    });

    const { labels, data } = useMemo(() => {
        if (!response) {
            return { labels: [], data: [] };
        }

        const labels = [];
        const data = [];
        for (const v of response.line_chart_data) {
            const formattedLabel = `${v.title}_${v.latest_started_at}`;
            labels.push(formattedLabel);
            data.push(v.average_score);
        }

        return { labels, data };
    }, [response]);

    const chartData: ChartData<'line'> = useMemo(() => {
        if (!response) {
            return { labels: [], datasets: [] };
        }

        return {
            labels: labels.map((label) => {
                const regex = /^(.*?)\s*#(\d+)\s*\((.*?)\)$/;
                const [title, isoStr] = label.split('_');

                const match = title.match(regex);
                let formattedTitle = 'Unknown';
                if (match) {
                    const tryoutNumber = match[2];
                    const tryoutAccessType = match[3];

                    const tryoutWord = match[1].toLowerCase();
                    const formattedTryoutWord = (
                        tryoutWord.includes('tryout') ? 'TO' : ''
                    ).toUpperCase();

                    formattedTitle = `${formattedTryoutWord} ${tryoutNumber} (${tryoutAccessType})`;
                }

                return [formattedTitle, formatDate(isoStr)];
            }),
            datasets: [
                {
                    label: 'Skor Rata-rata mu',
                    data: data,
                    tension: 0.4, // makes the line curved
                    backgroundColor: 'rgba(95,43,206,0.2)', // background fill
                    borderColor: '#B6A6F3', // line color
                    borderWidth: 2, // line width
                    pointBackgroundColor: '#FFFFFF', // dot for each data point
                    pointBorderColor: '#FFFFFF', // border around the dot
                    pointRadius: 5, // dot size
                    hoverRadius: 7, // dot size when hover
                    fill: true
                },
                {
                    label: 'Tren saat ini',
                    data: response.trend_scores,
                    borderColor: '#fcd34d',
                    borderDash: [5, 5],
                    // no dots on the trend line
                    pointRadius: 0,
                    borderWidth: 2,
                    // straight line, no curves
                    tension: 0
                }
            ]
        };
    }, [response, data, labels]);

    const chartOptions: ChartOptions<'line'> = useMemo(() => {
        if (!response) {
            return {};
        }

        const options: ChartOptions<'line'> = {
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
                    ticks: {
                        color: '#666666',
                        font: { lineHeight: 1.75 }
                    }
                },
                y: {
                    grid: { color: '#4B4E5F', drawTicks: false },
                    ticks: { color: '#666666', maxTicksLimit: 5 }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    displayColors: false, // hides the color box in the tooltip

                    borderColor: '#666666',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 12,

                    titleFont: { size: 14, weight: 400, lineHeight: 1.6 },
                    titleMarginBottom: 8,

                    bodyFont: { size: 12, weight: 600, lineHeight: 1.25 },

                    footerFont: { size: 12, weight: 600, lineHeight: 1.25 },
                    footerMarginTop: 4,
                    footerColor: function () {
                        return '#F2C04C';
                    },

                    callbacks: {
                        label: function (ctx) {
                            return `Skor rata-rata mu: ${ctx.formattedValue}`;
                        },
                        labelTextColor: function () {
                            return '#B6A6F3';
                        },
                        footer: function (ctx) {
                            if (ctx.length === 0) {
                                return '';
                            }

                            const trendScore =
                                response.trend_scores[ctx[0].dataIndex];
                            return `Tren saat ini: ${trendScore}`;
                        }
                    }
                }
            }
        };

        return options;
    }, [response]);

    if (isLoadingChart) {
        return (
            <div
                className={cn(
                    'animate-pulse bg-[#333333] rounded-2xl w-full max-w-[343px] min-h-[384px] mx-auto',
                    'lg:col-span-7 lg:max-w-full lg:max-h-full lg:mx-0'
                )}></div>
        );
    }

    if (
        !response ||
        response.line_chart_data.length === 0 ||
        response.trend_scores.length === 0
    ) {
        return (
            <div
                className={cn(
                    'bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl w-full max-w-[343px] mx-auto space-y-6',
                    'lg:col-span-7 lg:max-w-full lg:mx-0 lg:space-y-0 lg:px-6 lg:flex lg:flex-col lg:justify-between lg:gap-6'
                )}>
                <div
                    className={cn(
                        'flex flex-col gap-3',
                        'lg:justify-between lg:flex-row lg:gap-0'
                    )}>
                    <div className="space-y-1">
                        <h2 className="text-white font-semibold leading-[140%]">
                            Perjalanan Skor Try Out Kamu
                        </h2>

                        <p className="text-[#999999] text-sm leading-[160%]">
                            Lihat gimana Skor Rata-rata mu mu dari TO pertama ke
                            TO terakhir
                        </p>
                    </div>

                    <CourseDropdown
                        selectedCourseId={selectedCourseId}
                        setSelectedCourseId={setSelectedCourseId}
                    />
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
                'bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl w-full max-w-[343px] mx-auto space-y-6',
                'lg:col-span-7 lg:max-w-full lg:mx-0 lg:space-y-0 lg:px-6 lg:flex lg:flex-col lg:justify-between lg:gap-6'
            )}>
            <div className="space-y-6">
                <div
                    className={cn(
                        'flex flex-col gap-3',
                        'lg:justify-between lg:flex-row lg:gap-0'
                    )}>
                    <div className="space-y-1">
                        <h2 className="text-white font-semibold leading-[140%]">
                            Perjalanan Skor Try Out Kamu
                        </h2>

                        <p className="text-[#999999] text-sm leading-[160%]">
                            Lihat gimana Skor Rata-rata mu mu dari TO pertama ke
                            TO terakhir
                        </p>
                    </div>

                    <CourseDropdown
                        selectedCourseId={selectedCourseId}
                        setSelectedCourseId={setSelectedCourseId}
                    />
                </div>

                {isFetchingChart ? (
                    <div className="animate-pulse bg-[#333333] aspect-[4/3] rounded-xl"></div>
                ) : (
                    <div className="aspect-[4/3]">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                )}
            </div>

            <div className="bg-[#20222E] border border-[#282B3C] px-3 py-2 rounded-xl flex justify-between items-center gap-2">
                <StarsSolidIcon className="shrink-0 text-[#F2C04C] w-4 h-4" />
                <p className="text-white text-sm leading-[160%]">
                    Copilot bisa jelasin naik turun Skor Rata-rata mu mu.
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

export { LineChart };
