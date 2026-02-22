import { CopilotSolidIcon } from 'commons/components/elements/Icons/CopilotSolidIcon';
import { SpiderChart } from 'commons/components/SpiderChart';

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
        <div className="bg-[#282B3C] py-4 px-6 rounded-2xl space-y-4 w-full max-w-[288px]">
            <div className="flex justify-between items-center">
                <h1 className="text-white font-semibold leading-[140%]">
                    Radar Kekuatan
                </h1>

                <button
                    type="button"
                    onClick={handleClickCopilot}
                    className="shrink-0">
                    <CopilotSolidIcon className="text-[#B6A6F3] w-4 h-4" />
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
