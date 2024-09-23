import React from 'react';
import { ProblemReport } from '../../../../types/exercises';

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

            {data.topics_to_review.subchapters.length > 0 && (
                <div className="bg-[#252A31] rounded-lg p-4 border-t-2 border-[#EB5D49]">
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                        🚨 Perlu Belajar Lagi
                    </h3>
                    <div className="mb-2">
                        <div className="text-white text-sm font-semibold mb-2">
                            Chapter
                        </div>
                        <div className="bg-[#4B4E5F] text-white px-3 py-1 rounded-full text-sm inline-block">
                            {data.topics_to_review.chapter ||
                                'No chapter specified'}
                        </div>
                    </div>
                    <div>
                        <div className="text-white text-sm font-semibold mb-2">
                            Subchapter
                        </div>
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
                    </div>
                </div>
            )}

            <div className="bg-[#252A31] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4">
                    Rekomendasi Materi
                </h3>
                <div className="space-y-3">
                    {data.recommended_materials.map((material, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-[#1B2129] rounded-lg p-2">
                            {material.type === 'Video' ? (
                                <div className="w-12 h-12 bg-gray-600 rounded-md mr-3 flex items-center justify-center">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M10 8L16 12L10 16V8Z"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-gray-600 rounded-md mr-3"></div>
                            )}
                            <div>
                                <h4 className="text-white text-sm font-medium">
                                    {material.name}
                                </h4>
                                <p className="text-[#BBBBBB] text-xs">
                                    {material.type}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProblemSummaryTab;
