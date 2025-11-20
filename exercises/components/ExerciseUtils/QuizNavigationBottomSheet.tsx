import React from 'react';
import QuizNavigationModal from './QuizNavigationModal';
import Modal from 'commons/components/modules/Modal';
import { XIcon } from 'lucide-react';

interface QuizNavigationBottomSheetProps {
    onProblemSelect: (problemId: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const QuizNavigationBottomSheet: React.FC<QuizNavigationBottomSheetProps> = ({
    onProblemSelect,
    isOpen,
    onClose
}) => {
    return (
        <Modal
            isOpen={isOpen}
            setOpen={onClose}
            permanent={true}
            variant="dark"
            className="md:!max-w-[400px] flex flex-col p-6 relative overflow-hidden gap-6">
            <div className="flex w-full items-center justify-between">
                <h2 className="text-white font-semibold">Quiz Navigation</h2>
                <XIcon
                    size={24}
                    className="cursor-pointer text-[#4D5165]"
                    onClick={onClose}
                />
            </div>
            <QuizNavigationModal
                onProblemSelect={onProblemSelect}
                onClose={onClose}
                className="bg-transparent p-0 w-full"
            />
        </Modal>
    );
};

export default QuizNavigationBottomSheet;
