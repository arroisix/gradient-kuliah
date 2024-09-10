import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ScoreCard from './ScoreCard';
import ExerciseHeader from '../ExerciseHeader';
import SummaryTab from './SummaryTab';
import RiwayatTab from './RiwayatTab';
import {
    useGetExerciseReportSummaryQuery,
    useGetExerciseHistoryQuery
} from '../../../redux/api/exercisesApi';
import Skeleton from 'commons/components/elements/Skeleton';
import ReviewTab from './ReviewTab';

type Tab = 'summary' | 'review' | 'history';

const ExerciseReportLayout: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('summary');
    const router = useRouter();
    const { slug } = router.query;

    const {
        data: summaryData,
        isLoading: isSummaryLoading,
        error: summaryError
    } = useGetExerciseReportSummaryQuery(
        { exercise_slug: slug as string },
        { skip: !slug }
    );

    const {
        data: historyData,
        isLoading: isHistoryLoading,
        error: historyError
    } = useGetExerciseHistoryQuery(
        { exercise_slug: slug as string },
        { skip: !slug }
    );

    if (isSummaryLoading || isHistoryLoading) {
        return <Skeleton className="w-full h-full" />;
    }

    if (summaryError || historyError || !summaryData || !historyData) {
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
                                <button
                                    className={`text-center text-sm py-3 border-b-2 flex-1 ${
                                        activeTab === 'summary'
                                            ? 'text-white border-purple-600'
                                            : 'text-gray-400 border-transparent'
                                    }`}
                                    onClick={() => setActiveTab('summary')}>
                                    Summary
                                </button>
                                <button
                                    className={`text-center text-sm py-3 border-b-2 flex-1 ${
                                        activeTab === 'review'
                                            ? 'text-white border-purple-600'
                                            : 'text-gray-400 border-transparent'
                                    }`}
                                    onClick={() => setActiveTab('review')}>
                                    Review
                                </button>
                                <button
                                    className={`text-center text-sm py-3 border-b-2 flex-1 ${
                                        activeTab === 'history'
                                            ? 'text-white border-purple-600'
                                            : 'text-gray-400 border-transparent'
                                    }`}
                                    onClick={() => setActiveTab('history')}>
                                    Riwayat
                                </button>
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
                            {activeTab === 'review' && <ReviewTab />}
                            {activeTab === 'history' && (
                                <RiwayatTab history={historyData.history} />
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
