import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import { ExerciseDetail } from 'exercises/types/exercises';
import { useRouter } from 'next/router';
import {
    IoMdMegaphone,
    IoIosNotifications,
    IoMdCheckmark
} from 'react-icons/io';
import { useWindowSize } from 'usehooks-ts';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';

const ScoreNotPublished = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { width } = useWindowSize();

    const { data: exercise, isLoading } = useGetExerciseDetailV2Query(
        { exercise_slug: slug as string },
        {
            skip: !slug
        }
    );

    const onClose = () => {
        router.push(`/latihan/`);
    };

    if (isLoading || !exercise) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-full h-[60vh]" />
            </div>
        );
    }

    return (
        <div className="w-full h-full items-center justify-center">
            <div className="h-full flex flex-col gap-6 items-center justify-center w-full px-4">
                <div className="w-[100px] md:w-[120px] h-[100px] md:h-[120px] rounded-full bg-[#282B3C] flex items-center justify-center">
                    <div className="w-[80px] md:w-[98px] h-[80px] md:h-[98px] rounded-full bg-state-success flex items-center justify-center">
                        <IoMdCheckmark
                            size={width < 768 ? 60 : 76}
                            color="white"
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-3">
                    <h1 className="text-xl md:text-2xl font-bold text-white text-center">
                        Jawaban Berhasil Disimpan
                    </h1>
                    <h3 className="text-[#999999] text-sm text-center">
                        Terima kasih sudah ikut Try Out. Kamu sudah selangkah
                        lebih dekat ke kampus impian.
                    </h3>
                </div>

                <div className="p-4 rounded-2xl relative bg-[#20222E] w-full lg:w-auto">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-white font-semibold text-sm md:text-base">
                            Kenapa nilaiku belum muncul?
                        </h2>

                        <p className="text-white text-xs md:text-sm">
                            Agar analisis sistem IRT (Item Response Theory)
                            akurat, hasil akan diproses setelah Try Out
                            berakhir.
                        </p>

                        <div className="flex flex-col gap-2">
                            <PublishScoreInfo
                                type="PUBLISH_SCORE"
                                exercise={exercise}
                            />
                            <PublishScoreInfo
                                type="NOTIFICATION"
                                exercise={exercise}
                            />
                        </div>
                    </div>

                    <div className="absolute top-0 right-0">
                        <Image
                            src={`${CDN_URL}/assets/utbk-score-not-published.png`}
                            alt="UTBK score not published"
                            width={120}
                            height={120}
                        />
                    </div>
                </div>

                <Button
                    variant="primary"
                    size={width < 768 ? 'normal' : 'large'}
                    className="w-full lg:w-1/3"
                    onClick={onClose}>
                    Lihat Try Out lainnya
                </Button>
            </div>
        </div>
    );
};

const PublishScoreInfo = ({
    type,
    exercise
}: {
    type: 'PUBLISH_SCORE' | 'NOTIFICATION';
    exercise: ExerciseDetail;
}) => {
    // Helper function to format date and time
    const formatDateTime = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const dateOptions: Intl.DateTimeFormatOptions = {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            };
            const timeOptions: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta'
            };

            const formattedDate = date.toLocaleDateString('id-ID', dateOptions);
            const formattedTime = date.toLocaleTimeString('id-ID', timeOptions);

            return `${formattedDate}, ${formattedTime} WIB`;
        } catch (error) {
            return dateString; // Return original string if parsing fails
        }
    };

    return (
        <div className="flex flex-row items-center gap-3 p-3 rounded-lg bg-[#252246]">
            {type === 'PUBLISH_SCORE' ? (
                <>
                    <IoMdMegaphone size={20} color="#B6A6F3" />
                    <span className="text-xs text-white">
                        Hasil diumumkan serentak :{' '}
                        <span className="font-bold">
                            {formatDateTime(
                                exercise.score_published_at as string
                            )}
                        </span>
                    </span>
                </>
            ) : (
                <>
                    <IoIosNotifications size={20} color="#B6A6F3" />
                    <span className="text-xs text-white">
                        Notifikasi akan dikirim ke email kamu, pastikan email
                        kamu aktif ya!
                    </span>
                </>
            )}
        </div>
    );
};

export default ScoreNotPublished;
