import React from 'react';

interface SummaryTabProps {
    percentile: number;
    masteredTopics: string[];
    topicsToImprove: string[];
    performanceBreakdown: Array<{
        topic: string;
        avg_time: number;
        correct: number;
        total: number;
        related_subchapters: string[];
        recommendation: Array<{
            id: string;
            name: string;
            type: string;
        }>;
    }>;
}

const SummaryTab: React.FC<SummaryTabProps> = ({
    percentile,
    masteredTopics,
    topicsToImprove,
    performanceBreakdown
}) => {
    return (
        <div className="w-full h-full flex flex-col space-y-4">
            <div className="text-white text-base font-bold">
                Analisis Hasil Latihan
            </div>
            <div className="flex flex-row items-center justify-between bg-[#252A31] rounded-lg p-5 gap-2">
                <div className="text-white text-3xl font-semibold">
                    {percentile}%
                </div>
                <div className="text-[#BBBBBB] text-base font-normal">
                    Peraih nilai tertinggi kuis ini termasuk kamu!
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-[#252A31] rounded-lg border-t-2 border-[#2AC179] p-5 flex flex-col gap-4 flex-1">
                    <div className="text-white font-semibold flex items-center gap-2">
                        ✅<span>Paling Dikuasai</span>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full h-auto">
                        {masteredTopics.length > 0 ? (
                            masteredTopics.map((topic, index) => (
                                <div
                                    key={index}
                                    className="bg-[#4B4E5F] text-white px-4 py-2 rounded-full text-xs sm:text-sm">
                                    {topic}
                                </div>
                            ))
                        ) : (
                            <div className="text-white text-xs sm:text-sm">
                                Belum ada topik yang dikuasai
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-[#252A31] rounded-lg border-t-2 border-[#EB5D49] p-5 flex flex-col gap-4 flex-1">
                    <div className="text-white font-semibold flex items-center gap-2">
                        🚨<span>Perlu Belajar Lagi</span>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full h-auto">
                        {topicsToImprove.length > 0 ? (
                            topicsToImprove.map((topic, index) => (
                                <div
                                    key={index}
                                    className="bg-[#4B4E5F] text-white px-4 py-2 rounded-full text-xs sm:text-sm">
                                    {topic}
                                </div>
                            ))
                        ) : (
                            <div className="text-white text-xs sm:text-sm">
                                Tidak ada topik untuk diperbaiki
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {performanceBreakdown.length > 0 && (
                <div className="bg-[#252A31] rounded-lg p-5 max-w-[640px] h-auto flex flex-col gap-4">
                    <div className="text-white text-base font-bold">
                        Urutan Kesulitanmu
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[#BBBBBB]">
                                <th className="w-1/12">No</th>
                                <th className="w-7/12">Topik</th>
                                <th className="w-4/12 text-right">
                                    Avg. Time/Soal
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {performanceBreakdown.map((item, index) => (
                                <tr key={index} className="items-center">
                                    <td className="text-white py-2">
                                        {index + 1}
                                    </td>
                                    <td className="py-2">
                                        <div className="bg-[#4B4E5F] text-white px-2 py-[2px] rounded-sm text-sm inline-block break-words">
                                            {item.topic}
                                        </div>
                                    </td>
                                    <td
                                        className={`text-right py-2 ${
                                            item.avg_time > 60
                                                ? 'text-[#EB5D49]'
                                                : 'text-[#2AC179]'
                                        }`}>
                                        {item.avg_time > 60
                                            ? `${(item.avg_time / 60).toFixed(
                                                  1
                                              )} menit`
                                            : `${item.avg_time.toFixed(
                                                  1
                                              )} detik`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SummaryTab;
