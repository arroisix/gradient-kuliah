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
import { CourseDropdown } from './CourseDropdown';
import { CopilotSummarizer } from '../CopilotSummarizer';

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

// format tryout title into "TO 1 (Gratis)"
function formatTryoutTitle(title: string): string {
    const regex = /^(.*?)\s*#(\d+)\s*\((.*?)\)$/;
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

    return formattedTitle;
}

// find highest and lowest tryout
function findMinMaxTryout(data: GetLineChartResponse['line_chart_data']): {
    minTryout: string;
    maxTryout: string;
} {
    let minTryout = '';
    let minScore = 0;

    let maxTryout = '';
    let maxScore = 0;

    for (const v of data) {
        if (minScore === 0 || v.average_score < minScore) {
            minScore = v.average_score;
            minTryout = formatTryoutTitle(v.title);
        }

        if (maxScore === 0 || v.average_score > maxScore) {
            maxScore = v.average_score;
            maxTryout = formatTryoutTitle(v.title);
        }
    }

    return { minTryout, maxTryout };
}

function generateContext(data: GetLineChartResponse): string {
    const { line_chart_data, trend_line } = data;
    const { minTryout, maxTryout } = findMinMaxTryout(line_chart_data);

    return `
    - Jenis grafik: Grafik area dengan trendline
    - Sumbu x: Nama dan tanggal pengerjaan tryout
    - Sumbu y: Rata-rata skor tryout untuk setiap percobaan tryout beserta skor trend

    Data grafik area:
    ${line_chart_data.map(
        (v, index) =>
            `- ${formatTryoutTitle(v.title)}: ${v.average_score}${
                line_chart_data.length - 1 === index ? '' : '\n'
            }`
    )}

    Data trendline:
    ${line_chart_data.map(
        (v, index) =>
            `- ${formatTryoutTitle(v.title)}: ${
                trend_line.trend_scores.length < line_chart_data.length
                    ? index > trend_line.trend_scores.length - 1
                        ? 'Unknown'
                        : trend_line.trend_scores[index]
                    : trend_line.trend_scores[index]
            }${line_chart_data.length - 1 === index ? '' : '\n'}`
    )}

    - Nilai tryout tertinggi: ${maxTryout}
    - Nilai tryout terendah: ${minTryout}
    `;
}

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
                const [title, isoStr] = label.split('_');
                const formattedTitle = formatTryoutTitle(title);
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
                    data: response.trend_line.trend_scores,
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
                    ticks: { color: '#666666', maxTicksLimit: 5 },
                    beginAtZero: true
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
                        title: function (ctx) {
                            if (ctx.length === 0) {
                                return 'Unknown';
                            }
                            const value = ctx[0];
                            return value.label.split(',')[0];
                        },
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
                                response.trend_line.trend_scores[
                                    ctx[0].dataIndex
                                ];
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
        response.trend_line.trend_scores.length === 0
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
                'relative bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl w-full max-w-[343px] mx-auto space-y-6',
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

            <CopilotSummarizer
                context={generateContext(response)}
                chart_type="line"
            />
        </div>
    );
}

export { LineChart };
