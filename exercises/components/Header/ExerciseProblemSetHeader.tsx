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
        <header className="w-full flex items-center justify-between gap-4 relative">
            <XIcon
                size={24}
                className={cn(
                    'absolute lg:relative top-0 left-0 cursor-pointer'
                )}
                onClick={() => setIsModalOpen(true)}
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
