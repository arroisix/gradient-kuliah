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

interface NonEmptyPassingGradeProps {
    tryoutScore: number;
    passing_grade: number;
}

function NonEmptyPassingGrade({
    tryoutScore,
    passing_grade
}: NonEmptyPassingGradeProps): JSX.Element {
    const probability = calculatePrediction(tryoutScore, passing_grade);

    return (
        <div
            className={cn(
                'bg-[#20222E] rounded-lg p-4 flex flex-col justify-between gap-4',
                'lg:w-full lg:max-w-[369px] lg:px-6'
            )}>
            <div>
                <h3
                    className={cn(
                        'text-white font-semibold text-sm leading-tight mb-4',
                        'lg:text-base lg:mb-10'
                    )}>
                    Peluang Lolos
                </h3>

                <div className="space-y-2 mb-4">
                    <div
                        className={cn(
                            'font-bold text-[40px] leading-[120%]',
                            generateHexTextColor(probability * 10)
                        )}>
                        {probability}%
                    </div>

                    <div className="w-fit bg-[#20222E] border border-[#4B4E5F] rounded-full flex items-center gap-1 py-1 px-2">
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

                <div className="bg-[#282B3C] border border-[#4B4E5F] p-4 rounded-xl flex justify-between items-center">
                    <div className="space-y-1">
                        <h4 className="text-[#999999] text-xs leading-[160%]">
                            Skor Tryout kamu
                        </h4>
                        <div className="text-white font-semibold text-xl leading-[140%]">
                            {tryoutScore}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-[#999999] text-xs leading-[160%]">
                            Passing Grade 2024
                        </h4>
                        <div className="text-white font-semibold text-xl leading-[140%]">
                            {passing_grade}
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-[#999999] text-xs flex justify-center gap-2">
                <InfoOutlineIcon className="shrink-0 text-[#999999] w-4 h-4" />
                Persentase di atas adalah peluang kamu masuk jurusan, dihitung
                dengan rumus internal.
            </p>
        </div>
    );
}

export { NonEmptyPassingGrade };
