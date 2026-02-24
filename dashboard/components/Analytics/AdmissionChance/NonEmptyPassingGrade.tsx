import { InfoOutlineIcon } from 'commons/components/elements/Icons/InfoOutlineIcon';
import { InfoSolidIcon } from 'commons/components/elements/Icons/InfoSolidIcon';
import { ThumbsUpSolidIcon } from 'commons/components/elements/Icons/ThumbsUpSolidIcon';
import { cn } from 'commons/utils';
import ztable from 'ztable';

function calculatePrediction(
    tryoutScore: number,
    passingGrade: number
): number {
    const std = 60;
    const z = (tryoutScore - passingGrade) / std;
    const probability = ztable(z);
    return probability * 100;
}

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

interface NonEmptyPassingGradeProps {
    tryoutScore: number;
    percentage: number;
    passing_grade: number;
}

function NonEmptyPassingGrade({
    tryoutScore,
    percentage,
    passing_grade
}: NonEmptyPassingGradeProps): JSX.Element {
    const passingGradeWidth = (passing_grade / 1000) * 100;
    const probability = calculatePrediction(tryoutScore, passing_grade);

    return (
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
                            generateHexTextColor(tryoutScore)
                        )}>
                        {probability}%
                    </div>

                    <div className="p-2 rounded-lg border border-white">
                        <h4 className="text-[#999999] text-center text-xs leading-[160%]">
                            Passing Grade 2024
                        </h4>
                        <div className="text-white font-semibold text-center text-sm leading-tight">
                            {passing_grade}
                        </div>
                    </div>
                </div>

                <div className="relative bg-[#4B4E5F] rounded-full overflow-visible w-full h-2 mt-2 mb-4">
                    <div
                        className={cn(
                            'rounded-full transition-all duration-500 ease-out h-full',
                            generateHexBgColor(tryoutScore)
                        )}
                        style={{ width: `${percentage}%` }}
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
                        {tryoutScore}
                    </div>
                </div>

                <div className="bg-[#20222E] border border-[#282B3C] rounded-full flex items-center gap-1 py-1 px-2">
                    {tryoutScore < 550 ? (
                        <InfoSolidIcon
                            className={cn(
                                'shrink-0 w-4 h-4',
                                generateHexTextColor(tryoutScore)
                            )}
                        />
                    ) : (
                        <ThumbsUpSolidIcon className="shrink-0 text-[#03AC5C] w-4 h-4" />
                    )}

                    <span className="text-white text-xs">
                        {tryoutScore < 300
                            ? 'Perlu belajar lagi!'
                            : tryoutScore >= 300 && tryoutScore < 550
                            ? 'Yuk tingkatkan lagi!'
                            : 'Mantep sih ini!'}
                    </span>
                </div>
            </div>

            <p className="text-[#999999] text-xs flex justify-center gap-2">
                <InfoOutlineIcon className="shrink-0 text-[#999999] w-4 h-4" />
                Angka estimasi passing grade universitas dari skor tryout kamu.
                Bobot penilaian berbeda per jurusan dan universitas berdasarkan
                data internal.
            </p>
        </div>
    );
}

export { NonEmptyPassingGrade };
