import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from 'commons/utils';
import {
    useGetTextbookChaptersQuery,
    useGetTextbookSectionsQuery,
    useGetTextbookProblemsQuery
} from 'copilot/redux/api/copilotApi';
import { TextbookChapter, TextbookProblem } from 'copilot/types/copilot';

interface TextbookHierarchyProps {
    isOpen: boolean;
    onClose: () => void;
    bookSlug: string;
    bookName: string;
    bookThumbnail?: string | null;
    onProblemSelect: (problemId: string, problemTitle: string) => void;
}

const TextbookHierarchy: React.FC<TextbookHierarchyProps> = ({
    isOpen,
    onClose,
    bookSlug,
    bookName,
    bookThumbnail,
    onProblemSelect
}) => {
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [hierarchySearch, setHierarchySearch] = useState('');

    const {
        data: chaptersData,
        isLoading: chaptersLoading,
        error: chaptersError
    } = useGetTextbookChaptersQuery(bookSlug, {
        skip: !isOpen || !bookSlug
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

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };

    const handleProblemClick = (problem: TextbookProblem) => {
        if (!selectedItems.has(problem.id)) {
            const newSelected = new Set(selectedItems);
            newSelected.add(problem.id);
            setSelectedItems(newSelected);
            onProblemSelect(problem.id, problem.title);
        }
        onClose();
    };

    const renderChapter = (chapter: TextbookChapter) => {
        const isExpanded = expandedChapters.has(chapter.id);
        
        return (
            <div key={chapter.id} className="mb-1">
                <button
                    onClick={() => toggleChapter(chapter.id)}
                    className={cn(
                        'w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors',
                        'hover:bg-white/5 text-left'
                    )}
                >
                    <span className="text-[#999999] text-sm font-medium">{chapter.title}</span>
                    {isExpanded ? (
                        <ChevronDown size={16} className="text-white/60 flex-shrink-0" />
                    ) : (
                        <ChevronUp size={16} className="text-white/60 flex-shrink-0" />
                    )}
                </button>
                
                {isExpanded && (
                    <div className="ml-6 border-l border-white/20">
                        <ChapterSections chapterId={chapter.id} />
                    </div>
                )}
            </div>
        );
    };

    const ChapterSections: React.FC<{ chapterId: string }> = ({ chapterId }) => {
        const {
            data: sectionsData,
            isLoading: sectionsLoading,
            error: sectionsError
        } = useGetTextbookSectionsQuery(chapterId);

        if (sectionsLoading) {
            return (
                <div className="flex items-center justify-center py-4">
                    <div className="w-4 h-4 border-2 border-[#5F2BCE] border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        if (sectionsError || !sectionsData?.data) {
            return (
                <div className="text-white/60 text-sm py-2 px-4">
                    Gagal memuat sections
                </div>
            );
        }

        return (
            <>
                {sectionsData.data.map(section => (
                    <div key={section.id} className="ml-4 mb-1">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className={cn(
                                'w-full flex items-center justify-between pr-4 py-1.5 rounded-lg transition-colors',
                                'hover:bg-white/5 text-left'
                            )}
                        >
                            <span className="text-[#999999] text-sm">{section.title}</span>
                            {expandedSections.has(section.id) ? (
                                <ChevronDown size={14} className="text-white/60 flex-shrink-0" />
                            ) : (
                                <ChevronUp size={14} className="text-white/60 flex-shrink-0" />
                            )}
                        </button>
                        
                        {expandedSections.has(section.id) && (
                            <div className="ml-4 border-l border-white/20">
                                <SectionProblems sectionId={section.id} />
                            </div>
                        )}
                    </div>
                ))}
            </>
        );
    };

    const SectionProblems: React.FC<{ sectionId: string }> = ({ sectionId }) => {
        const {
            data: problemsData,
            isLoading: problemsLoading,
            error: problemsError
        } = useGetTextbookProblemsQuery(sectionId);

        if (problemsLoading) {
            return (
                <div className="flex items-center justify-center py-2">
                    <div className="w-3 h-3 border-2 border-[#5F2BCE] border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        if (problemsError || !problemsData?.data) {
            return (
                <div className="text-white/60 text-xs py-1 px-4">
                    Gagal memuat problems
                </div>
            );
        }

        return (
            <>
                {problemsData.data.map(problem => (
                    <button
                        key={problem.id}
                        onClick={() => handleProblemClick(problem)}
                        className={cn(
                            'w-full flex items-center px-3 py-1.5 ml-4 rounded-lg transition-colors text-left',
                            'hover:bg-white/5',
                            selectedItems.has(problem.id) && 'bg-[#5F2BCE]/20 border border-[#5F2BCE]/50'
                        )}
                    >
                        <span className="text-[#999999] text-sm">{problem.title}</span>
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
                    <p className="text-white/60">Gagal memuat chapters textbook</p>
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
                        placeholder="Cari dalam textbook..."
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

            <div className="absolute bottom-0 left-0 right-0 bg-[#101010] border-t border-white/10 p-6">
                <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg">
                    <div className="w-16 h-20 bg-[#222222] rounded-lg flex-shrink-0 overflow-hidden">
                        {bookThumbnail ? (
                            <img 
                                src={bookThumbnail} 
                                alt={bookName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white/40 text-xs">No Image</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm mb-1 truncate">{bookName}</h3>
                        <p className="text-white/60 text-xs">Textbook</p>
                        {selectedItems.size > 0 && (
                            <p className="text-[#5F2BCE] text-xs mt-1">
                                {selectedItems.size} soal dipilih
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextbookHierarchy;