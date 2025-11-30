import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
    useGetCheckProblemsetCompletenessQuery,
    useGetProblemInProblemSetQuery
} from '../../redux/api/exercisesApi';
import { useTracker } from 'tracker/tracker';
import useSubmitAnswerHandler from 'exercises/hooks/useSubmitAnswerHandler';
import Skeleton from 'commons/components/elements/Skeleton';
import Modal from 'commons/components/modules/Modal';
import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import Image from 'next/image';

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
        <Modal
            isOpen={isOpen}
            setOpen={onClose}
            variant="dark"
            permanent={true}
            className={cn(
                '!max-w-full !w-full !m-0 !rounded-t-2xl !rounded-b-none fixed bottom-0 left-0 right-0 !max-h-[70vh] md:!max-h-none md:!rounded-b-2xl md:!rounded-t-2xl flex flex-col p-0 !overflow-hidden bg-[#1D1D1D]',
                'md:!max-w-sm lg:!max-w-xl md:!static md:!w-auto md:!bottom-auto'
            )}>
            <div
                className={cn(
                    'flex flex-col w-full h-[70vh] md:h-auto md:max-h-[90vh] overflow-y-auto px-6 py-8 justify-center'
                )}>
                {isLoading ? (
                    <div className="flex flex-col items-center gap-6">
                        <Skeleton
                            isCustomSize
                            className="w-1/2 md:w-1/3 h-32 md:h-28 lg:h-36"
                        />
                        <div className="w-full flex flex-col gap-3">
                            <Skeleton
                                isCustomSize
                                className="w-full h-9 rounded-full !mb-0"
                            />
                            <Skeleton
                                isCustomSize
                                className="w-full h-9 rounded-full !mb-0"
                            />
                        </div>
                        <div className="w-full flex flex-col lg:flex-row gap-4">
                            <Skeleton
                                isCustomSize
                                className="w-full h-11 rounded-full !mb-0"
                            />
                            <Skeleton
                                isCustomSize
                                className="w-full h-11 rounded-full !mb-0"
                            />
                        </div>
                    </div>
                ) : completenessData?.is_complete &&
                  !!problem?.next_problemset_id ? (
                    <>
                        <Image
                            src={`${CDN_URL}/assets/mobile-confirm-submit-modal.png`}
                            className="object-contain"
                            alt="confirm-exit-modal"
                            width={140}
                            height={140}
                        />
                        <h2 className="text-xl font-semibold text-white mb-4 text-center mt-6">
                            Submit dan pindah ke section berikutnya?
                        </h2>
                        <p className="text-[#999999] text-center mb-6">
                            Kamu sudah di akhir section. Setelah submit, kamu
                            tidak akan bisa kembali lagi ke section ini
                        </p>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-[#5F2BCE] font-semibold text-white py-2 lg:py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center w-full order-1 lg:order-2">
                                {isSubmitting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    'Submit & Pindah Section'
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="bg-white/10 font-semibold text-white py-2 lg:py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors w-full order-2 lg:order-1">
                                Kembali ke Latihan
                            </button>
                        </div>
                    </>
                ) : completenessData?.is_complete ? (
                    <>
                        <Image
                            src={`${CDN_URL}/assets/mobile-confirm-submit-modal.png`}
                            className="object-contain"
                            alt="confirm-exit-modal"
                            width={140}
                            height={140}
                        />
                        <h2 className="text-xl font-semibold text-white mb-4 text-center mt-6">
                            Submit dan selesaikan latihan?
                        </h2>
                        <p className="text-[#999999] text-center mb-6">
                            Kamu sudah di akhir latihan. Submit untuk
                            mendapatkan nilai latihan ini.
                        </p>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-[#5F2BCE] font-semibold text-white py-2 lg:py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center w-full order-1 lg:order-2">
                                {isSubmitting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    'Submit & Selesaikan'
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="bg-white/10 font-semibold text-white py-2 lg:py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors w-full order-2 lg:order-1">
                                Kembali ke Latihan
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Image
                            src={`${CDN_URL}/assets/blank-answer.png`}
                            className="object-contain"
                            alt="confirm-exit-modal"
                            width={140}
                            height={140}
                        />
                        <h2 className="text-xl font-semibold text-white mb-4 text-center mt-6">
                            Masih ada soal yang belum diawab di latihan ini
                        </h2>
                        <p className="text-[#999999] text-center mb-6">
                            Pastikan kamu sudah menjawab semua soal di latihan
                            ini sebelum submit.
                        </p>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <button
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="bg-white/10 font-semibold text-white py-2 lg:py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors w-full order-2 lg:order-1">
                                Kembali Latihan
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-[#EA5C49] font-semibold text-white py-2 lg:py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center w-full order-1 lg:order-2">
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
        </Modal>
    );
};

export default ExerciseFinishModal;
