import { CopilotSolidIcon } from 'commons/components/elements/Icons/CopilotSolidIcon';
import { SpiderChart } from 'commons/components/SpiderChart';
import { cn } from 'commons/utils';

const labels = [
    'P.Umum',
    'B.Inggris',
    'Kuantitatif',
    'B.Indonesia',
    'Matematika',
    'Bacaan & Menulis'
];

const data = [775, 575, 975, 675, 875, 475];

function SpiderChartCard(): JSX.Element {
    const handleClickCopilot = () => {
        // TODO
    };

    return (
        <div
            className={cn(
                'bg-[#191920] border border-[#282B3C] py-4 px-4 rounded-2xl space-y-4 w-full max-w-[343px] mx-auto',
                'lg:max-w-[287px] lg:mx-0 lg:px-6'
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
