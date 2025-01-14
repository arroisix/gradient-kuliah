import React from 'react';
import { BsFillPencilFill } from 'react-icons/bs';

interface EmptyStateProps {
    onWrite: () => void;
    createdByMe?: boolean;
}

const EmptyState = ({
    onWrite,
    createdByMe = true
}: EmptyStateProps): JSX.Element => {
    return (
        <div className="bg-[#222222] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-white mb-4">
                        {createdByMe
                            ? 'Yah... flashcard kamu masih kosong'
                            : 'Yah... flashcard ini masih kosong'}
                    </h2>
                    {createdByMe && (
                        <button
                            onClick={onWrite}
                            className="inline-flex items-center gap-2 bg-[#5F2BCE] text-white px-4 py-2 rounded-full hover:opacity-90 transition-colors text-sm font-semibold">
                            <BsFillPencilFill size={16} />
                            <span>Tulis Flashcard</span>
                        </button>
                    )}
                </div>
                <div className="w-24 h-24"></div>
            </div>
        </div>
    );
};

export default EmptyState;
