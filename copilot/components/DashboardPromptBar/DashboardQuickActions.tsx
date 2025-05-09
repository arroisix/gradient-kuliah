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
        router.push('/flashcards/create-ai');
    };

    const handleCariMateriDiGradient = async () => {
        tracker?.genericTrack('Click Cari Materi di Gradient Button');

        try {
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
        <div className="mt-4">
            <div className="flex flex-col items-center space-y-2 md:hidden">
                <button
                    onClick={handleScanFotoSoal}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#333333] rounded-lg transition-colors">
                    <span className="text-blue-400">
                        <CameraActionButton />
                    </span>
                    <span className="text-white text-sm">Scan Foto Soal</span>
                </button>

                <button
                    onClick={handleBuatFlashcard}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#333333] rounded-lg transition-colors">
                    <span className="text-amber-400">
                        <CardsActionButton />
                    </span>
                    <span className="text-white text-sm">Buat Flashcard</span>
                </button>

                <button
                    onClick={handleCariMateriDiGradient}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#333333] rounded-lg transition-colors">
                    <span className="text-purple-400">
                        <SearchActionButton />
                    </span>
                    <span className="text-white text-sm">
                        Cari Materi di Gradient
                    </span>
                </button>
            </div>

            <div className="hidden md:flex md:flex-wrap md:gap-2">
                <button
                    onClick={handleScanFotoSoal}
                    className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#333333] rounded-lg transition-colors">
                    <span className="text-blue-400">
                        <CameraActionButton />
                    </span>
                    <span className="text-white text-sm">Scan Foto Soal</span>
                </button>

                <button
                    onClick={handleBuatFlashcard}
                    className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#333333] rounded-lg transition-colors">
                    <span className="text-amber-400">
                        <CardsActionButton />
                    </span>
                    <span className="text-white text-sm">Buat Flashcard</span>
                </button>

                <button
                    onClick={handleCariMateriDiGradient}
                    className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#333333] rounded-lg transition-colors">
                    <span className="text-purple-400">
                        <SearchActionButton />
                    </span>
                    <span className="text-white text-sm">
                        Cari Materi di Gradient
                    </span>
                </button>
            </div>
        </div>
    );
};

export default DashboardQuickActions;
