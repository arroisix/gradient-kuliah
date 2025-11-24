import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
    useGetCheckProblemsetCompletenessQuery,
    useGetProblemInProblemSetQuery
} from '../../redux/api/exercisesApi';
import { useTracker } from 'tracker/tracker';
import useSubmitAnswerHandler from 'exercises/hooks/useSubmitAnswerHandler';
import Skeleton from 'commons/components/elements/Skeleton';

interface ExerciseFinishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    // TODO: deprecated, remove on next major version
    onReturnToExercise?: () => void;
    allProblemsAnswered?: boolean;
    slug?: string;
    exerciseProgressId?: string;
}

const ExerciseFinishModal: React.FC<ExerciseFinishModalProps> = ({
    isOpen,
    onClose
}) => {
    const tracker = useTracker();
    const router = useRouter();
    const { slug, exerciseProgressId, sectionId, problemId } = router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: sectionId as string,
            problemId: problemId as string,
            exercise_progress_id: exerciseProgressId as string
        },
        { skip: !slug || !sectionId || !problemId }
    );

    const { data: completenessData, isLoading } =
        useGetCheckProblemsetCompletenessQuery(
            {
                slug: slug as string,
                problemset_progress_id: problem?.id as string
            },
            {
                skip: !slug || !problem?.id || !isOpen,
                refetchOnMountOrArgChange: true,
                refetchOnFocus: true
            }
        );
    const { finishProblemSet } = useSubmitAnswerHandler(problem!);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        tracker?.genericTrack(
            completenessData?.is_complete
                ? 'Click Keep Finish Exercise'
                : 'Click Skip Empty Answer and Keep Finish Exercise',
            {
                EXERCISE_SLUG: slug
            }
        );
        setIsSubmitting(true);
        await finishProblemSet();
        setIsSubmitting(false);
        onClose();
    };

    const handleCancel = () => {
        tracker?.genericTrack(
            completenessData?.is_complete
                ? 'Click Cancel Button on Confirmation Modal'
                : 'Click Cancel Button on Confirmation Modal when Empty Answer',
            {
                EXERCISE_SLUG: slug
            }
        );
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-[#1D1D1D] rounded-2xl px-6 py-8 w-full max-w-[328px] md:max-w-sm">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Skeleton isCustomSize className="w-full h-6 !mb-2" />
                        <Skeleton isCustomSize className="w-3/4 h-6 !mb-4" />
                        <div className="w-full flex flex-col gap-4 mt-2">
                            <Skeleton
                                isCustomSize
                                className="w-full h-10 rounded-full !mb-0"
                            />
                            <Skeleton
                                isCustomSize
                                className="w-full h-10 rounded-full !mb-0"
                            />
                        </div>
                    </div>
                ) : completenessData?.is_complete ? (
                    <>
                        <h2 className="text-xl font-semibold text-white mb-4 text-center">
                            Kamu yakin mau submit semua jawaban di latihan ini?
                        </h2>
                        <p className="text-[#999999] text-center mb-6">
                            Setelah submit, kamu tidak bisa lagi mengubah
                            jawaban kamu di semua soal
                        </p>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-[#7F56D9] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center">
                                {isSubmitting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="bg-[#333540] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors">
                                Batal
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold text-white mb-4 text-center">
                            Masih ada soal yang belum kamu jawab di latihan ini
                        </h2>
                        <p className="text-[#999999] text-center mb-6">
                            Pastikan kamu sudah menjawab semua soal di latihan
                            ini sebelum submit
                        </p>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="bg-[#7F56D9] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors">
                                Kembali ke Latihan
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-[#EA5C49] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center">
                                {isSubmitting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    'Tetap Submit'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ExerciseFinishModal;
