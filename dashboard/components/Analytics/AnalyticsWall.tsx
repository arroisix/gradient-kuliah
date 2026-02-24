import { useAuth } from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import { abbreviateWords, cn } from 'commons/utils';
import { useGetStudentTargetInstitutionsQuery } from 'dashboard/redux/api/dashboardApi';
import { useSetTargetDrawerContext } from 'exercises/components/Entrypoint/SetTargetDrawer';
import { ChevronRightIcon, PencilIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCircleCheck } from 'react-icons/fa6';
import { useWindowSize } from 'usehooks-ts';

function AnalyticsWall(): JSX.Element {
    const { profile } = useAuth();

    const { data: targetInstitutions } = useGetStudentTargetInstitutionsQuery();

    const { width } = useWindowSize();
    const { setIsDrawerOpened, setIsModalOpened } = useSetTargetDrawerContext();

    const handleClickButton = () => {
        width < 1024 ? setIsModalOpened(true) : setIsDrawerOpened(true);
    };

    return (
        <div
            className={cn(
                'lg:bg-black lg:border-2 lg:border-[#36236A] lg:py-8 lg:px-6 lg:rounded-2xl lg:w-full lg:max-w-[646px]'
            )}>
            <div
                className={cn(
                    'relative w-20 h-20 mx-auto mb-4',
                    'lg:w-[120px] lg:h-[120px] lg:mb-6'
                )}>
                <Image
                    src={`${CDN_URL}/assets/utbk/dashboard/analytics_wall_icon.svg`}
                    layout="fill"
                    alt=""
                />
            </div>

            <div
                className={cn(
                    'space-y-1 w-full max-w-[343px] mx-auto mb-4',
                    'lg:max-w-full'
                )}>
                <h2
                    className={cn(
                        'text-white font-bold text-center w-full leading-[140%]',
                        'lg:text-xl lg:leading-tight'
                    )}>
                    Siap mengejar mimpi, {profile?.username}?
                </h2>

                <p
                    className={cn(
                        'text-[#999999] text-center text-sm leading-[160%]',
                        'lg:text-base lg:leading-normal'
                    )}>
                    Selesaikan 2 langkah awal ini untuk mengaktifkan Dashboard
                    Analisis.
                </p>
            </div>

            <div
                className={cn(
                    'bg-[#282B3C] p-4 rounded-2xl w-full max-w-[343px] mx-auto space-y-4 mb-3',
                    'lg:space-y-0 lg:max-w-full lg:flex lg:justify-between lg:gap-4',
                    targetInstitutions?.length === 0
                        ? 'lg:items-center'
                        : 'lg:items-start'
                )}>
                <div
                    className={cn(
                        'space-y-2',
                        'lg:space-y-0 lg:flex lg:gap-4'
                    )}>
                    {targetInstitutions?.length === 0 ? (
                        <div className="shrink-0 bg-white w-4 h-4 rounded-full grid place-items-center text-black text-xs font-medium leading-tight">
                            1
                        </div>
                    ) : (
                        <FaCircleCheck className="shrink-0 text-[#03AC5C] w-4 h-4" />
                    )}

                    <div
                        className={
                            targetInstitutions?.length === 0
                                ? 'space-y-1'
                                : 'space-y-3'
                        }>
                        <h3
                            className={cn(
                                'font-semibold text-sm leading-tight',
                                targetInstitutions?.length === 0
                                    ? 'text-white'
                                    : 'text-[#03AC5C]'
                            )}>
                            Tentukan Target Kampus
                        </h3>

                        {targetInstitutions?.length === 0 ? (
                            <p className="text-[#DEDEDE] text-xs leading-[160%]">
                                Pilih PTN dan jurusan tujuanmu agar sistem bisa
                                menghitung Passing Grade dan peluang lolos IRT.
                            </p>
                        ) : (
                            <div
                                className={cn(
                                    'flex flex-wrap gap-2',
                                    'lg:flex-nowrap lg:flex-col'
                                )}>
                                {targetInstitutions?.map((v, index) =>
                                    index === 0 ? (
                                        <div
                                            key={`${v.id}:${v.major.id}`}
                                            className="bg-gradient-to-r from-[#D790DE] via-[#99B8DA] to-[#439CFB] p-[1px] rounded-full w-fit">
                                            <div className="bg-[#282B3C] text-white text-sm leading-[160%] flex justify-center items-center gap-1.5 py-1 px-3 rounded-full">
                                                <span>
                                                    {width < 1024
                                                        ? abbreviateWords(
                                                              v.name
                                                          )
                                                        : v.name}
                                                </span>
                                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                                <span className="font-bold">
                                                    {v.major.name}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            key={`${v.id}:${v.major.id}`}
                                            className="text-white text-sm leading-[160%] flex justify-center items-center gap-1.5 border border-[#666666] py-1 px-3 rounded-full w-fit">
                                            <span>
                                                {width < 1024
                                                    ? abbreviateWords(v.name)
                                                    : v.name}
                                            </span>
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                            <span className="font-bold">
                                                {v.major.name}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {targetInstitutions?.length === 0 ? (
                    <Button
                        type="button"
                        variant="primary"
                        className={cn(
                            '!py-2 !px-3 text-sm font-semibold leading-tight w-full flex justify-center items-center gap-1',
                            'lg:w-fit'
                        )}>
                        Pilih Jurusan
                        <ChevronRightIcon className="shrink-0 text-white w-4 h-4" />
                    </Button>
                ) : (
                    <button
                        type="button"
                        className={cn(
                            'text-white font-semibold text-sm leading-tight flex justify-center items-center gap-2 py-2 w-full border border-[#999999] rounded-full hover:opacity-75 transition-all',
                            'lg:w-fit lg:px-4'
                        )}
                        onClick={handleClickButton}>
                        <PencilIcon className="shrink-0 text-white w-4 h-4" />
                        Ubah
                    </button>
                )}
            </div>

            <div
                className={cn(
                    'bg-[#282B3C] p-4 rounded-2xl w-full max-w-[343px] mx-auto space-y-4 mb-3',
                    'lg:space-y-0 lg:max-w-full lg:flex lg:justify-between lg:items-center lg:gap-4',
                    targetInstitutions?.length === 0
                        ? 'opacity-75 pointer-events-none'
                        : ''
                )}>
                <div
                    className={cn(
                        'space-y-2',
                        'lg:space-y-0 lg:flex lg:gap-4'
                    )}>
                    <div className="shrink-0 bg-white w-4 h-4 rounded-full grid place-items-center text-black text-xs font-medium leading-tight mb-2">
                        2
                    </div>

                    <div className="space-y-1 mb-4">
                        <h3 className="text-white font-semibold text-sm leading-tight">
                            Kerjakan Try Out
                        </h3>

                        <p className="text-[#DEDEDE] text-xs leading-[160%]">
                            Selesaikan soal Try Out gratis untuk mendapatkan
                            peta kekuatan dan kelemahan awalmu.
                        </p>
                    </div>
                </div>

                <Link
                    href="/utbk/try-out"
                    className={cn(
                        'shrink-0 bg-[#5F2BCE] text-white font-semibold text-sm leading-tight flex justify-center items-center gap-2 py-2 w-full rounded-full hover:opacity-75 transition-all',
                        'lg:w-fit lg:px-4'
                    )}>
                    Mulai Try Out
                    <ChevronRightIcon className="shrink-0 text-white w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

export { AnalyticsWall };
