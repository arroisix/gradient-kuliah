import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useLazyGetContentRecommendationQuery } from '../redux/api/copilotApi';
import { useGetProfileQuery } from 'authentication/redux/api/authApi';
import { ContentRecommendation } from '../types/copilot';
import ReferenceCard from '../components/Reference/ReferenceCard';
import { cn } from 'commons/utils';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ReferenceRecommendationContainerProps {
    initialQuery?: string;
    className?: string;
}

const useItemsPerPage = () => {
    const [itemsPerPage, setItemsPerPage] = useState(9);

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage(5);
            } else {
                setItemsPerPage(9);
            }
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    return itemsPerPage;
};

const ReferenceRecommendationContainer = ({
    initialQuery = '',
    className
}: ReferenceRecommendationContainerProps): JSX.Element => {
    const [currentTab, setCurrentTab] = useState<'Semua' | 'Kelas' | 'Perpustakaan'>('Semua');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = useItemsPerPage();
    
    const isAuthenticated = useSelector(getIsAuthenticated);
    
    const { data: profileData } = useGetProfileQuery({}, { 
        skip: !isAuthenticated 
    });
    
    const [triggerSearch, { data, isLoading, error }] = useLazyGetContentRecommendationQuery();
    
    const recommendations = data?.recommendation || [];
    const userMajor = profileData?.major || '';

    useEffect(() => {
        if (isAuthenticated && userMajor && !initialQuery) {
            triggerSearch(userMajor);
        } else if (initialQuery) {
            triggerSearch(initialQuery);
        }
    }, [isAuthenticated, userMajor, initialQuery, triggerSearch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [currentTab]);

    const getFilteredRecommendations = () => {
        if (currentTab === 'Semua') return recommendations;
        if (currentTab === 'Kelas') {
            return recommendations.filter(rec => 
                rec.type === 'course_video' || rec.type === 'astronotes_content'
            );
        }
        if (currentTab === 'Perpustakaan') {
            return recommendations.filter(rec => 
                rec.type === 'textbook_problem' || rec.type === 'bank_soal_problem'
            );
        }
        return recommendations;
    };

    const filteredRecommendations = getFilteredRecommendations();
    const totalPages = Math.ceil(filteredRecommendations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRecommendations = filteredRecommendations.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getPaginationNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(i);
                }
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    if (!isAuthenticated) {
        return (
            <div className={cn("flex-1 flex flex-col h-full", className)}>
                <div className="flex items-center justify-center h-full">
                    <p className="text-white/60">Please login to view recommendations</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex-1 flex flex-col h-full overflow-hidden", className)}>
            <div className="flex-shrink-0 pt-4 pb-6">
                <div className="relative mb-4">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari kelas atau buku"
                        className="w-full bg-[#222222] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#5F2BCE]"
                    />
                </div>
                
                <div className="flex">
                    {(['Semua', 'Kelas', 'Perpustakaan'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setCurrentTab(tab)}
                            className={cn(
                                "flex-1 py-3 text-sm font-medium transition-all duration-200 relative text-center",
                                currentTab === tab
                                    ? "text-white"
                                    : "text-white/60 hover:text-white"
                            )}
                        >
                            {tab}
                            {currentTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F2BCE] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-2xl" />
                        <span className="ml-2 text-white/60">Loading recommendations...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-red-400">Failed to load recommendations</p>
                    </div>
                ) : filteredRecommendations.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 26A12 12 0 1 0 14 2a12 12 0 0 0 0 24zM30 30l-6.35-6.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"/>
                                </svg>
                            </div>
                            <p className="text-white/60 mb-2">No recommendations found</p>
                            <p className="text-white/40 text-sm">Try switching to a different tab</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentRecommendations.map((recommendation, index) => (
                            <ReferenceCard
                                key={`${recommendation.type}-${recommendation.course_slug || recommendation.book_slug}-${startIndex + index}`}
                                recommendation={recommendation}
                            />
                        ))}
                    </div>
                )}
            </div>

            {filteredRecommendations.length > 0 && totalPages > 1 && (
                <div className="flex-shrink-0 flex items-center justify-center space-x-2 p-6 border-t border-white/10">
                    <button 
                        className="p-2 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                    {getPaginationNumbers().map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="text-white/60 px-2">...</span>
                            ) : (
                                <button
                                    onClick={() => handlePageChange(page as number)}
                                    className={cn(
                                        "w-8 h-8 rounded-full text-sm font-medium transition-colors",
                                        page === currentPage
                                            ? "bg-blue-500 text-white"
                                            : "text-white/60 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    {page}
                                </button>
                            )}
                        </div>
                    ))}
                    
                    <button 
                        className="p-2 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReferenceRecommendationContainer;