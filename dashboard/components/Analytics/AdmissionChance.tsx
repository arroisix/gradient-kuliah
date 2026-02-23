import { BlockOutlineIcon } from 'commons/components/elements/Icons/BlockOutlineIcon';
import { InfoOutlineIcon } from 'commons/components/elements/Icons/InfoOutlineIcon';
import { InfoSolidIcon } from 'commons/components/elements/Icons/InfoSolidIcon';
import { MenuSolidIcon } from 'commons/components/elements/Icons/MenuSolidIcon';
import { PrediksiSolidIcon } from 'commons/components/elements/Icons/PrediksiSolidIcon';
import { ThumbsUpSolidIcon } from 'commons/components/elements/Icons/ThumbsUpSolidIcon';
import { cn } from 'commons/utils';
import { useState } from 'react';
import { UpdatePrimaryTargetModal } from './UpdatePrimaryTargetModal';

function generateHexTextColor(score: number): string {
    return score < 300
        ? 'text-[#DB4A3B]'
        : score >= 300 && score < 550
        ? 'text-[#F2C04C]'
        : 'text-[#03AC5C]';
}

function generateHexBgColor(score: number): string {
    return score < 300
        ? 'bg-[#DB4A3B]'
        : score >= 300 && score < 550
        ? 'bg-[#F2C04C]'
        : 'bg-[#03AC5C]';
}

function AdmissionChance(): JSX.Element {
    const [isUpdateTargetOpen, setIsUpdateTargetOpen] = useState(false);
    const score = 250;
    const passingGrade = 720;
    const maxScore = 1000;

    const percentage = Math.round((score / maxScore) * 100);
    const progress = (score / maxScore) * 100;
    const passingGradeWidth = (passingGrade / maxScore) * 100;

    return (
        <div
            className={cn(
                'bg-[#191920] border border-[#282B3C] rounded-2xl w-full max-w-[343px] mx-auto overflow-hidden',
                'lg:max-w-[623px] lg:mx-0 lg:flex'
            )}>
            {/* first part */}
            <div
                className={cn(
                    'p-4 space-y-4',
                    'lg:w-full lg:max-w-[254px] lg:px-6 lg:flex lg:flex-col lg:justify-between'
                )}>
                <div className="flex justify-between items-center">
                    <h2
                        className={cn(
                            'text-white font-semibold text-sm leading-tight',
                            'lg:text-base'
                        )}>
                        Target Kampus
                    </h2>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={cn(
                                'shrink-0 bg-[#282B3C] hover:opacity-75 transition-all w-6 h-6 rounded-full grid place-items-center',
                                'lg:hidden'
                            )}>
                            <BlockOutlineIcon className="text-white w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setIsUpdateTargetOpen(true)}
                            type="button"
                            className="shrink-0 bg-[#282B3C] hover:opacity-75 transition-all w-6 h-6 rounded-full grid place-items-center">
                            <MenuSolidIcon className="text-[#B6A6F3] w-4 h-4" />
                        </button>

                        {isUpdateTargetOpen ? (
                            <UpdatePrimaryTargetModal
                                isOpen={isUpdateTargetOpen}
                                setIsOpen={setIsUpdateTargetOpen}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-white font-semibold text-xl leading-[140%]">
                        Teknik Sipil
                    </h3>

                    <p className="text-white text-sm leading-[160%] flex items-center gap-2">
                        <PrediksiSolidIcon className="shrink-0 text-white w-6 h-6" />
                        Universitas Indonesia
                    </p>
                </div>

                <button
                    type="button"
                    className="text-white font-semibold text-sm leading-tight w-full py-2 border border-white rounded-full hover:opacity-75 transition-all">
                    Atur Strategi
                </button>
            </div>

            {/* second part */}
            <div
                className={cn(
                    'bg-[#20222E] rounded-lg p-4 space-y-4',
                    'lg:w-full lg:max-w-[369px] lg:px-6 lg:space-y-6'
                )}>
                <h3
                    className={cn(
                        'text-white font-semibold text-sm leading-tight',
                        'lg:text-base'
                    )}>
                    Peluang Lolos
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div
                            className={cn(
                                'font-bold text-[40px] leading-[120%]',
                                generateHexTextColor(score)
                            )}>
                            {percentage}%
                        </div>

                        <div className="p-2 rounded-lg border border-white">
                            <h4 className="text-[#999999] text-center text-xs leading-[160%]">
                                Passing Grade 2024
                            </h4>
                            <div className="text-white font-semibold text-center text-sm leading-tight">
                                {passingGrade}
                            </div>
                        </div>
                    </div>

                    <div className="relative bg-[#4B4E5F] rounded-full overflow-visible w-full h-2 mt-2 mb-4">
                        <div
                            className={cn(
                                'rounded-full transition-all duration-500 ease-out h-full',
                                generateHexBgColor(score)
                            )}
                            style={{ width: `${progress}%` }}
                            role="progressbar"
                        />

                        <div
                            className="absolute -top-0.5 -bottom-0.5 w-0.5 bg-white rounded-full"
                            style={{ left: `${passingGradeWidth}%` }}></div>
                    </div>
                </div>
                <div className="bg-[#282B3C] border border-[#4B4E5F] p-4 rounded-xl flex justify-between items-center">
                    <div className="space-y-1">
                        <h4 className="text-[#999999] text-xs leading-[160%]">
                            Skor Tryout kamu
                        </h4>
                        <div className="text-white font-semibold text-xl leading-[140%]">
                            {score}
                        </div>
                    </div>

                    <div className="bg-[#20222E] border border-[#282B3C] rounded-full flex items-center gap-1 py-1 px-2">
                        {score < 550 ? (
                            <InfoSolidIcon
                                className={cn(
                                    'shrink-0 w-4 h-4',
                                    generateHexTextColor(score)
                                )}
                            />
                        ) : (
                            <ThumbsUpSolidIcon className="shrink-0 text-[#03AC5C] w-4 h-4" />
                        )}

                        <span className="text-white text-xs">
                            {score < 300
                                ? 'Perlu belajar lagi!'
                                : score >= 300 && score < 550
                                ? 'Yuk tingkatkan lagi!'
                                : 'Mantep sih ini!'}
                        </span>
                    </div>
                </div>

                <p className="text-[#999999] text-xs flex justify-center gap-2">
                    <InfoOutlineIcon className="shrink-0 text-[#999999] w-4 h-4" />
                    Angka estimasi passing grade universitas dari skor tryout
                    kamu. Bobot penilaian berbeda per jurusan dan universitas
                    berdasarkan data internal.
                </p>
            </div>
        </div>
    );
}

export { AdmissionChance };
