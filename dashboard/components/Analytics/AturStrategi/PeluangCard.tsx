import { InfoOutlineIcon } from 'commons/components/elements/Icons/InfoOutlineIcon';
import {
    calculateTryoutPrediction,
    cn,
    generateHexTextColor
} from 'commons/utils';
import { DropdownMenu, Tooltip } from 'radix-ui';
import { useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

interface PeluangCardProps {
    tryout_score: number;
    passing_grade: number;
}

function PeluangCard({
    tryout_score,
    passing_grade
}: PeluangCardProps): JSX.Element {
    const probability = calculateTryoutPrediction(tryout_score, passing_grade);
    const [isTooltipOpened, setIsTooltipOpened] = useState(false);
    const { width } = useWindowSize();

    return (
        <div
            className={cn(
                'bg-[#101010] space-y-4 rounded-xl py-3 px-4 mb-6 h-fit',
                'lg:col-span-5'
            )}>
            <div className="space-y-1">
                <h2 className="text-[#DEDEDE] text-sm leading-[160%]">
                    Rata-rata nilaimu
                </h2>

                <div className="text-white font-bold text-2xl leading-tight">
                    {tryout_score}
                </div>
            </div>

            <div
                className={cn(
                    'flex items-center gap-4',
                    'lg:grid lg:grid-cols-2'
                )}>
                <div
                    className={cn(
                        'flex-grow bg-[#222222] border border-[#2C2C2C] rounded-xl p-4 space-y-1',
                        'lg:col-span-1'
                    )}>
                    <div className="flex items-center gap-1">
                        <h3 className="text-[#999999] text-xs leading-[160%]">
                            Passing Grade 2024
                        </h3>

                        {width < 1024 ? (
                            <DropdownMenu.Root
                                open={isTooltipOpened}
                                onOpenChange={setIsTooltipOpened}>
                                <DropdownMenu.Trigger
                                    type="button"
                                    className="outline-none">
                                    <InfoOutlineIcon className="shrink-0 text-[#999999] w-5 h-5" />
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Content
                                    side="top"
                                    align="center"
                                    className="bg-[#2C2C2C] text-white text-xs leading-[160%] p-2 rounded-lg w-full max-w-[208px]">
                                    <DropdownMenu.Arrow className="fill-[#2C2C2C]" />
                                    Passing Grade berdasarkan tujuan kampus
                                    utama.
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        ) : (
                            <Tooltip.Provider delayDuration={0}>
                                <Tooltip.Root>
                                    <Tooltip.Trigger>
                                        <InfoOutlineIcon className="shrink-0 text-[#999999] w-5 h-5" />
                                    </Tooltip.Trigger>

                                    <Tooltip.Portal>
                                        <Tooltip.Content
                                            side="top"
                                            align="center"
                                            className="bg-[#2C2C2C] text-white text-xs leading-[160%] p-2 rounded-lg w-full max-w-[208px]">
                                            <Tooltip.Arrow className="fill-[#2C2C2C]" />
                                            Passing Grade berdasarkan tujuan
                                            kampus utama.
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        )}
                    </div>

                    <div className="text-white font-bold text-2xl leading-tight">
                        {passing_grade}
                    </div>
                </div>

                <div
                    className={cn(
                        'bg-[#222222] border border-[#2C2C2C] rounded-xl p-4 space-y-1',
                        'lg:col-span-1 lg:h-full'
                    )}>
                    <h3 className="text-[#999999] text-xs leading-[160%]">
                        Peluang Lolos
                    </h3>

                    <div
                        className={cn(
                            'font-bold text-2xl leading-tight',
                            generateHexTextColor(Number(probability) * 10)
                        )}>
                        {Number(probability) > 0 ? probability : 0}%
                    </div>
                </div>
            </div>

            <p className="text-[#999999] text-xs flex justify-center items-center gap-2">
                <InfoOutlineIcon className="shrink-0 text-[#999999] w-5 h-5" />
                Estimasi hasil prediksi bersifat referensi dan tidak
                mencerminkan bobot subtes resmi tiap universitas. Gunakan
                sebagai referensi.
            </p>
        </div>
    );
}

export { PeluangCard };
