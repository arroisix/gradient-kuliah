import { XIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { cn } from 'commons/utils';
import { useState } from 'react';
import ExerciseCloseModal from '../Modal/ExerciseCloseModal';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';

const ExerciseProblemSetHeader = ({
    isExerciseDetailPage = false
}: {
    isExerciseDetailPage?: boolean;
}) => {
    const router = useRouter();
    const { slug, exerciseProgressId } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleConfirmClose = (): void => {
        setIsModalOpen(false);
        router.push(`/latihan/${slug}`);
    };

    const { data: exercise } = useGetExerciseDetailV2Query(
        {
            exercise_slug: slug as string,
            exercise_progress_id: exerciseProgressId as string
        },
        {
            skip: !slug
        }
    );

    const onClose = () => {
        if (isExerciseDetailPage) router.push(`/latihan/`);
        else setIsModalOpen(true);
    };

    return (
        <header className="w-full flex items-center justify-between gap-4 relative px-4 lg:px-0 py-4 lg:py-0">
            <XIcon
                size={24}
                className={cn('cursor-pointer text-white')}
                onClick={onClose}
            />
            <div className="flex flex-col gap-1 items-center">
                <h1 className="text-xl lg:text-2xl text-white font-bold text-center">
                    Try Out - {exercise?.title}
                </h1>
                <h2 className="text-white text-lg font-semibold lg:hidden">
                    {exercise?.tryout_type === 'UTBK' ? 'Daftar' : 'Quiz'}{' '}
                    Section
                </h2>
            </div>
            <div
                className={cn(
                    'w-6',
                    exercise?.tryout_type !== 'UTBK' && 'lg:hidden'
                )}
            />
            <ExerciseCloseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmClose}
            />
        </header>
    );
};

export default ExerciseProblemSetHeader;
