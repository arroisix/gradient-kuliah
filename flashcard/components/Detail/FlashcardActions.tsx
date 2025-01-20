import React from 'react';
import { toast } from 'react-toastify';
import { RiShareForwardFill } from 'react-icons/ri';
import ActionMenu from './ActionMenu';

interface FlashcardActionsProps {
    userInitials: string;
    userName: string;
    photo_profile?: string;
    onEdit: () => void;
    onDelete: () => void;
    createdByMe?: boolean;
}

const FlashcardActions = ({
    userInitials,
    userName,
    photo_profile,
    onEdit,
    onDelete,
    createdByMe = true
}: FlashcardActionsProps): JSX.Element => {
    const handleShare = async () => {
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);
            toast.success('Link ke flashcard berhasil disalin', {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    };

    return (
        <div className="flex gap-6 md:gap-0 md:items-center flex-col md:flex-row justify-between mb-6">
            <div className="flex items-center gap-2">
                {photo_profile ? (
                    <img
                        src={photo_profile}
                        alt={userName}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-[#5F2BCE] flex items-center justify-center text-white text-sm">
                        {userInitials}
                    </div>
                )}
                <div>
                    <p className="text-sm text-neutral-400">Dibuat oleh</p>
                    <p className="font-medium text-white">{userName}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-4 text-sm font-semibold py-2 bg-[#333333] text-white hover:bg-opacity-80 transition-colors rounded-full">
                    <RiShareForwardFill size={20} />
                    <span>Bagikan</span>
                </button>

                {createdByMe && (
                    <ActionMenu onEdit={onEdit} onDelete={onDelete} />
                )}
            </div>
        </div>
    );
};

export default FlashcardActions;
