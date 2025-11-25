import { XIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { cn } from 'commons/utils';
import { useState } from 'react';
import ExerciseCloseModal from '../Modal/ExerciseCloseModal';

const ExerciseProblemSetHeader = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleConfirmClose = (): void => {
        setIsModalOpen(false);
        router.push(`/latihan/${slug}`);
    };

    return (
        <header className="w-full flex items-center justify-between gap-4 relative px-4 lg:px-0 py-4 lg:py-0">
            <XIcon
                size={24}
                className={cn('cursor-pointer text-white')}
                onClick={() => setIsModalOpen(true)}
            />
            <h2 className="text-white text-lg font-semibold lg:hidden">
                Quiz Section
            </h2>
            <div className="w-6 lg:hidden" />
            <ExerciseCloseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmClose}
            />
        </header>
    );
};

export default ExerciseProblemSetHeader;
