import { ExerciseDetail } from 'exercises/types/exercises';
import { ListIcon, TimerIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay } from 'react-icons/fa';

interface QuizContentProps {
    exerciseDetail: ExerciseDetail | undefined;
}

function QuizContent({ exerciseDetail }: QuizContentProps): JSX.Element {
    return (
        <div className="relative bg-[#191920] h-[calc(100vh-32px-30px-16px)] overflow-hidden lg:h-[calc(100vh-32px-36px-16px-48px)] lg:rounded-2xl">
            <div className="bg-[#494BA0] opacity-50 blur-[104px] w-[460px] h-[269px] absolute -bottom-[105px] -left-[186px] lg:-bottom-[69px] lg:-left-24"></div>
            <div className="bg-gradient-to-r from-[#F2C04C] via-[#E48E0D] to-[#E4B50D] opacity-20 blur-[104px] w-[460px] h-[269px] absolute -bottom-[105px] -right-[186px] lg:-bottom-[69px] lg:-right-24"></div>

            <div className="w-full max-w-[327px] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 lg:max-w-[700px]">
                <div className="w-fit mx-auto mb-3">
                    <Image
                        src="https://assets.gradient.academy/assets/target_institution_Ilustration.png"
                        width={80}
                        height={80}
                        className="select-none pointer-events-none"
                    />
                </div>

                <h2 className="text-white font-bold text-center mb-3 lg:text-xl">
                    Quiz: {exerciseDetail?.title}
                </h2>

                <p className="text-[#DEDEDE] text-center text-sm mb-8 lg:text-base">
                    Uji pemahaman kamu tentang materi {exerciseDetail?.title}.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-8 lg:max-w-[444px] lg:mx-auto">
                    <div className="bg-[#282B3C] rounded-xl w-[101px] h-[70px] flex flex-col justify-center items-center gap-2 lg:w-[140px]">
                        <ListIcon className="text-[#B6A6F3] w-5 h-5" />
                        <span className="text-white font-semibold">5 Soal</span>
                    </div>

                    <div className="bg-[#282B3C] rounded-xl w-[101px] h-[70px] flex flex-col justify-center items-center gap-2 lg:w-[140px]">
                        <TimerIcon className="text-[#B6A6F3] w-5 h-5" />
                        <span className="text-white font-semibold">
                            15 Menit
                        </span>
                    </div>

                    <div className="bg-[#282B3C] rounded-xl w-[101px] h-[70px] flex flex-col justify-center items-center gap-2 lg:w-[140px]">
                        <span className="text-[#B6A6F3] font-semibold">
                            60 poin
                        </span>
                        <span className="text-white font-semibold">
                            Min. Skor
                        </span>
                    </div>
                </div>

                <Link
                    href={`/latihan/${exerciseDetail?.slug}/${exerciseDetail?.first_problemset.id}/${exerciseDetail?.first_problemset.first_problem_id}`}
                    className="bg-[#5F2BCE] hover:bg-[#5F2BCE]/60 transition-all duration-300 text-white font-semibold rounded-full py-3 w-[180px] mx-auto flex justify-center items-center gap-3">
                    Mulai Kuis
                    <FaPlay className="shrink-0 text-white w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}

export { QuizContent };
