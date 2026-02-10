import Button from 'commons/components/elements/Button';
import { GraduateIcon } from 'commons/components/elements/Icons/GraduateIcon';
import { PerformanceAnalysis as PerformanceAnalysisType } from 'copilot/types/copilot';
import { TargetIcon } from 'lucide-react';
import { CopilotSolidIcon } from '../../../assets/CopilotSolidIcon';
import { SubtestsAccordion } from './SubtestsAccordion';

interface PerformanceAnalysisProps {
    performance_analysis: PerformanceAnalysisType;
}

function PerformanceAnalysis({
    performance_analysis
}: PerformanceAnalysisProps): JSX.Element {
    const now = new Date();
    const utbkDay = new Date(now.getFullYear(), 3, 21);
    const remainingUTBKDays = Math.round(
        (utbkDay.getTime() / 1000 - now.getTime() / 1000) / (60 * 60 * 24)
    );

    const percentage_progress =
        (performance_analysis.total_score /
            performance_analysis.passing_grade) *
        100;

    return (
        <div className="bg-[#191920] rounded-2xl overflow-hidden w-full max-w-[680px]">
            {/* utbk countdown */}
            <div className="bg-[#282B3C] text-[#E9D5FF] font-bold text-xs leading-tight px-6 py-2 text-center uppercase tracking-[1.1px]">
                UTBK {remainingUTBKDays} hari lagi
            </div>

            {/* header */}
            <div className="bg-[#20222E] px-6 py-4 flex justify-between text-center gap-8">
                <div className="flex flex-col items-start gap-1">
                    <h3 className="text-white font-semibold leading-[140%]">
                        Hasil Try Out
                    </h3>
                    <span className="text-[#999999] text-xs leading-[160%]">
                        12 Jan 2025
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <GraduateIcon className="shrink-0 fill-[#999999] w-4 h-4" />
                    <span className="shrink-0">
                        {performance_analysis.target_major} -{' '}
                        {performance_analysis.target_institution}
                    </span>
                </div>
            </div>

            {/* main */}
            <div className="grid grid-cols-2 mt-6 mb-4">
                {/* left side */}
                <div className="flex flex-col px-6">
                    <div>
                        <div className="text-[#999999] text-sm leading-[160%]">
                            Skor
                        </div>

                        <div className="text-white text-[32px] font-bold leading-[120%]">
                            {performance_analysis.total_score}
                        </div>

                        <div className="bg-[#282B3C] rounded-full overflow-hidden w-full max-w-[119px] h-2 my-2">
                            <div
                                className="bg-[#03AC5C] rounded-full transition-all duration-500 ease-out h-full"
                                style={{ width: `${percentage_progress}%` }}
                                role="progressbar"
                                aria-valuenow={
                                    performance_analysis.total_score ?? 0
                                }
                                aria-valuemin={0}
                                aria-valuemax={
                                    performance_analysis.passing_grade
                                }
                            />
                        </div>

                        <div className="text-[#B6A6F3] font-semibold text-sm leading-tight">
                            Target: {performance_analysis.passing_grade}
                        </div>

                        {performance_analysis.total_score <
                        performance_analysis.passing_grade ? (
                            <div className="bg-[#20222E] p-3 rounded-xl border border-[#282B3C] flex items-center gap-2 mt-6">
                                <TargetIcon className="shrink-0 text-[#03AC5C] w-4 h-4" />
                                <span className="text-[#FFFFFF] text-sm leading-[160%]">
                                    Butuh{' '}
                                    <span className="text-[#03AC5C] font-bold">
                                        +
                                        {performance_analysis.passing_grade -
                                            performance_analysis.total_score}{' '}
                                        poin
                                    </span>{' '}
                                    lagi menuju target
                                </span>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="flex-grow flex flex-col justify-between mt-10">
                        <div>
                            <h3 className="text-white font-semibold text-center leading-[140%] mb-6">
                                Subtes Mana yang Paling Kuat?
                            </h3>
                        </div>

                        <Button
                            type="button"
                            variant="primary"
                            className="!py-2 !px-4 text-sm flex items-center gap-2 mx-auto">
                            <CopilotSolidIcon className="shrink-0 fill-white w-4 h-4" />
                            Bantu Jelaskan
                        </Button>
                    </div>
                </div>

                {/* right side */}
                <div className="px-6">
                    <h4 className="text-white font-semibold text-sm leading-tight mb-4">
                        Analisa per Subtest
                    </h4>

                    {performance_analysis.problemset_results.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            <SubtestsAccordion
                                problemset_results={
                                    performance_analysis.problemset_results
                                }
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}

export { PerformanceAnalysis };
