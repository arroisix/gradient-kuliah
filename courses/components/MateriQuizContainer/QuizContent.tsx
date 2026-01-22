import { ExerciseDetail } from 'exercises/types/exercises';
import { ListIcon, TimerIcon } from 'lucide-react';
import Image from 'next/image';
import { FaArrowRotateRight, FaPlay } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { exerciseApi } from 'exercises/redux/api/exercisesApi';
import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface QuizContentProps {
    exerciseDetail: ExerciseDetail | undefined;
    subchapter: SubChapter;
}

function QuizContent({
    exerciseDetail,
    subchapter
}: QuizContentProps): JSX.Element {
    const dispatch = useDispatch();
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const isEverCompleted =
        exerciseDetail?.latest_exercise_progress?.status === 'COMPLETED';

    const userScore =
        ((exerciseDetail?.latest_exercise_progress?.correct_answers ?? 0) /
            (exerciseDetail?.latest_exercise_progress?.total_questions ?? 0)) *
        100;

    const handleClick = () => {
        dispatch(exerciseApi.util.invalidateTags(['EXERCISES']));
        router.push(
            `/latihan/${exerciseDetail?.slug}/${exerciseDetail?.first_problemset.id}/${exerciseDetail?.first_problemset.first_problem_id}`
        );
    };

    return (
        <div className="bg-[#191920] relative overflow-hidden h-[calc(100vh-32px-30px-16px)] lg:h-[calc(100vh-32px-36px-16px-48px)] lg:rounded-2xl">
            <div className="bg-[#494BA0] opacity-50 blur-[104px] w-[460px] h-[269px] absolute -bottom-[105px] -left-[186px] lg:-bottom-[69px] lg:-left-24"></div>
            <div className="bg-gradient-to-r from-[#F2C04C] via-[#E48E0D] to-[#E4B50D] opacity-20 blur-[104px] w-[460px] h-[269px] absolute -bottom-[105px] -right-[186px] lg:-bottom-[69px] lg:-right-24"></div>

            <div className="relative z-0 grid place-items-center overflow-scroll no-scrollbar py-4 h-[calc(100vh-16px-30px-16px-80px)] lg:h-[calc(100vh-32px-36px-16px-32px-48px)]">
                <div className="w-full max-w-[327px] lg:max-w-[700px]">
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
                        Uji pemahaman kamu tentang materi{' '}
                        {exerciseDetail?.title}.
                    </p>

                    <div className="grid grid-cols-3 gap-3 lg:max-w-[444px] lg:mx-auto">
                        <div className="bg-[#282B3C] rounded-xl w-[101px] h-[70px] flex flex-col justify-center items-center gap-2 lg:w-[140px]">
                            <ListIcon className="text-[#B6A6F3] w-5 h-5" />
                            <span className="text-white font-semibold">
                                {exerciseDetail?.total_problems} Soal
                            </span>
                        </div>

                        <div className="bg-[#282B3C] rounded-xl w-[101px] h-[70px] flex flex-col justify-center items-center gap-2 lg:w-[140px]">
                            <TimerIcon className="text-[#B6A6F3] w-5 h-5" />
                            <span className="text-white font-semibold">
                                {(exerciseDetail?.total_duration ?? 0) / 60}{' '}
                                Menit
                            </span>
                        </div>

                        <div className="bg-[#282B3C] rounded-xl w-[101px] h-[70px] flex flex-col justify-center items-center gap-2 lg:w-[140px]">
                            <span className="text-[#B6A6F3] font-semibold">
                                {exerciseDetail?.minimum_score} poin
                            </span>
                            <span className="text-white font-semibold">
                                Min. Skor
                            </span>
                        </div>
                    </div>

                    {isEverCompleted ? (
                        <div className="bg-[#282B3C] border border-[#B6A6F3] p-4 rounded-xl mt-8 w-full max-w-[327px] mx-auto lg:max-w-[193px]">
                            <h3 className="text-white font-bold text-center mb-1">
                                Nilai Akhir Kamu
                            </h3>

                            <div className="flex justify-center items-center gap-2 mb-4">
                                <span
                                    className={`${
                                        userScore === 100
                                            ? 'text-[#03AC5C]'
                                            : 'text-white'
                                    } font-bold text-[32px] leading-[120%]`}>
                                    {userScore}
                                </span>
                                <span className="text-[#999999] leading-[120%]">
                                    / 100
                                </span>
                            </div>

                            <Link
                                href={`/latihan/${exerciseDetail.slug}/report/${exerciseDetail.latest_exercise_progress.id}`}
                                className="text-[#B6A6F3] font-semibold text-sm block w-fit mx-auto">
                                Lihat Hasil
                            </Link>
                        </div>
                    ) : (
                        <></>
                    )}

                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button
                            onClick={handleClick}
                            className={`${
                                isEverCompleted ? 'flex-row-reverse' : ''
                            } text-white !py-3 w-[180px] flex justify-center items-center gap-3`}
                            variant={isEverCompleted ? 'secondary' : 'primary'}>
                            {isEverCompleted ? 'Coba lagi' : 'Mulai Kuis'}
                            {isEverCompleted ? (
                                <FaArrowRotateRight className="shrink-0 text-white w-4 h-4" />
                            ) : (
                                <FaPlay className="shrink-0 text-white w-4 h-4" />
                            )}
                        </Button>

                        {isEverCompleted && subchapter.next_subchapter_slug ? (
                            <Link
                                href={
                                    subchapter.next_subchapter_slug
                                        ? `/utbk/materi/${slug_subtest}/${subchapter.next_chapter_slug}/${subchapter.next_subchapter_slug}`
                                        : '/utbk/materi'
                                }
                                className="bg-[#5F2BCE] hover:bg-[#5F2BCE]/60 transition-all duration-300 text-white text-center rounded-full leading-tight font-semibold p-3 px-4 w-[180px] hidden lg:block">
                                Selanjutnya
                            </Link>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { QuizContent };
