import Button from 'commons/components/elements/Button';
import { GraduateIcon } from 'commons/components/elements/Icons/GraduateIcon';
import { PerformanceAnalysis as PerformanceAnalysisType } from 'copilot/types/copilot';
import { TargetIcon } from 'lucide-react';

import { SubtestsAccordion } from './SubtestsAccordion';
import { useState } from 'react';
import { LearningPath } from './LearningPath';
import { cn, formatDate } from 'commons/utils';
import { SpiderChart } from './SpiderChart';
import { CopilotSolidIcon } from 'commons/components/elements/Icons/CopilotSolidIcon';

interface PerformanceAnalysisProps {
    performance_analysis: PerformanceAnalysisType;
    isLoadingResponse: boolean;
    sendMessage: (prompt: string, imageUrl?: string) => Promise<void>;
}

function PerformanceAnalysis({
    isLoadingResponse,
    performance_analysis,
    sendMessage
}: PerformanceAnalysisProps): JSX.Element {
    const [openedLearningPath, setOpenedLearningPath] = useState<
        PerformanceAnalysisType['problemset_results'][number] | null
    >(null);

    const now = new Date();
    const utbkDay = new Date(now.getFullYear(), 3, 21);
    const remainingUTBKDays = Math.round(
        (utbkDay.getTime() / 1000 - now.getTime() / 1000) / (60 * 60 * 24)
    );

    const percentage_progress =
        (performance_analysis.total_score /
            performance_analysis.passing_grade) *
        100;

    const handleClickPromptBtn = () => {
        sendMessage(
            'Jelaskan secara rinci dan mudah dipahami berdasarkan data analisis tersebut.'
        );
    };

    if (openedLearningPath) {
        return (
            <LearningPath
                problemset_result={openedLearningPath}
                setOpenedLearningPath={setOpenedLearningPath}
            />
        );
    }

    return (
        <div
            className={cn(
                'animate-fade bg-[#191920] rounded-2xl overflow-hidden w-full max-w-[303px] mx-auto',
                'md:max-w-[680px]'
            )}>
            {/* utbk countdown */}
            <div className="bg-[#282B3C] text-[#E9D5FF] font-bold text-xs leading-tight px-6 py-2 text-center uppercase tracking-[1.1px]">
                UTBK {remainingUTBKDays} hari lagi
            </div>

            {/* header */}
            <div
                className={cn(
                    'bg-[#20222E] p-4 flex flex-col justify-between gap-4',
                    'md:px-6 md:flex-row md:gap-8'
                )}>
                <div className="flex flex-col items-start gap-1">
                    <h3 className="text-white font-semibold leading-[140%]">
                        Hasil Try Out
                    </h3>
                    {performance_analysis.completed_at ? (
                        <span className="text-[#999999] text-xs leading-[160%]">
                            {formatDate(performance_analysis.completed_at)}
                        </span>
                    ) : (
                        <></>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <GraduateIcon className="shrink-0 fill-[#999999] w-4 h-4" />
                    <span className="text-sm font-semibold leading-tight">
                        {performance_analysis.target_major} -{' '}
                        {performance_analysis.target_institution}
                    </span>
                </div>
            </div>

            {/* main */}
            <div
                className={cn(
                    'space-y-8 m-4',
                    'md:space-y-0 md:grid md:grid-cols-2 md:mt-6'
                )}>
                {/* left side */}
                <div className={cn('flex flex-col gap-6', 'md:px-6')}>
                    <div className="flex flex-col">
                        <div
                            className={cn(
                                'flex justify-between items-center gap-4',
                                'md:flex-col md:items-start md:gap-2'
                            )}>
                            <div>
                                <div className="text-[#999999] text-sm leading-[160%]">
                                    Skor
                                </div>
                                <div className="text-white text-[32px] font-bold leading-[120%]">
                                    {performance_analysis.total_score}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-[#282B3C] rounded-full overflow-hidden w-full max-w-[119px] h-2">
                                    <div
                                        className="bg-[#03AC5C] rounded-full transition-all duration-500 ease-out h-full"
                                        style={{
                                            width: `${percentage_progress}%`
                                        }}
                                        role="progressbar"
                                        aria-valuenow={
                                            performance_analysis.total_score ??
                                            0
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
                            </div>
                        </div>

                        {performance_analysis.total_score <
                        performance_analysis.passing_grade ? (
                            <div className="bg-[#20222E] p-3 rounded-xl border border-[#282B3C] flex items-center gap-2 mt-6">
                                <TargetIcon className="shrink-0 text-[#03AC5C] w-4 h-4" />
                                <span className="text-[#FFFFFF] text-sm leading-[160%]">
                                    Butuh{' '}
                                    <span className="text-[#03AC5C] font-bold">
                                        +
                                        {(
                                            performance_analysis.passing_grade -
                                            performance_analysis.total_score
                                        ).toFixed(2)}{' '}
                                        poin
                                    </span>{' '}
                                    lagi menuju target
                                </span>
                            </div>
                        ) : (
                            <></>
                        )}

                        <div className="mt-10">
                            <h3 className="text-white font-semibold text-center leading-[140%] mb-6">
                                Materi Mana yang Paling Kuat?
                            </h3>

                            <SpiderChart
                                problemset_results={
                                    performance_analysis.problemset_results
                                }
                            />
                        </div>
                    </div>

                    <div
                        className={cn(
                            'hidden flex-grow justify-center items-end',
                            'md:flex'
                        )}>
                        <Button
                            disabled={isLoadingResponse}
                            onClick={handleClickPromptBtn}
                            type="button"
                            variant="primary"
                            className="!py-2 !px-4 text-sm flex items-center gap-2 mx-auto">
                            <CopilotSolidIcon className="shrink-0 text-white w-4 h-4" />
                            Bantu Jelaskan
                        </Button>
                    </div>
                </div>

                {/* right side */}
                <div className="md:px-6">
                    <h4 className="text-white font-semibold text-sm leading-tight mb-4">
                        Analisa per Materi
                    </h4>

                    {performance_analysis.problemset_results.length > 0 ? (
                        <SubtestsAccordion
                            problemset_results={
                                performance_analysis.problemset_results
                            }
                            setOpenedLearningPath={setOpenedLearningPath}
                        />
                    ) : (
                        <></>
                    )}
                </div>

                <Button
                    disabled={isLoadingResponse}
                    onClick={handleClickPromptBtn}
                    type="button"
                    variant="primary"
                    className={cn(
                        '!py-2 !px-4 text-sm flex items-center gap-2 mx-auto',
                        'md:hidden'
                    )}>
                    <CopilotSolidIcon className="shrink-0 fill-white w-4 h-4" />
                    Bantu Jelaskan
                </Button>
            </div>
        </div>
    );
}

export { PerformanceAnalysis };
