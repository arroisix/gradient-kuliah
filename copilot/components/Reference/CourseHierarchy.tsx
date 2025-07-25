import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from 'commons/utils';
import Image from 'next/image';
import {
    useGetCourseChaptersQuery,
    useGetCourseSubchaptersQuery
} from 'copilot/redux/api/copilotApi';
import { CourseChapter, CourseSubchapter } from 'copilot/types/copilot';

interface CourseHierarchyProps {
    isOpen: boolean;
    onClose: () => void;
    courseSlug: string;
    courseName: string;
    courseThumbnail?: string | null;
    onVideoSelect: (videoId: string, videoTitle: string, chapterName: string, subchapterName: string) => void;
}

const CourseHierarchy: React.FC<CourseHierarchyProps> = ({
    isOpen,
    onClose,
    courseSlug,
    courseName,
    courseThumbnail,
    onVideoSelect
}) => {
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [hierarchySearch, setHierarchySearch] = useState('');

    const {
        data: chaptersData,
        isLoading: chaptersLoading,
        error: chaptersError
    } = useGetCourseChaptersQuery(courseSlug, {
        skip: !isOpen || !courseSlug
    });

    if (!isOpen) return null;

    const toggleChapter = (chapterId: string) => {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(chapterId)) {
            newExpanded.delete(chapterId);
        } else {
            newExpanded.add(chapterId);
        }
        setExpandedChapters(newExpanded);
    };

    const handleVideoClick = (subchapter: CourseSubchapter, chapterName: string) => {
        if (!selectedItems.has(subchapter.video_id)) {
            const newSelected = new Set(selectedItems);
            newSelected.add(subchapter.video_id);
            setSelectedItems(newSelected);
            onVideoSelect(subchapter.video_id, courseName, chapterName, subchapter.name);
        }
        onClose();
    };

    const renderChapter = (chapter: CourseChapter) => {
        const isExpanded = expandedChapters.has(chapter.id);
        
        return (
            <div key={chapter.id} className="mb-1">
                <button
                    onClick={() => toggleChapter(chapter.id)}
                    className={cn(
                        'w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors',
                        'hover:bg-white/5 text-left min-h-[40px]'
                    )}
                >
                    <span className="text-[#999999] text-sm font-medium leading-5">{chapter.title}</span>
                    <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                        {isExpanded ? (
                            <ChevronUp size={16} className="text-white/60" />
                        ) : (
                            <ChevronDown size={16} className="text-white/60" />
                        )}
                    </div>
                </button>
                
                {isExpanded && (
                    <div className="ml-6 border-l border-white/20">
                        <ChapterSubchapters chapterId={chapter.id} chapterName={chapter.title} />
                    </div>
                )}
            </div>
        );
    };

    const ChapterSubchapters: React.FC<{ chapterId: string; chapterName: string }> = ({ chapterId, chapterName }) => {
        const {
            data: subchaptersData,
            isLoading: subchaptersLoading,
            error: subchaptersError
        } = useGetCourseSubchaptersQuery(chapterId);

        if (subchaptersLoading) {
            return (
                <div className="flex items-center justify-center py-4">
                    <div className="w-4 h-4 border-2 border-[#5F2BCE] border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        if (subchaptersError || !subchaptersData?.data) {
            return (
                <div className="text-white/60 text-sm py-2 px-4">
                    Gagal memuat subchapters
                </div>
            );
        }

        return (
            <>
                {subchaptersData.data.map(subchapter => (
                    <button
                        key={subchapter.video_id}
                        onClick={() => handleVideoClick(subchapter, chapterName)}
                        className={cn(
                            'w-full flex items-center px-3 py-1.5 ml-4 rounded-lg transition-colors text-left',
                            'hover:bg-white/5',
                            selectedItems.has(subchapter.video_id) && 'bg-[#5F2BCE]/20 border border-[#5F2BCE]/50'
                        )}
                    >
                        <span className="text-[#999999] text-sm leading-5">{subchapter.name}</span>
                    </button>
                ))}
            </>
        );
    };

    if (chaptersLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#5F2BCE] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (chaptersError || !chaptersData?.data) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-white/60">Gagal memuat chapters course</p>
                </div>
            </div>
        );
    }

    if (chaptersData.data.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-white/60">Tidak ada chapters ditemukan</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="pb-6 mb-4">
                <form onSubmit={(e) => e.preventDefault()} className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari dalam course..."
                        value={hierarchySearch}
                        onChange={(e) => setHierarchySearch(e.target.value)}
                        className="w-full bg-[#222222] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#5F2BCE] transition-colors"
                    />
                </form>
            </div>

            <div className="pb-20">
                <div className="space-y-1">
                    {chaptersData.data.map(renderChapter)}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-[#2C2C2C] border border-transparent p-4 flex items-center gap-3 md:bottom-4 md:left-4 md:right-4 md:mx-16 md:mb-8 md:rounded-xl">
                <div className="relative aspect-[256/364] h-12 w-24 flex-shrink-0">
                    <Image
                        src={courseThumbnail ?? ''}
                        alt={courseName}
                        layout="fill"
                        objectPosition="center"
                        objectFit="cover"
                        className="rounded border border-neutral-700 shadow-lg md:rounded"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#999999] line-clamp-1 mb-1">
                        {courseName}
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CourseHierarchy;