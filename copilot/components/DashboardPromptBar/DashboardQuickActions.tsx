import React from 'react';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';
import { chatApi } from '../../redux/api/copilotApi';
import SearchActionButton from '../../assets/SearchActionButton';
import CameraActionButton from '../../assets/CameraActionButton';
import CardsActionButton from '../../assets/CardsActionButton';

interface DashboardQuickActionsProps {
    onImageCapture: () => void;
}

const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
    onImageCapture
}) => {
    const router = useRouter();
    const tracker = useTracker();

    const handleScanFotoSoal = () => {
        tracker?.genericTrack('Click Scan Foto Soal Button');
        onImageCapture();
    };

    const handleBuatFlashcard = () => {
        tracker?.genericTrack('Click Buat Flashcard Button');
        router.push('/flashcards');
    };

    const handleCariMateriDiGradient = async () => {
        tracker?.genericTrack('Click Cari Materi di Gradient Button');

        try {
            // Create a new session with the AI greeting message
            await chatApi.chat(
                { input_text: 'Cari Materi di Gradient' },
                {
                    onContent: () => {
                        // empty
                    },
                    onComplete: async (messageId, chatSessionId) => {
                        if (chatSessionId) {
                            await router.push(`/copilot/${chatSessionId}`);
                        }
                    },
                    onError: (error) => {
                        console.error('Chat error:', error);
                    }
                }
            );
        } catch (error) {
            console.error('Failed to create search session:', error);
        }
    };

    return (
        <div className="grid grid-cols-6 gap-2 mt-4">
            <button
                onClick={handleScanFotoSoal}
                className="flex items-center gap-2 p-2 bg-[#272727] hover:bg-[#333333] rounded-lg transition-colors">
                <CameraActionButton />
                <span className="text-white text-sm">Scan Foto Soal</span>
            </button>

            <button
                onClick={handleBuatFlashcard}
                className="flex items-center gap-2 p-2 bg-[#272727] hover:bg-[#333333] rounded-lg transition-colors">
                <CardsActionButton />
                <span className="text-white text-sm">Buat Flashcard</span>
            </button>

            <button
                onClick={handleCariMateriDiGradient}
                className="flex items-center gap-2 p-2 bg-[#272727] hover:bg-[#333333] rounded-lg transition-colors">
                <SearchActionButton />
                <span className="text-white text-sm">
                    Cari Materi di Gradient
                </span>
            </button>
        </div>
    );
};

export default DashboardQuickActions;
