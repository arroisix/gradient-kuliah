import { Accordion } from 'radix-ui';
import { PerformanceAnalysis } from 'copilot/types/copilot';
import { Dispatch, SetStateAction, useState } from 'react';
import { cn } from 'commons/utils';
import { ChevronDownIcon } from 'lucide-react';
import { FaCircleCheck, FaCircleInfo } from 'react-icons/fa6';
import Button from 'commons/components/elements/Button';
import { LearningPathIcon } from 'copilot/assets/LearningPathIcon';

// generate text color based on subtest score
function generateHexTextColor(score: number): string {
    return score < 300
        ? 'text-[#DB4A3B]'
        : score >= 300 && score < 550
        ? 'text-[#F2C04C]'
        : 'text-[#03AC5C]';
}

interface SubtestsAccordionProps
    extends Pick<PerformanceAnalysis, 'problemset_results'> {
    setOpenedLearningPath: Dispatch<
        SetStateAction<PerformanceAnalysis['problemset_results'][number] | null>
    >;
}

function SubtestsAccordion({
    problemset_results,
    setOpenedLearningPath
}: SubtestsAccordionProps): JSX.Element {
    const [openedSubtest, setOpenedSubtest] = useState(''); // problemset_progress_id
    return (
        <Accordion.Root
            collapsible
            value={openedSubtest}
            onValueChange={(v) => setOpenedSubtest(v)}
            type="single"
            className="space-y-4">
            {problemset_results.map((v) => (
                <Accordion.Item
                    key={v.problemset_progress_id}
                    value={v.problemset_progress_id}>
                    <Accordion.Header>
                        <Accordion.Trigger
                            type="button"
                            className={cn(
                                'bg-gradient-to-br from-[#9CA3AF]/[8%] to-[#6B7280]/[4%] py-2 px-3 rounded-xl border flex justify-between items-center gap-4 w-full transition-colors',
                                openedSubtest === v.problemset_progress_id
                                    ? 'border-[#B6A6F3]'
                                    : 'border-[#9CA3AF]/[20%]'
                            )}>
                            <span
                                className={cn(
                                    'text-left text-sm leading-[160%] flex items-center gap-2',
                                    generateHexTextColor(v.score)
                                )}>
                                {v.score < 550 ? (
                                    <FaCircleInfo
                                        className={cn(
                                            'shrink-0 w-4 h-4',
                                            generateHexTextColor(v.score)
                                        )}
                                    />
                                ) : (
                                    <></>
                                )}
                                {v.problemset_title}{' '}
                            </span>

                            <span
                                className={cn(
                                    'text-sm font-semibold leading-tight flex items-center gap-3',
                                    generateHexTextColor(v.score)
                                )}>
                                {v.score}
                                <ChevronDownIcon
                                    className={cn(
                                        'shrink-0 text-[#666666] w-4 h-4 transition-all',
                                        openedSubtest ===
                                            v.problemset_progress_id
                                            ? '-rotate-180'
                                            : ''
                                    )}
                                />
                            </span>
                        </Accordion.Trigger>
                    </Accordion.Header>

                    <Accordion.Content className="animate-fade animate-duration-500 mt-4 space-y-3">
                        <div className="bg-[#191920] p-3 rounded-lg border border-[#4B4E5F] space-y-4">
                            <h5 className="text-white font-semibold text-sm leading-tight flex items-center gap-2">
                                <FaCircleCheck className="shrink-0 text-[#03AC5C] w-4 h-4" />{' '}
                                Dikuasai
                            </h5>

                            {v.chapter_mastered.length > 0 ? (
                                <div className="flex flex-wrap gap-y-3 gap-x-2">
                                    {v.chapter_mastered.map((chapter) => (
                                        <div
                                            key={chapter}
                                            className="text-white font-medium text-xs leading-tight bg-[#4B4E5F] px-2 py-1 rounded-full">
                                            {chapter}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[#999999] text-sm leading-[160%]">
                                    Belum ada materi yang kamu kuasai.
                                </p>
                            )}
                        </div>

                        <div className="bg-[#191920] p-3 rounded-lg border border-[#4B4E5F] space-y-4">
                            <h5 className="text-white font-semibold text-sm leading-tight flex items-center gap-2">
                                <FaCircleInfo className="shrink-0 text-[#F2C04C] w-4 h-4" />{' '}
                                Perlu Evaluasi
                            </h5>

                            {v.chapter_need_to_improve.length > 0 ? (
                                <div className="flex flex-wrap gap-y-3 gap-x-2">
                                    {v.chapter_need_to_improve.map(
                                        (chapter) => (
                                            <div
                                                key={chapter}
                                                className="text-white font-medium text-xs leading-tight bg-[#4B4E5F] px-2 py-1 rounded-full">
                                                {chapter}
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-[#999999] text-sm leading-[160%]">
                                    Belum ada materi yang perlu dievaluasi.
                                </p>
                            )}

                            {v.chapter_need_to_improve.length > 0 ? (
                                <div className="bg-[#20222E] py-3 px-4 rounded-lg border border-[#2C2C2C] text-white text-xs leading-[160%] space-y-3">
                                    <div>
                                        Banyak error di soal{' '}
                                        <span className="font-bold">
                                            {v.chapter_need_to_improve[0]}
                                        </span>{' '}
                                        {v.chapter_need_to_improve.length >
                                        1 ? (
                                            <>
                                                dan{' '}
                                                <span className="font-bold">
                                                    {
                                                        v
                                                            .chapter_need_to_improve[1]
                                                    }
                                                </span>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        . Perlu latihan pola pikir sistematis.
                                    </div>

                                    <Button
                                        onClick={() => setOpenedLearningPath(v)}
                                        type="button"
                                        variant="primary"
                                        className="!py-2 !px-4 text-sm flex justify-center items-center gap-2 w-full">
                                        <LearningPathIcon className="shrink-0 fill-white w-4 h-4" />
                                        Lihat Learning Path
                                    </Button>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export { SubtestsAccordion };
