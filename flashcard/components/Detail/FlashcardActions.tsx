import React from 'react';
import { toast } from 'react-toastify';
import { RiShareForwardFill } from 'react-icons/ri';
import { FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
import ActionMenu from './ActionMenu';
import {
    useLikeFlashcardMutation,
    useDislikeFlashcardMutation
} from '../../redux/api/flashcardsApi';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';

interface FlashcardActionsProps {
    userInitials: string;
    userName: string;
    photo_profile?: string;
    onEdit: () => void;
    onDelete: () => void;
    createdByMe?: boolean;
    isLiked?: boolean;
    isDisliked?: boolean;
}

const FlashcardActions = ({
    userInitials,
    userName,
    photo_profile,
    onEdit,
    onDelete,
    createdByMe = true,
    isLiked = false,
    isDisliked = false
}: FlashcardActionsProps): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const [likeFlashcard, { isLoading: isLiking }] = useLikeFlashcardMutation();
    const [dislikeFlashcard, { isLoading: isDisliking }] =
        useDislikeFlashcardMutation();

    const handleShare = async () => {
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);
            toast.success('Link ke flashcards berhasil disalin', {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    };

    const handleLike = async () => {
        if (!slug || isLiking) return;
        try {
            await likeFlashcard({
                flashcard_slug: slug as string
            }).unwrap();
            toast.success('Penilaian flashcards tersimpan', {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (error) {
            console.error('Failed to like flashcards:', error);
        }
    };

    const handleDislike = async () => {
        if (!slug || isDisliking) return;
        try {
            await dislikeFlashcard({
                flashcard_slug: slug as string
            }).unwrap();
            toast.success('Penilaian flashcards tersimpan', {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (error) {
            console.error('Failed to dislike flashcards:', error);
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
                <div className="inline-flex items-center gap-2 px-4 text-sm font-semibold py-2 bg-[#333333] text-white hover:bg-opacity-80 transition-colors rounded-full">
                    <div className="flex items-center gap-3">
                        <button
                            className={cn(
                                'flex items-center gap-2 cursor-pointer',
                                isLiking && 'opacity-50 cursor-not-allowed'
                            )}
                            onClick={handleLike}>
                            <FiThumbsUp
                                size={20}
                                className={cn(
                                    'transition-colors',
                                    isLiked && 'fill-current'
                                )}
                            />
                            <span>Like</span>
                        </button>
                        <div className="w-[1px] h-4 bg-[#666666]" />
                        <button
                            className={cn(
                                'cursor-pointer',
                                isDisliking && 'opacity-50 cursor-not-allowed'
                            )}
                            onClick={handleDislike}>
                            <FiThumbsDown
                                size={20}
                                className={cn(
                                    'transition-colors',
                                    isDisliked && 'fill-current text-white',
                                    !isDisliked && 'text-white '
                                )}
                            />
                        </button>
                    </div>
                </div>

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
