import React from 'react';
import { useRouter } from 'next/router';
import { useUpdateExerciseProgressMutation } from '../../redux/api/exercisesApi';

interface ExerciseFinishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onReturnToExercise?: () => void;
    allProblemsAnswered: boolean;
    slug: string;
    exerciseProgressId: string;
}

const ExerciseFinishModal: React.FC<ExerciseFinishModalProps> = ({
    isOpen,
    onClose,
    onReturnToExercise,
    allProblemsAnswered,
    slug,
    exerciseProgressId
}) => {
    const router = useRouter();
    const [updateExerciseProgress] = useUpdateExerciseProgressMutation();

    if (!isOpen) return null;

    const handleSubmit = async () => {
        try {
            await updateExerciseProgress({
                exercise_slug: slug,
                progress_id: exerciseProgressId,
                data: { status: 'COMPLETED' }
            }).unwrap();

            await router.push(`/latihan/${slug}/report/${exerciseProgressId}`);
        } catch (error) {
            console.error('Failed to submit exercise:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-[#1D1D1D] rounded-2xl px-6 py-8 w-full max-w-[328px] md:max-w-sm">
                {allProblemsAnswered ? (
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
                                className="w-full bg-[#7F56D9] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors">
                                Submit
                            </button>
                            <button
                                onClick={onClose}
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
                                onClick={onReturnToExercise}
                                className="bg-[#7F56D9] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors">
                                Kembali ke Latihan
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-[#EA5C49] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors">
                                Tetap Submit
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ExerciseFinishModal;
