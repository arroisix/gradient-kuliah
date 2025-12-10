import React from 'react';
import LatihanLayout from './LatihanLayout';
import ExerciseCompleteHeader from 'exercises/components/Header/ExerciseCompleteHeader';
import { useGetExerciseReportSummaryQuery } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import SummaryTab from 'exercises/components/Report/SummaryTab';
import { LeaderboardReport } from 'exercises/components/ExerciseDetail/Leaderboard';
import Skeleton from 'commons/components/elements/Skeleton';

const ExerciseLeaderboard: React.FC = () => {
    const router = useRouter();
    const { slug, exerciseProgressId } = router.query;

    const { data: summaryData, isLoading } = useGetExerciseReportSummaryQuery(
        {
            exercise_slug: slug as string,
            exercise_progress_id: exerciseProgressId as string
        },
        { skip: !slug || !exerciseProgressId }
    );

    return (
        <LatihanLayout>
            {/* Main wrapper: Ensures spacing for the fixed header */}
            <div className="flex flex-col gap-4 lg:gap-6 overflow-y-auto pb-12 lg:pb-0 pt-16 w-full h-full">
                <div className="fixed top-0 left-0 w-full z-10 flex items-center justify-center px-4 pt-6 pb-4 bg-black">
                    <div className="flex flex-col gap-4 lg:gap-6 max-w-screen-xl w-full">
                        <ExerciseCompleteHeader />
                    </div>
                </div>
                <div className="flex w-full flex-col-reverse lg:flex-row gap-5 lg:gap-10 justify-center h-auto lg:h-full lg:min-h-0 lg:overflow-hidden">
                    {isLoading && (
                        <div className="flex flex-col gap-2 w-full">
                            <Skeleton className="w-full h-20 bg-graphite-800 rounded-md" />
                            <Skeleton className="w-full h-60 bg-graphite-800 rounded-md" />
                            <Skeleton className="w-full h-60 bg-graphite-800 rounded-md" />
                        </div>
                    )}
                    {summaryData && !isLoading && (
                        <SummaryTab
                            percentile={summaryData?.percentile}
                            masteredTopics={summaryData?.mastered_topics}
                            topicsToImprove={summaryData?.topics_to_improve}
                            performanceBreakdown={
                                summaryData?.performance_breakdown
                            }
                        />
                    )}
                    <LeaderboardReport />
                </div>
            </div>
        </LatihanLayout>
    );
};

export default ExerciseLeaderboard;
