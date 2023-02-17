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
                        agar lulus tes ini
                    </span>
                </div>
            </div>
            {data && (
                <Button
                    variant="primary"
                    className="w-full text-center"
                    disabled={isLoading || questionSequence?.length === 0}
                    href={`/kelas/${id}/belajar/latihan/${worksheetId}/${
                        (questionSequence as string[])[0] as string
                    }`}>
                    Mulai tes
                </Button>
            )}
        </div>
    );
};

export default WorksheetInfoModalContent;
