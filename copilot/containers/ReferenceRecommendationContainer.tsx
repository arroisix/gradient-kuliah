import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetProfileQuery } from 'authentication/redux/api/authApi';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ReferenceRecommendationList from 'copilot/components/Reference/ReferenceRecommendationList';
import ReferenceHierarchy from 'copilot/components/Reference/ReferenceHierarchy';
import { ContextRecommendation, ReferenceContentType } from 'copilot/types/copilot';

interface ReferenceRecommendationContainerProps {
    initialQuery?: string;
    className?: string;
    onReferenceSelect?: (referenceId: string, referenceTitle: string, contentType: ReferenceContentType) => void;
}

const ReferenceRecommendationContainer = ({
    initialQuery = '',
    className,
    onReferenceSelect
}: ReferenceRecommendationContainerProps): JSX.Element => {
    const [searchTerm, setSearchTerm] = useState('');
    const [hierarchyModal, setHierarchyModal] = useState<{
        isOpen: boolean;
        contentType: ReferenceContentType | null;
        referenceData: ContextRecommendation | null;
    }>({
        isOpen: false,
        contentType: null,
        referenceData: null
    });

    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: profileData } = useGetProfileQuery({}, { skip: !isAuthenticated });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const query = formData.get('search') as string;
        setSearchTerm(query);
    };

    const handleReferenceCardClick = (recommendation: ContextRecommendation) => {
        if (recommendation.type === 'textbook_problem' || 
            recommendation.type === 'course' || 
            recommendation.type === 'astronotes_content' || 
            recommendation.type === 'bank_soal_problem') {
            setHierarchyModal({
                isOpen: true,
                contentType: recommendation.type,
                referenceData: recommendation
            });
        } else {
            onReferenceSelect?.(recommendation.id, getItemTitle(recommendation), recommendation.type);
        }
    };

    const handleHierarchyItemSelect = (itemId: string, itemTitle: string, contentType: ReferenceContentType) => {
        onReferenceSelect?.(itemId, itemTitle, contentType);
    };

    const handleHierarchyClose = () => {
        setHierarchyModal({
            isOpen: false,
            contentType: null,
            referenceData: null
        });
    };

    const getItemTitle = (recommendation: ContextRecommendation): string => {
        if (recommendation.type === 'course') {
            return recommendation.course_name || 'Video Content';
        }
        return recommendation.book_name || 'Book Content';
    };

    if (!isAuthenticated) {
        return (
            <div className={cn("flex-1 flex flex-col h-full", className)}>
                <div className="flex items-center justify-center h-full">
                    <p className="text-white/60">Login untuk melihat rekomendasi referensi!</p>
                </div>
            </div>
        );
    }

    const queryToUse = searchTerm || initialQuery || profileData?.major || '';

    return (
        <>
            <div className={cn("flex-1 flex flex-col h-full overflow-hidden", className)}>
                <div className="flex-shrink-0 pt-4 pb-6">
                    <div className="flex mb-4">
                        {(['semua', 'kelas', 'perpustakaan'] as const).map((tab) => {
                            const router = useRouter();
                            const { tab: currentTab } = router.query as { tab: string };
                            
                            return (
                                <Link
                                    key={tab}
                                    className={cn(
                                        'flex-1 py-3 text-sm font-medium transition-all duration-200 relative text-center',
                                        (!currentTab && tab === 'semua') || currentTab === tab
                                            ? "text-white"
                                            : "text-white/60 hover:text-white"
                                    )}
                                    scroll={false}
                                    href={{
                                        query: { ...router.query, page: 1, tab: tab }
                                    }}>
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    {((!currentTab && tab === 'semua') || currentTab === tab) && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F2BCE] rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSearchSubmit} className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"/>
                            </svg>
                        </div>
                        <input
                            type="text"
                            name="search"
                            placeholder="Cari kelas atau buku"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#222222] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#5F2BCE] transition-colors"
                        />
                    </form>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                    <ReferenceRecommendationList 
                        search={searchTerm}
                        defaultQuery={queryToUse}
                        onReferenceCardClick={handleReferenceCardClick}
                    />
                </div>
            </div>

            <ReferenceHierarchy
                isOpen={hierarchyModal.isOpen}
                onClose={handleHierarchyClose}
                contentType={hierarchyModal.contentType!}
                referenceData={hierarchyModal.referenceData!}
                onItemSelect={handleHierarchyItemSelect}
            />
        </>
    );
};

export default ReferenceRecommendationContainer;