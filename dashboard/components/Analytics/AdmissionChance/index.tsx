// import { BlockOutlineIcon } from 'commons/components/elements/Icons/BlockOutlineIcon';
import { MenuSolidIcon } from 'commons/components/elements/Icons/MenuSolidIcon';
import { PrediksiSolidIcon } from 'commons/components/elements/Icons/PrediksiSolidIcon';
import { cn } from 'commons/utils';
import { useState } from 'react';
import { UpdatePrimaryTargetModal } from '../UpdatePrimaryTargetModal';
import { useGetAdmissionChanceQuery } from 'dashboard/redux/api/dashboardApi';
import { NonEmptyPassingGrade } from './NonEmptyPassingGrade';
import { EmptyPassingGrade } from './EmptyPassingGrade';

function AdmissionChance(): JSX.Element {
    const [isUpdateTargetOpen, setIsUpdateTargetOpen] = useState(false);
    const { data, isLoading } = useGetAdmissionChanceQuery();
    const tryoutScore = data?.highest_tryout_score ?? 0;

    if (isLoading) {
        return (
            <div
                className={cn(
                    'animate-pulse bg-[#333333] w-full h-[400px] rounded-2xl',
                    'lg:h-full'
                )}></div>
        );
    }

    return (
        <div
            className={cn(
                'bg-[#191920] border border-[#282B3C] rounded-2xl w-full h-full overflow-hidden',
                'lg:flex'
            )}>
            {/* first part */}
            <div
                className={cn(
                    'p-4 space-y-4',
                    'lg:space-y-0 lg:w-full lg:max-w-[254px] lg:px-6 lg:flex lg:flex-col lg:justify-between lg:gap-4'
                )}>
                <div className={cn('space-y-4', 'lg:space-y-10')}>
                    <div className="flex justify-between items-center">
                        <h2
                            className={cn(
                                'text-white font-semibold text-sm leading-tight',
                                'lg:text-base'
                            )}>
                            Target Kampus
                        </h2>

                        <div className="flex items-center gap-2">
                            {/* "Atur Strategi" for mobile */}
                            {/* <button
                                type="button"
                                className={cn(
                                    'shrink-0 bg-[#282B3C] hover:opacity-75 transition-all w-6 h-6 rounded-full grid place-items-center',
                                    'lg:hidden'
                                )}>
                                <BlockOutlineIcon className="text-white w-4 h-4" />
                            </button> */}

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
                            {data?.major_name}
                        </h3>

                        <p className="text-white text-sm leading-[160%] flex items-center gap-2">
                            <PrediksiSolidIcon className="shrink-0 text-white w-6 h-6" />
                            {data?.institution_name}
                        </p>
                    </div>
                </div>

                {/* "Atur Strategi" for desktop */}
                {/* <button
                    type="button"
                    className="text-white font-semibold text-sm leading-tight w-full py-2 border border-white rounded-full hover:opacity-75 transition-all">
                    Atur Strategi
                </button> */}
            </div>

            {/* second part */}
            {data?.passing_grade ? (
                <NonEmptyPassingGrade
                    tryoutScore={tryoutScore}
                    passing_grade={data.passing_grade}
                />
            ) : (
                <EmptyPassingGrade />
            )}
        </div>
    );
}

export { AdmissionChance };
