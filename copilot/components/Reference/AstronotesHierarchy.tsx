import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from 'commons/utils';
import { useDebounce } from 'commons/hooks/useDebounce';
import SearchResultCard from './SearchResultCard';
import {
    useGetAstronotesChaptersQuery,
    useGetAstronotesSubchaptersQuery,
    useGetAstronotesTopicsQuery,
    useLazySearchContentQuery
} from 'copilot/redux/api/copilotApi';
import { AstronotesChapter, AstronotesSubchapter, AstronotesTopic, ContentSearchItem } from 'copilot/types/copilot';

interface AstronotesHierarchyProps {
    isOpen: boolean;
    onClose: () => void;
    bookSlug: string;
    bookName: string;
    bookThumbnail?: string | null;
    onTopicSelect: (topicId: string, title: string, subtitle: string, header: string) => void;
}

const AstronotesHierarchy: React.FC<AstronotesHierarchyProps> = ({
    isOpen,
    onClose,
    bookSlug,
    bookName,
    bookThumbnail,
    onTopicSelect
}) => {
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [expandedSubchapters, setExpandedSubchapters] = useState<Set<string>>(new Set());
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [hierarchySearch, setHierarchySearch] = useState('');
    const [searchResults, setSearchResults] = useState<ContentSearchItem[]>([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const debouncedSearchTerm = useDebounce(hierarchySearch, 500);
    const [triggerSearch, { data: searchData, isLoading: searchLoading }] = useLazySearchContentQuery();

    const isSearching = debouncedSearchTerm.trim().length > 0;

    const {
        data: chaptersData,
        isLoading: chaptersLoading,
        error: chaptersError
    } = useGetAstronotesChaptersQuery(bookSlug, {
        skip: !isOpen || !bookSlug || isSearching
    });

    useEffect(() => {
        if (debouncedSearchTerm.trim()) {
            triggerSearch({
                q: debouncedSearchTerm,
                content_type: 'astronotes_content',
                book_slug: bookSlug
            });
        } else {
            setSearchResults([]);
        }
        setVisibleCount(10);
    }, [debouncedSearchTerm, bookSlug, triggerSearch]);

    useEffect(() => {
        if (searchData?.data) {
            setSearchResults(searchData.data);
        }
    }, [searchData]);

    const loadMoreResults = useCallback(() => {
        if (isLoadingMore || visibleCount >= searchResults.length) return;
        
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + 10, searchResults.length));
            setIsLoadingMore(false);
        }, 1000);
    }, [isLoadingMore, visibleCount, searchResults.length]);

    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;
        
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const threshold = 100;
        
        if (scrollHeight - scrollTop <= clientHeight + threshold) {
            loadMoreResults();
        }
    }, [loadMoreResults]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

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

    const toggleSubchapter = (subchapterId: string) => {
        const newExpanded = new Set(expandedSubchapters);
        if (newExpanded.has(subchapterId)) {
            newExpanded.delete(subchapterId);
        } else {
            newExpanded.add(subchapterId);
        }
        setExpandedSubchapters(newExpanded);
    };

    const handleTopicClick = (topic: AstronotesTopic | ContentSearchItem, chapterName: string, subchapterName: string) => {
        const topicId = 'page_id' in topic ? topic.page_id : topic.id;
        
        if (!selectedItems.has(topicId)) {
            const newSelected = new Set(selectedItems);
            newSelected.add(topicId);
            setSelectedItems(newSelected);
            
            if ('header' in topic) {
                onTopicSelect(topic.id, topic.title, topic.subtitle || '', topic.header);
            } else {
                onTopicSelect(topic.page_id, bookName, chapterName, subchapterName);
            }
        }
        onClose();
    };

    const renderSearchResults = () => {
        if (searchLoading) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-[#5F2BCE] border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        if (searchResults.length === 0 && debouncedSearchTerm.trim()) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <p className="text-white/60">Tidak ada hasil ditemukan untuk "{debouncedSearchTerm}"</p>
                    </div>
                </div>
            );
        }

        const visibleResults = searchResults.slice(0, visibleCount);
        const hasMore = visibleCount < searchResults.length;

        return (
            <div className="space-y-3">
                {visibleResults.map(item => (
                    <SearchResultCard
                        key={item.id}
                        header={item.header}
                        title={item.subtitle || 'Chapter Name'}
                        subtitle=""
                        searchTerm={debouncedSearchTerm}
                        onClick={() => handleTopicClick(item, '', '')}
                    />
                ))}
                
                {hasMore && isLoadingMore && (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-[#5F2BCE] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        );
    };

    const renderChapter = (chapter: AstronotesChapter) => {
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
                    <span className="text-[#999999] text-sm font-medium leading-5">{chapter.value}</span>
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
                        <ChapterSubchapters chapter={chapter} />
                    </div>
                )}
            </div>
        );
    };

    const ChapterSubchapters: React.FC<{ chapter: AstronotesChapter }> = ({ chapter }) => {
        const {
            data: subchaptersData,
            isLoading: subchaptersLoading,
            error: subchaptersError
        } = useGetAstronotesSubchaptersQuery({
            bookSlug,
            pageOrder: chapter.page_order,
            chapterId: chapter.id
        });

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
                    <div key={subchapter.id} className="ml-4 mb-1">
                        <button
                            onClick={() => toggleSubchapter(subchapter.id)}
                            className={cn(
                                'w-full flex items-center justify-between px-4 py-1.5 rounded-lg transition-colors',
                                'hover:bg-white/5 text-left min-h-[36px]'
                            )}
                        >
                            <span className="text-[#999999] text-sm leading-5">{subchapter.value}</span>
                            <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                                {expandedSubchapters.has(subchapter.id) ? (
                                    <ChevronUp size={16} className="text-white/60" />
                                ) : (
                                    <ChevronDown size={16} className="text-white/60" />
                                )}
                            </div>
                        </button>
                        
                        {expandedSubchapters.has(subchapter.id) && (
                            <div className="ml-4 border-l border-white/20">
                                <SubchapterTopics subchapter={subchapter} chapterName={chapter.value} />
                            </div>
                        )}
                    </div>
                ))}
            </>
        );
    };

    const SubchapterTopics: React.FC<{ subchapter: AstronotesSubchapter; chapterName: string }> = ({ subchapter, chapterName }) => {
        const {
            data: topicsData,
            isLoading: topicsLoading,
            error: topicsError
        } = useGetAstronotesTopicsQuery({
            bookSlug,
            pageOrder: subchapter.page_order,
            subchapterId: subchapter.id
        });

        if (topicsLoading) {
            return (
                <div className="flex items-center justify-center py-2">
                    <div className="w-3 h-3 border-2 border-[#5F2BCE] border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        if (topicsError || !topicsData?.data) {
            return (
                <div className="text-white/60 text-xs py-1 px-4">
                    Gagal memuat topics
                </div>
            );
        }

        return (
            <>
                {topicsData.data.map(topic => (
                    <button
                        key={topic.id}
                        onClick={() => handleTopicClick(topic, chapterName, subchapter.value)}
                        className={cn(
                            'w-full flex items-center px-3 py-1.5 ml-4 rounded-lg transition-colors text-left',
                            'hover:bg-white/5',
                            selectedItems.has(topic.page_id) && 'bg-[#5F2BCE]/20 border border-[#5F2BCE]/50'
                        )}
                    >
                        <span className="text-[#999999] text-sm leading-5">{topic.value}</span>
                    </button>
                ))}
            </>
        );
    };

    if (chaptersLoading && !isSearching) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#5F2BCE] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (chaptersError && !isSearching) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-white/60">Gagal memuat chapters astronotes</p>
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
                        placeholder="Cari dalam astronotes..."
                        value={hierarchySearch}
                        onChange={(e) => setHierarchySearch(e.target.value)}
                        className="w-full bg-[#222222] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#5F2BCE] transition-colors"
                    />
                </form>
            </div>

            <div 
                ref={scrollContainerRef}
                className="pb-20 overflow-y-auto md:h-[calc(100vh-280px)]"
            >
                {isSearching ? (
                    renderSearchResults()
                ) : (
                    <div className="space-y-1">
                        {chaptersData?.data && chaptersData.data.length > 0 ? (
                            chaptersData.data.map(renderChapter)
                        ) : (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <p className="text-white/60">Tidak ada chapters ditemukan</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
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
                    <div className="rounded-full text-xs w-fit text-white font-semibold px-3 py-1 bg-[#CC009E]">
                        Astronotes
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

export default AstronotesHierarchy;