import { useRouter } from 'next/router';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetExamExerciseWorksheetQuery } from 'courses/redux/api/learningExperienceApi';
import Button from 'commons/components/elements/Button';
import { MdGrade, MdOutlineHelpCenter } from 'react-icons/md';

const WorksheetInfoModalContent = ({
    exercise_id,
    packet_id
}: {
    exercise_id: string;
    packet_id: string;
}): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { learning_progress_id } = useCourseSubscription(id as string);
    const { data, isLoading } = useGetExamExerciseWorksheetQuery(
        {
            exercise_id,
            packet_id,
            learning_progress_id: learning_progress_id as string
        },
        {
            refetchOnMountOrArgChange: true
        }
    );
    const questionSequence = data?.question_id_sequence;
    const worksheetId = data?.id;

    return (
        <div className="p-4 w-full flex flex-col gap-4">
            <h5 className="text-2xl font-bold">{data?.exercise_name}</h5>
            {data?.latest_exam_score && (
                <div className="w-full flex justify-center items-center flex-col gap-2">
                    <span className="font-body text-xl text-neutral-200">
                        Skor Kamu
                    </span>
                    <div className="relative">
                        <div
                            className="radial-progress z-10"
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
                        <h3 className="font-bold text-3xl text-center">
                            {data?.latest_exam_score < data?.treshold_score
                                ? 'Semangat, kamu pasti bisa!'
                                : 'Mantap jiwa! 👍👍'}
                        </h3>
                    )}
                </div>
            )}
            <div className="flex gap-2 items-center">
                <div className="rounded-full bg-[#121212] p-2">
                    <MdOutlineHelpCenter className="text-2xl" />
                </div>
                <div>
                    <h5 className="text-2xl font-bold">
                        {data?.question_count} Soal
                    </h5>
                    <span className="text-neutral-400">
                        Terdiri dari {data?.question_count} Soal pilihan ganda
                    </span>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <div className="rounded-full bg-[#121212] p-2">
                    <MdGrade className="text-2xl" />
                </div>
                <div>
                    <h5 className="text-2xl font-bold">
                        Skor lulus: {data?.treshold_score}
                    </h5>
                    <span className="text-neutral-400">
                        Pastikan minimal skor kamu adalah {data?.treshold_score}{' '}
                        agar lulus tes ini dan bisa melihat pembahasan soal
                    </span>
                </div>
            </div>
            {data && data.exam_available && (
                <Button
                    variant="primary"
                    className="w-full text-center"
                    disabled={isLoading || questionSequence?.length === 0}
                    href={`/kelas/${id}/belajar/latihan/${exercise_id}/${worksheetId}/${
                        (questionSequence as string[])[0] as string
                    }`}>
                    {data.latest_exam_score ? 'Coba lagi' : 'Mulai tes'}
                </Button>
            )}
            {data && !data.exam_available && (
                <Button
                    variant="primary"
                    className="w-full text-center"
                    disabled={isLoading || questionSequence?.length === 0}
                    href={`/kelas/${id}/belajar/latihan/${exercise_id}/${worksheetId}/${
                        (questionSequence as string[])[0] as string
                    }`}>
                    Lihat Pembahasan
                </Button>
            )}
        </div>
    );
};

export default WorksheetInfoModalContent;
