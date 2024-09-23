import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ScoreCard from './ScoreCard';
import ExerciseHeader from '../ExerciseHeader';
import {
    useGetExerciseReportSummaryQuery,
    useGetExerciseHistoryQuery,
    useGetExerciseReportQuery
} from '../../../redux/api/exercisesApi';
import Skeleton from 'commons/components/elements/Skeleton';
import { useRouter } from 'next/router';

const SummaryTab = dynamic(() => import('./SummaryTab'), { ssr: false });
const ReviewTab = dynamic(() => import('./ReviewTab'), { ssr: false });
const RiwayatTab = dynamic(() => import('./RiwayatTab'), { ssr: false });

type Tab = 'summary' | 'review' | 'history';

interface ExerciseReportLayoutProps {
    slug: string;
    exerciseProgressId: string;
}

const ExerciseReportLayout: React.FC<ExerciseReportLayoutProps> = ({
    slug,
    exerciseProgressId
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('summary');
    const [currentExerciseProgressId, setCurrentExerciseProgressId] =
        useState(exerciseProgressId);
    const router = useRouter();

    const {
        data: summaryData,
        isLoading: isSummaryLoading,
        error: summaryError
    } = useGetExerciseReportSummaryQuery(
        { exercise_slug: slug, exercise_progress_id: exerciseProgressId },
        { skip: !slug || !exerciseProgressId }
    );

    const {
        data: reportData,
        isLoading: isReportLoading,
        error: reportError
    } = useGetExerciseReportQuery(
        { exercise_slug: slug, exercise_progress_id: exerciseProgressId },
        { skip: !slug || !exerciseProgressId }
    );

    const {
        data: historyData,
        isLoading: isHistoryLoading,
        error: historyError
    } = useGetExerciseHistoryQuery({ exercise_slug: slug }, { skip: !slug });

    const handleSelectExerciseProgress = (newExerciseProgressId: string) => {
        setCurrentExerciseProgressId(newExerciseProgressId);
        router.push(
            `/latihan/${slug}/report/${newExerciseProgressId}`,
            undefined,
            { shallow: true }
        );
    };

    if (isSummaryLoading || isReportLoading || isHistoryLoading) {
        return <Skeleton className="w-full h-full" />;
    }

    if (
        summaryError ||
        reportError ||
        historyError ||
        !summaryData ||
        !reportData ||
        !historyData
    ) {
        return <div>Error loading data</div>;
    }

    const hasImprovement = (() => {
        if (historyData.history.length > 1) {
            const latestAttempt =
                historyData.history[historyData.history.length - 1];
            const previousAttempt =
                historyData.history[historyData.history.length - 2];
            return latestAttempt.score > previousAttempt.score;
        }
        return false;
    })();

    return (
        <div className="flex justify-center items-start min-h-screen pb-20 h-fit bg-black">
            <div className="relative w-full max-w-[640px]">
                <ExerciseHeader title={'Exercise Report'} />
                <div className="overflow-hidden h-full">
                    <div className="h-full flex flex-col">
                        <ScoreCard
                            score={summaryData.score}
                            correctAnswers={summaryData.correct_answers}
                            incorrectAnswers={
                                summaryData.total_questions -
                                summaryData.correct_answers
                            }
                            improvement={hasImprovement}
                        />
                        <div className="flex space-x-4 mb-6">
                            <div className="flex items-end w-full border-b border-gray-700">
                                {['summary', 'review', 'history'].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`text-center text-sm py-3 border-b-2 flex-1 ${
                                            activeTab === tab
                                                ? 'text-white border-purple-600'
                                                : 'text-gray-400 border-transparent'
                                        }`}
                                        onClick={() =>
                                            setActiveTab(tab as Tab)
                                        }>
                                        {tab === 'history'
                                            ? 'Riwayat'
                                            : tab.charAt(0).toUpperCase() +
                                              tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            {activeTab === 'summary' && (
                                <SummaryTab
                                    percentile={summaryData.percentile}
                                    masteredTopics={summaryData.mastered_topics}
                                    topicsToImprove={
                                        summaryData.topics_to_improve
                                    }
                                    performanceBreakdown={
                                        summaryData.performance_breakdown
                                    }
                                />
                            )}
                            {activeTab === 'review' && (
                                <ReviewTab problems={reportData.problems} />
                            )}
                            {activeTab === 'history' && (
                                <RiwayatTab
                                    history={historyData.history}
                                    currentExerciseProgressId={
                                        currentExerciseProgressId
                                    }
                                    onSelectExerciseProgress={
                                        handleSelectExerciseProgress
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 w-full p-4 bg-black flex justify-center">
                <div className="w-[640px] flex justify-between gap-2">
                    <button className="w-full py-3 rounded-full font-semibold bg-[#4B5563] text-white hover:bg-[#374151] transition-colors">
                        Bagikan
                    </button>
                    <button className="w-full py-3 rounded-full font-semibold bg-[#7F56D9] text-white hover:bg-[#6941C6] transition-colors">
                        Coba Lagi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseReportLayout;
