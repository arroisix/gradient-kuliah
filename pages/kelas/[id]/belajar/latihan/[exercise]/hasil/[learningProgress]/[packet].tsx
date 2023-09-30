import { useRouter } from 'next/router';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import LearnLayout from 'commons/learnLayout';
import { useGetExamExerciseWorksheetQuery } from 'courses/redux/api/learningExperienceApi';
import Button from 'commons/components/elements/Button';
import { MdGrade } from 'react-icons/md';
import { AUTHENTICATION_ROUTE } from 'commons/constants';

const Hasil = (): JSX.Element => {
    const router = useRouter();
    const { id, exercise, learningProgress, packet } = router.query;
    const { data, isLoading } = useGetExamExerciseWorksheetQuery(
        {
            exercise_id: exercise as string,
            packet_id: packet as string,
            learning_progress_id: learningProgress as string
        },
        {
            refetchOnMountOrArgChange: true,
            skip:
                exercise === null ||
                exercise === undefined ||
                learningProgress === null ||
                learningProgress === undefined ||
                packet === null ||
                packet === undefined
        }
    );
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (id && !isAuthenticated) {
            router.push(AUTHENTICATION_ROUTE);
        }
    }, [isAuthenticated, id]);

    return (
        <LearnLayout hideNavbar>
            <div className="flex flex-col items-center justify-center w-full gap-4 px-4 py-32 md:p-32">
                <h5 className="text-2xl font-bold">{data?.exercise_name}</h5>
                {(data?.latest_exam_score as number) >= 0 && (
                    <div className="flex flex-col items-center justify-center w-full gap-2">
                        <span className="text-xl font-body text-neutral-200">
                            Skor Kamu
                        </span>
                        <div className="relative">
                            <div
                                className="z-10 radial-progress"
                                style={{
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    '--value': data?.latest_exam_score,
                                    '--size': '12rem'
                                }}>
                                <span className="font-bold text-7xl">
                                    {data?.latest_exam_score}
                                </span>
                            </div>
                            <div className="w-48 h-48 rounded-full top-0 left-auto right-auto absolute border-[20px] border-neutral-500" />
                        </div>
                        {data?.latest_exam_score && (
                            <h3 className="text-3xl font-bold text-center">
                                {data?.latest_exam_score < data?.treshold_score
                                    ? 'Semangat, kamu pasti bisa!'
                                    : 'Mantap jiwa! 👍👍'}
                            </h3>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-[#121212] p-2">
                        <MdGrade className="text-2xl" />
                    </div>
                    <div>
                        <h5 className="text-2xl font-bold">
                            Skor lulus: {data?.treshold_score}
                        </h5>
                        <span className="text-neutral-400">
                            Pastikan minimal skor kamu adalah{' '}
                            {data?.treshold_score} agar lulus tes ini dan bisa
                            melihat pembahasan soal
                        </span>
                    </div>
                </div>
                {data && data.exam_available && (
                    <Button
                        variant="primary"
                        className="text-center"
                        disabled={
                            isLoading || data.question_id_sequence?.length === 0
                        }
                        href={`/kelas/${id}/belajar/latihan/${exercise}/${
                            data.id
                        }/${
                            (data.question_id_sequence as string[])[0] as string
                        }`}>
                        {(data.latest_exam_score as number) >= 0
                            ? 'Coba lagi'
                            : 'Mulai tes'}
                    </Button>
                )}
                {data && !data.exam_available && (
                    <Button
                        variant="primary"
                        className="text-center"
                        disabled={
                            isLoading || data.question_id_sequence?.length === 0
                        }
                        href={`/kelas/${id}/belajar/latihan/${exercise}/${
                            data.id
                        }/${
                            (data.question_id_sequence as string[])[0] as string
                        }`}>
                        Lihat Pembahasan
                    </Button>
                )}
            </div>
        </LearnLayout>
    );
};

Hasil.displayName = 'Exercise Result';
export default Hasil;
