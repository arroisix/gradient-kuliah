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
        <div className="w-full h-full grid place-items-center space-y-4 py-6 px-4">
            <Image
                src={`${CDN_URL}/assets/utbk/dashboard/analytics_wall_icon.png`}
                width={80}
                height={80}
                alt=""
            />

            <div className="space-y-3 w-full max-w-[343px] mx-auto">
                <h2 className="text-white font-bold text-center w-full leading-[140%]">
                    Siap mengejar mimpi, {profile?.username}?
                </h2>

                <p className="text-[#999999] text-center text-sm leading-[160%]">
                    Selesaikan 2 langkah awal ini untuk mengaktifkan Dashboard
                    Analisis.
                </p>
            </div>

            <div className="bg-[#282B3C] p-4 rounded-2xl w-full max-w-[343px] mx-auto">
                {targetInstitutions?.length === 0 ? (
                    <div className="bg-white w-4 h-4 rounded-full grid place-items-center text-black text-xs font-medium leading-tight mb-2">
                        1
                    </div>
                ) : (
                    <FaCircleCheck className="text-[#03AC5C] w-4 h-4 mb-2" />
                )}

                <div
                    className={cn(
                        'mb-4',
                        targetInstitutions?.length === 0
                            ? 'space-y-1'
                            : 'space-y-2'
                    )}>
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
                        <div className="flex flex-wrap gap-2">
                            {targetInstitutions?.map((v, index) =>
                                index === 0 ? (
                                    <div
                                        key={`${v.id}:${v.major.id}`}
                                        className="bg-gradient-to-r from-[#D790DE] via-[#99B8DA] to-[#439CFB] p-[1px] rounded-full">
                                        <div className="bg-[#282B3C] text-white text-sm leading-[160%] flex justify-center items-center gap-1.5 py-1 px-3 rounded-full">
                                            <span>
                                                {abbreviateWords(v.name)}
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
                                        className="text-white text-sm leading-[160%] flex justify-center items-center gap-1.5 border border-[#666666] py-1 px-3 rounded-full">
                                        <span>{abbreviateWords(v.name)}</span>
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

                {targetInstitutions?.length === 0 ? (
                    <Button
                        type="button"
                        variant="primary"
                        className="!py-2 !px-3 text-sm font-semibold leading-tight w-full flex justify-center items-center gap-1">
                        Pilih Jurusan
                        <ChevronRightIcon className="shrink-0 text-white w-4 h-4" />
                    </Button>
                ) : (
                    <button
                        type="button"
                        className="text-white font-semibold text-sm leading-tight flex justify-center items-center gap-2 py-2 w-full border border-[#999999] rounded-full hover:opacity-75 transition-all"
                        onClick={handleClickButton}>
                        <PencilIcon className="shrink-0 text-white w-4 h-4" />
                        Ubah
                    </button>
                )}
            </div>

            <div
                className={cn(
                    'bg-[#282B3C] p-4 rounded-2xl w-full max-w-[343px] mx-auto',
                    targetInstitutions?.length === 0
                        ? 'opacity-75 pointer-events-none'
                        : ''
                )}>
                <div className="bg-white w-4 h-4 rounded-full grid place-items-center text-black text-xs font-medium leading-tight mb-2">
                    2
                </div>

                <div className="space-y-1 mb-4">
                    <h3 className="text-white font-semibold text-sm leading-tight">
                        Kerjakan Try Out
                    </h3>

                    <p className="text-[#DEDEDE] text-xs leading-[160%]">
                        Selesaikan soal Try Out gratis untuk mendapatkan peta
                        kekuatan dan kelemahan awalmu.
                    </p>
                </div>

                <Link
                    href="/utbk/try-out"
                    className="bg-[#5F2BCE] text-white font-semibold text-sm leading-tight flex justify-center items-center gap-2 py-2 w-full rounded-full hover:opacity-75 transition-all">
                    Mulai Try Out
                    <ChevronRightIcon className="shrink-0 text-white w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

export { AnalyticsWall };
