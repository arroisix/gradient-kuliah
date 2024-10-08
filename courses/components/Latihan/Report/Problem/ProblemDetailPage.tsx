import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ProblemDetailContent from './ProblemDetailContent';
import ProblemSummaryTab from './ProblemSummaryTab';
import ProblemHistoryTab from './ProblemHistoryTab';
import {
    useGetExerciseProblemReportQuery,
    useGetExerciseReportQuery
} from '../../../../redux/api/exercisesApi';
import ExerciseHeader from '../../ExerciseHeader';
import Link from 'next/link';

type Tab = 'summary' | 'history';

const ProblemReportPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('summary');
    const router = useRouter();
    const { slug, exerciseProgressId, problemId } = router.query;

    const {
        data: problemReport,
        isLoading: isProblemLoading,
        error: problemError
    } = useGetExerciseProblemReportQuery({
        exercise_slug: slug as string,
        problem_id: problemId as string
    });

    const {
        data: exerciseReport,
        isLoading: isExerciseLoading,
        error: exerciseError
    } = useGetExerciseReportQuery({
        exercise_slug: slug as string,
        exercise_progress_id: exerciseProgressId as string
    });

    if (isProblemLoading || isExerciseLoading)
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );

    if (problemError || exerciseError) return <div>Error loading data</div>;
    if (!problemReport || !exerciseReport) return <div>No data available</div>;

    const currentProblemIndex = exerciseReport.problems.findIndex(
        (problem) => problem.id === problemId
    );

    const latestAttempt =
        problemReport.problems[problemReport.problems.length - 1];

    const handleProblemChange = (index: number) => {
        const newProblemId = exerciseReport.problems[index].id;
        router.push(
            `/latihan/${slug}/report/${exerciseProgressId}/${newProblemId}`
        );
    };

    return (
        <div className="flex justify-center items-start min-h-screen pb-20 h-fit bg-black">
            <div className="relative w-full max-w-[640px] px-4 sm:px-0">
                <ExerciseHeader title="Exercise Report" />
                <div className="overflow-hidden h-full">
                    <div className="h-full flex flex-col">
                        <div className="flex justify-center items-center mb-4 space-x-2 overflow-x-auto">
                            {exerciseReport.problems.map((problem, index) => (
                                <button
                                    key={problem.id}
                                    onClick={() => handleProblemChange(index)}
                                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                                        index === currentProblemIndex
                                            ? 'bg-white text-black'
                                            : 'bg-gray-700 text-white'
                                    }`}>
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <ProblemDetailContent problem={latestAttempt} />
                        <div className="flex space-x-4 mb-6">
                            <div className="flex items-end w-full border-b border-gray-700">
                                {['summary', 'history'].map((tab) => (
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
                                            : 'Summary'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            {activeTab === 'summary' && (
                                <ProblemSummaryTab data={latestAttempt} />
                            )}
                            {activeTab === 'history' && (
                                <ProblemHistoryTab data={latestAttempt} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 w-full p-4 bg-black flex justify-center">
                <div className="w-full max-w-[640px] flex justify-between">
                    <Link
                        className="w-full"
                        href={`/latihan/${slug}/report/${exerciseProgressId}`}
                        passHref>
                        <a className="w-full">
                            <button className="w-full py-3 rounded-full font-semibold bg-[#7F56D9] text-white hover:bg-[#6941C6] transition-colors">
                                Balik ke Laporan
                            </button>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProblemReportPage;
