import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from 'commons/utils';
import Image from 'next/image';
import {
    useGetBankSoalChaptersQuery,
    useGetBankSoalSectionsQuery,
    useGetBankSoalProblemsQuery
} from 'copilot/redux/api/copilotApi';
import { BankSoalChapter, BankSoalProblem } from 'copilot/types/copilot';

interface BankSoalHierarchyProps {
    isOpen: boolean;
    onClose: () => void;
    bookSlug: string;
    bookName: string;
    bookThumbnail?: string | null;
    onProblemSelect: (problemId: string, title: string, subtitle: string, header: string) => void;
}

const BankSoalHierarchy: React.FC<BankSoalHierarchyProps> = ({
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
    } = useGetBankSoalChaptersQuery(bookSlug, {
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

    const handleProblemClick = (problem: BankSoalProblem, chapterName: string) => {
        if (!selectedItems.has(problem.id)) {
            const newSelected = new Set(selectedItems);
            newSelected.add(problem.id);
            setSelectedItems(newSelected);
            onProblemSelect(problem.id, bookName, chapterName, problem.title);
        }
        onClose();
    };

    const renderChapter = (chapter: BankSoalChapter) => {
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
                        <ChapterContent chapterId={chapter.id} chapterName={chapter.title} />
                    </div>
                )}
            </div>
        );
    };

    const ChapterContent: React.FC<{ chapterId: string; chapterName: string }> = ({ chapterId, chapterName }) => {
        const {
            data: sectionsData,
            isLoading: sectionsLoading,
        } = useGetBankSoalSectionsQuery(chapterId);

        const {
            data: directProblemsData,
            isLoading: directProblemsLoading,
        } = useGetBankSoalProblemsQuery({ chapterId });

        if (sectionsLoading || directProblemsLoading) {
            return (
                <div className="flex items-center justify-center py-4">
                    <div className="w-4 h-4 border-2 border-[#5F2BCE] border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        const hasSections = sectionsData?.data && sectionsData.data.length > 0;
        const hasDirectProblems = directProblemsData?.data && directProblemsData.data.length > 0;

        return (
            <>
                {hasSections && sectionsData.data.map(section => (
                    <div key={section.id} className="ml-4 mb-1">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className={cn(
                                'w-full flex items-center justify-between px-4 py-1.5 rounded-lg transition-colors',
                                'hover:bg-white/5 text-left min-h-[36px]'
                            )}
                        >
                            <span className="text-[#999999] text-sm leading-5">{section.title}</span>
                            <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                                {expandedSections.has(section.id) ? (
                                    <ChevronUp size={16} className="text-white/60" />
                                ) : (
                                    <ChevronDown size={16} className="text-white/60" />
                                )}
                            </div>
                        </button>
                        
                        {expandedSections.has(section.id) && (
                            <div className="ml-4 border-l border-white/20">
                                <SectionProblems sectionId={section.id} chapterName={chapterName} />
                            </div>
                        )}
                    </div>
                ))}

                {hasDirectProblems && directProblemsData.data.map(problem => (
                    <button
                        key={problem.id}
                        onClick={() => handleProblemClick(problem, chapterName)}
                        className={cn(
                            'w-full flex items-center px-3 py-1.5 ml-4 rounded-lg transition-colors text-left',
                            'hover:bg-white/5',
                            selectedItems.has(problem.id) && 'bg-[#5F2BCE]/20 border border-[#5F2BCE]/50'
                        )}
                    >
                        <span className="text-[#999999] text-sm leading-5">{problem.title}</span>
                    </button>
                ))}

                {!hasSections && !hasDirectProblems && (
                    <div className="text-white/60 text-sm py-2 px-4">
                        Tidak ada soal ditemukan
                    </div>
                )}
            </>
        );
    };

    const SectionProblems: React.FC<{ sectionId: string; chapterName: string }> = ({ sectionId, chapterName }) => {
        const {
            data: problemsData,
            isLoading: problemsLoading,
            error: problemsError
        } = useGetBankSoalProblemsQuery({ sectionId });

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
                        onClick={() => handleProblemClick(problem, chapterName)}
                        className={cn(
                            'w-full flex items-center px-3 py-1.5 ml-4 rounded-lg transition-colors text-left',
                            'hover:bg-white/5',
                            selectedItems.has(problem.id) && 'bg-[#5F2BCE]/20 border border-[#5F2BCE]/50'
                        )}
                    >
                        <span className="text-[#999999] text-sm leading-5">{problem.title}</span>
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
                    <p className="text-white/60">Gagal memuat chapters bank soal</p>
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
                        placeholder="Cari dalam bank soal..."
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
                <div className="relative aspect-[256/364] h-12 flex-shrink-0">
                    <Image
                        src={bookThumbnail ?? ''}
                        alt={bookName}
                        layout="fill"
                        objectPosition="center"
                        objectFit="cover"
                        className="rounded border border-neutral-700 shadow-lg md:rounded"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#999999] line-clamp-1 mb-1">
                        {bookName}
                    </h3>
                    <div className="rounded-full text-xs w-fit text-white font-semibold px-3 py-1 bg-[#0083FF]">
                        Bank Soal
                    </div>
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

export default BankSoalHierarchy;