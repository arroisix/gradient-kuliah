import { CopilotSolidIcon } from 'commons/components/elements/Icons/CopilotSolidIcon';
import { SpiderChart } from 'commons/components/SpiderChart';
import { abbreviateWords, cn } from 'commons/utils';
import { useGetSpiderChartQuery } from 'courses/redux/api/learningExperienceApi';
import { useMemo } from 'react';
import { EmptyChart } from '../EmptyChart';
import { CopilotSummarizer } from './CopilotSummarizer';

// find highest and lowest tryout
function findMinMaxSubtest(data: GetSpiderChartResponse[]): {
    minSubtest: string;
    maxSubtest: string;
} {
    let minSubtest = '';
    let minScore = 0;

    let maxSubtest = '';
    let maxScore = 0;

    for (const v of data) {
        if (minScore === 0 || v.average_score < minScore) {
            minScore = v.average_score;
            minSubtest = abbreviateWords(v.title);
        }

        if (maxScore === 0 || v.average_score > maxScore) {
            maxScore = v.average_score;
            maxSubtest = abbreviateWords(v.title);
        }
    }

    return { minSubtest, maxSubtest };
}

function generateContext(data: GetSpiderChartResponse[]): string {
    const { minSubtest, maxSubtest } = findMinMaxSubtest(data);

    return `
    - Jenis grafik: Grafik radar
    - Jari-jari: Nama subtes UTBK
    - Titik data: Rata-rata skor subtest dari setiap tryout yang dikerjakan

    Jari-jari beserta titik data:
    ${data.map(
        (v, index) =>
            `- ${abbreviateWords(v.title)}: ${v.average_score}${
                data.length - 1 === index ? '' : '\n'
            }`
    )}

    - Nilai subtes tertinggi: ${maxSubtest}
    - Nilai subtes terendah: ${minSubtest}
    `;
}

function SpiderChartCard(): JSX.Element {
    const { data: spiderChart, isLoading } = useGetSpiderChartQuery();

    const { labels, data } = useMemo(() => {
        if (!spiderChart) {
            return { labels: [], data: [] };
        }

        const result = spiderChart.reduce(
            (acc: { labels: string[]; data: number[] }, item) => {
                acc.labels.push(item.title);
                acc.data.push(Number(item.average_score));
                return acc;
            },
            { labels: [], data: [] }
        );

        return result;
    }, [spiderChart]);

    if (isLoading) {
        return (
            <div
                className={cn(
                    'animate-pulse bg-[#333333] rounded-2xl w-full max-w-[343px] min-h-[384px] mx-auto',
                    'lg:col-span-4 lg:max-w-full lg:max-h-full lg:mx-0'
                )}></div>
        );
    }

    if (!spiderChart || spiderChart.length < 3) {
        return (
            <div
                className={cn(
                    'bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl w-full max-w-[343px] min-h-[384px] mx-auto flex flex-col',
                    'lg:col-span-4 lg:max-w-full lg:max-h-full lg:mx-0 lg:px-6'
                )}>
                <div className="flex justify-between items-center">
                    <h2 className="text-white font-semibold leading-[140%]">
                        Radar Kekuatan
                    </h2>

                    <button disabled type="button" className="shrink-0">
                        <CopilotSolidIcon className="text-[#333333] w-4 h-4" />
                    </button>
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
                'relative bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl space-y-4 w-full max-w-[343px] mx-auto',
                'lg:col-span-4 lg:max-w-full lg:mx-0 lg:px-6'
            )}>
            <div className="flex justify-between items-center">
                <h2 className="text-white font-semibold leading-[140%]">
                    Radar Kekuatan
                </h2>

                <CopilotSummarizer context={generateContext(spiderChart)} />
            </div>

            <SpiderChart labels={labels} scores={data} />

            <div className="flex flex-col justify-center items-center gap-1">
                <div className="bg-[#B6A6F3] w-6 h-0.5"></div>
                <span className="text-[#B6A6F3] font-semibold leading-tight text-xs">
                    Skor rata-rata mu
                </span>
            </div>
        </div>
    );
}

export { SpiderChartCard };
