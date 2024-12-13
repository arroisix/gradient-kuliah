import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Library } from 'lucide-react';
import { FiArrowUpLeft } from 'react-icons/fi';
import { ContentRecommendation } from '../../types/copilot';

interface ContentRecommendationsProps {
    keyword: string;
    recommendations: ContentRecommendation[];
    isLoading: boolean;
}

const ContentRecommendations: React.FC<ContentRecommendationsProps> = ({
    keyword,
    recommendations,
    isLoading
}) => {
    const getContentUrl = (content: ContentRecommendation): string => {
        switch (content.type) {
            case 'course_video':
                return content.course_slug && content.subchapter_slug
                    ? `/kelas/${content.course_slug}/${content.subchapter_slug}`
                    : '#';
            case 'astronotes_content':
                return content.book_slug && content.book_page
                    ? `/perpustakaan/astronotes/${content.book_slug}/${content.book_page}`
                    : '#';
            case 'textbook_problem':
                return content.book_slug && content.problem_slug
                    ? `/perpustakaan/textbook/${content.book_slug}/${content.problem_slug}`
                    : '#';
            case 'bank_soal_problem':
                return content.book_slug && content.problem_slug
                    ? `/perpustakaan/bank-soal/${content.book_slug}/${content.problem_slug}`
                    : '#';
            default:
                return '#';
        }
    };

    const SkeletonCard = () => (
        <div className="flex-shrink-0 bg-[#222222] w-[280px] rounded-lg overflow-hidden flex flex-col h-[140px]">
            <div className="flex flex-col h-full p-3">
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-neutral-800 rounded animate-pulse w-full" />
                    <div className="h-3 bg-neutral-800 rounded animate-pulse w-5/6" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-neutral-800 rounded animate-pulse" />
                    <div className="h-3 bg-neutral-800 rounded animate-pulse w-24" />
                </div>
            </div>
        </div>
    );

    const renderRecommendations = () => {
        if (!isLoading && (!recommendations || recommendations.length === 0)) {
            return null;
        }

        return (
            <div className="relative w-full">
                <div className="absolute left-0 right-0">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar">
                        {isLoading ? (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        ) : (
                            recommendations.map((content, index) => (
                                <Link
                                    key={index}
                                    href={getContentUrl(content)}
                                    className="flex-shrink-0 bg-[#222222] w-[280px] rounded-lg overflow-hidden flex flex-col hover:bg-[#2C2C2C] transition-colors duration-200">
                                    {content.type === 'course_video' ? (
                                        <>
                                            {content.thumbnail && (
                                                <div className="relative aspect-video w-full">
                                                    <Image
                                                        src={content.thumbnail}
                                                        alt={
                                                            content.subchapter_name ||
                                                            ''
                                                        }
                                                        layout="fill"
                                                        className="object-cover"
                                                        priority
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                                                            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                                                    {content.subchapter_name && (
                                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                                            <p className="text-[10px] text-white font-medium line-clamp-2">
                                                                {
                                                                    content.subchapter_name
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col h-full p-3">
                                            {content.snippet && (
                                                <p
                                                    className="text-sm text-white flex-1"
                                                    dangerouslySetInnerHTML={{
                                                        __html: content.snippet.replace(
                                                            /<mark>(.*?)<\/mark>/g,
                                                            '<span class="text-[#F2C04C]">$1</span>'
                                                        )
                                                    }}
                                                />
                                            )}
                                            <div className="flex items-center gap-2 mt-3">
                                                <Library
                                                    size={16}
                                                    className="text-[#7D89CC]"
                                                />
                                                <p className="text-sm text-[#999999] transition-colors">
                                                    {content.book_name}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
                <div className="h-[160px]" />
            </div>
        );
    };

    return (
        <div className="mt-4 space-y-4">
            <button
                onClick={() => {
                    window.location.href = `/search/results?q=${encodeURIComponent(
                        keyword
                    )}`;
                }}
                className="w-full px-4 py-3 text-start text-neutral-400 hover:bg-[#222222] rounded-lg transition-colors flex items-center justify-between border border-[#333333]">
                <span className="text-sm">Lihat materi terkait</span>
                <FiArrowUpLeft className="text-neutral-400" />
            </button>
            {renderRecommendations()}
        </div>
    );
};

export default ContentRecommendations;
