import React from 'react';
import { ProblemReport } from '../../../types/exercises';
import { RecommendationCard } from '../Card/RecommendationCard';

interface ProblemSummaryTabProps {
    data: ProblemReport;
}

const ProblemSummaryTab: React.FC<ProblemSummaryTabProps> = ({ data }) => {
    return (
        <div className="w-full h-full flex flex-col space-y-4">
            <div className="bg-[#252A31] rounded-lg p-4 flex flex-row items-center gap-4">
                <div className="text-white text-4xl font-bold">
                    {data.performance.percentile.toFixed(1)}%
                </div>
                <div className="text-[#BBBBBB] text-sm">
                    {data.performance.message}
                </div>
            </div>

            {(data.topics_to_review.subchapters.length > 0 ||
                data.topics_to_review.chapter.length > 0) && (
                <div className="bg-[#252A31] rounded-lg p-4 border-t-2 border-[#EB5D49]">
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                        🚨 Perlu Belajar Lagi
                    </h3>
                    <div className="mb-2">
                        <div className="text-white text-sm font-semibold mb-2">
                            Chapter
                        </div>
                        {data.topics_to_review.chapter ? (
                            <div className="bg-[#4B4E5F] text-white px-3 py-1 rounded-full text-sm inline-block">
                                {data.topics_to_review.chapter}
                            </div>
                        ) : (
                            <div className="text-green-400 text-sm">
                                Hebat! Tidak ada Chapter yang perlu kamu
                                pelajari lagi
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-white text-sm font-semibold mb-2">
                            Subchapter
                        </div>
                        {data.topics_to_review.subchapters.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {data.topics_to_review.subchapters.map(
                                    (subchapter, index) => (
                                        <div
                                            key={index}
                                            className="bg-[#4B4E5F] text-white px-3 py-1 rounded-full text-sm">
                                            {subchapter}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="text-green-400 text-sm">
                                Hebat! Tidak ada Subchapter yang perlu kamu
                                pelajari lagi
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-[#252A31] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4">
                    Rekomendasi Materi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.recommended_materials.map((material, index) => (
                        <RecommendationCard key={index} material={material} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProblemSummaryTab;
