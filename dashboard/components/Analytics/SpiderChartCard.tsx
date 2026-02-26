import { CopilotSolidIcon } from 'commons/components/elements/Icons/CopilotSolidIcon';
import { SpiderChart } from 'commons/components/SpiderChart';
import { cn } from 'commons/utils';
import { useGetSpiderChartQuery } from 'courses/redux/api/learningExperienceApi';
import { useMemo } from 'react';

function SpiderChartCard(): JSX.Element {
    const { data: spiderChart, isLoading } = useGetSpiderChartQuery();

    const { labels, data } = useMemo(() => {
        if (!spiderChart) {
            return { labels: [], data: [] };
        }

        const result = spiderChart.reduce(
            (acc: { labels: string[]; data: number[] }, item) => {
                acc.labels.push(item.title);
                acc.data.push(item.average_score);
                return acc;
            },
            { labels: [], data: [] }
        );

        return result;
    }, [spiderChart]);

    const handleClickCopilot = () => {
        // TODO
    };

    if (isLoading) {
        return (
            <div
                className={cn(
                    'animate-pulse bg-[#333333] rounded-2xl w-full max-w-[343px] h-96 mx-auto',
                    'lg:col-span-4 lg:max-w-full lg:mx-0'
                )}></div>
        );
    }

    return (
        <div
            className={cn(
                'bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl space-y-4 w-full max-w-[343px] mx-auto',
                'lg:col-span-4 lg:max-w-full lg:mx-0 lg:px-6'
            )}>
            <div className="flex justify-between items-center">
                <h2 className="text-white font-semibold leading-[140%]">
                    Radar Kekuatan
                </h2>

                <button
                    type="button"
                    onClick={handleClickCopilot}
                    className="shrink-0 bg-[#5F2BCE] hover:opacity-75 transition-all rounded-full w-8 h-8 grid place-items-center">
                    <CopilotSolidIcon className="text-white w-4 h-4" />
                </button>
            </div>

            <SpiderChart labels={labels} scores={data} />

            <span className="text-[#B6A6F3] font-semibold leading-tight text-xs text-center block">
                Skor rata-rata mu
            </span>
        </div>
    );
}

export { SpiderChartCard };
