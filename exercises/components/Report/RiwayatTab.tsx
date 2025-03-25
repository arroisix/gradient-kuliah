import React from 'react';
import { useTracker } from '../../../tracker/tracker';
import { useRouter } from 'next/router';

interface HistoryEntry {
    id: string;
    attempt: number;
    score: number;
    date: string;
    score_change: number | null;
}

interface RiwayatTabProps {
    history: HistoryEntry[];
    currentExerciseProgressId: string;
    onSelectExerciseProgress: (exerciseProgressId: string) => void;
}

const RiwayatTab: React.FC<RiwayatTabProps> = ({
    history,
    currentExerciseProgressId,
    onSelectExerciseProgress
}) => {
    const tracker = useTracker();
    const router = useRouter();
    const { slug } = router.query;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        return date.toLocaleDateString('id-ID', options);
    };

    const reversedHistory = [...history].reverse();

    const handleSelectExerciseProgress = (progressId: string) => {
        tracker?.genericTrack(
            'Click See Other Report Detail from History Tab',
            {
                EXERCISE_SLUG: slug as string,
                CURRENT_PROGRESS_ID: currentExerciseProgressId,
                TARGET_PROGRESS_ID: progressId
            }
        );
        onSelectExerciseProgress(progressId);
    };

    return (
        <div className="w-full h-full flex flex-col space-y-4">
            {reversedHistory.map((entry) => (
                <div
                    key={entry.id}
                    className={`flex flex-col bg-[#252A31] rounded-lg p-5 w-full gap-4 ${
                        entry.id === currentExerciseProgressId
                            ? 'border-l-2 border-[#5F2BCE]'
                            : ''
                    }`}>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-white text-lg font-semibold">
                                Percobaan #{entry.attempt}
                            </span>
                            <span className="text-[#BBBBBB] text-sm">
                                {entry.id === currentExerciseProgressId
                                    ? 'Saat ini'
                                    : formatDate(entry.date)}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-white text-2xl font-bold">
                                {entry.score}
                                <span className="text-[#999999] text-base">
                                    /100
                                </span>
                            </span>
                            {entry.score_change != null &&
                                entry.score_change !== 0 && (
                                    <div
                                        className={`text-sm ${
                                            entry.score_change > 0
                                                ? 'text-[#2AC179]'
                                                : 'text-[#EB5D49]'
                                        }`}>
                                        {`${entry.score_change > 0 ? '+' : ''}${
                                            entry.score_change
                                        } poin`}
                                    </div>
                                )}
                        </div>
                    </div>

                    {entry.id !== currentExerciseProgressId && (
                        <button
                            className="w-full py-3 rounded-full font-semibold bg-[#444444] text-white hover:bg-[#33373E] transition-colors"
                            onClick={() =>
                                handleSelectExerciseProgress(entry.id)
                            }>
                            Lihat Detail
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RiwayatTab;
