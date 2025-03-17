import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ScoreCard from './ScoreCard';
import ExerciseHeader from '../Header/ExerciseHeader';
import {
    useGetExerciseReportSummaryQuery,
    useGetExerciseHistoryQuery,
    useGetExerciseReportQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTracker } from 'tracker/tracker';

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
    const tracker = useTracker();
    const [activeTab, setActiveTab] = useState<Tab>('summary');
    const [currentExerciseProgressId, setCurrentExerciseProgressId] =
        useState(exerciseProgressId);
    const router = useRouter();

    useEffect(() => {
        if (activeTab === 'review') {
            tracker?.genericTrack('Visit Latihan Review Page', {
                EXERCISE_SLUG: slug,
                PROGRESS_ID: exerciseProgressId
            });
        }
        if (activeTab === 'history') {
            tracker?.genericTrack('Visit Latihan History Page', {
                EXERCISE_SLUG: slug,
                PROGRESS_ID: exerciseProgressId
            });
        }
    }, [activeTab, slug, exerciseProgressId, tracker]);

    const {
        data: summaryData,
        isLoading: isSummaryLoading,
        error: summaryError
    } = useGetExerciseReportSummaryQuery(
        { exercise_slug: slug, exercise_progress_id: exerciseProgressId },
        { skip: !slug || !exerciseProgressId || activeTab !== 'summary' }
    );

    const {
        data: reportData,
        isLoading: isReportLoading,
        error: reportError
    } = useGetExerciseReportQuery(
        { exercise_slug: slug, exercise_progress_id: exerciseProgressId },
        { skip: !slug || !exerciseProgressId || activeTab !== 'review' }
    );

    const {
        data: historyData,
        isLoading: isHistoryLoading,
        error: historyError
    } = useGetExerciseHistoryQuery(
        { exercise_slug: slug },
        { skip: !slug || activeTab !== 'history' }
    );

    const handleSelectExerciseProgress = (
        newExerciseProgressId: string
    ): void => {
        setCurrentExerciseProgressId(newExerciseProgressId);
        router.replace(
            `/latihan/${slug}/report/${newExerciseProgressId}`,
            undefined,
            { shallow: true }
        );
    };

    if (isSummaryLoading || isReportLoading || isHistoryLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );
    }

    if (summaryError || reportError || historyError) {
        return <div>Error loading data</div>;
    }

    const hasImprovement = (() => {
        if (historyData && historyData?.history.length > 1) {
            const latestAttempt =
                historyData?.history[historyData?.history.length - 1];
            const previousAttempt =
                historyData?.history[historyData?.history.length - 2];
            return latestAttempt?.score > previousAttempt?.score;
        }
        return false;
    })();

    return (
        <div className="flex justify-center items-start min-h-screen pb-36 sm:pb-20 h-fit bg-black">
            <div className="relative w-full max-w-[640px] px-4 sm:px-0">
                <ExerciseHeader title={'Exercise Report'} />
                <div className="overflow-hidden h-full">
                    <div className="h-full flex flex-col">
                        {summaryData && (
                            <ScoreCard
                                score={summaryData.score}
                                correctAnswers={summaryData.correct_answers}
                                incorrectAnswers={
                                    summaryData.total_questions -
                                    summaryData.correct_answers
                                }
                                improvement={hasImprovement}
                            />
                        )}
                        <div className="flex space-x-4 mb-6">
                            <div className="flex items-end w-full border-b border-gray-700">
                                {['summary', 'review', 'history'].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`text-center text-xs sm:text-sm py-3 border-b-2 flex-1 ${
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
                            {activeTab === 'summary' && summaryData && (
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
                            {activeTab === 'review' && reportData && (
                                <ReviewTab problems={reportData.problems} />
                            )}
                            {activeTab === 'history' && historyData && (
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
                <div className="w-full max-w-[640px] flex flex-col sm:flex-row justify-between gap-2">
                    <button
                        onClick={() => {
                            router.back();
                            tracker?.genericTrack('Click Finish Button', {
                                EXERCISE_SLUG: slug,
                                PROGRESS_ID: exerciseProgressId
                            });
                        }}
                        className="w-full py-3 rounded-full font-semibold bg-[#4B5563] text-white hover:bg-[#374151] transition-colors text-center">
                        Selesai
                    </button>
                    <Link
                        href={`/latihan/${slug}?reattempt=1`}
                        className="w-full py-3 rounded-full font-semibold bg-[#7F56D9] text-white hover:bg-[#6941C6] transition-colors text-center"
                        passHref
                        replace
                        onClick={() => {
                            tracker?.genericTrack('Click Try Again Button', {
                                EXERCISE_SLUG: slug,
                                PROGRESS_ID: exerciseProgressId
                            });
                        }}>
                        <a>Coba Lagi</a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ExerciseReportLayout;
