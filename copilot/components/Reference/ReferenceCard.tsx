import { ContentRecommendation } from '../../types/copilot';
import { cn } from 'commons/utils';
import CardsActionButton from '../../assets/CardsActionButton';

interface ReferenceCardProps {
    recommendation: ContentRecommendation;
    className?: string;
}

const ReferenceCard = ({
    recommendation,
    className
}: ReferenceCardProps): JSX.Element => {
    const getCardTitle = () => {
        if (recommendation.type === 'course_video' || recommendation.type === 'astronotes_content') {
            return recommendation.subchapter_name || 'Course Content';
        }
        return recommendation.book_name || 'Reference Material';
    };

    const getCardSubtitle = () => {
        if (recommendation.type === 'textbook_problem' && recommendation.book_page) {
            return `Page ${recommendation.book_page}`;
        }
        if (recommendation.type === 'course_video') {
            return 'Course Video';
        }
        if (recommendation.type === 'astronotes_content') {
            return 'Astronotes';
        }
        if (recommendation.type === 'bank_soal_problem') {
            return 'Bank Soal';
        }
        return 'Textbook';
    };

    const getTypeColor = () => {
        switch (recommendation.type) {
            case 'course_video':
                return 'bg-blue-500/10 text-blue-400';
            case 'astronotes_content':
                return 'bg-purple-500/10 text-purple-400';
            case 'textbook_problem':
                return 'bg-green-500/10 text-green-400';
            case 'bank_soal_problem':
                return 'bg-orange-500/10 text-orange-400';
            default:
                return 'bg-gray-500/10 text-gray-400';
        }
    };

    const getTypeLabel = () => {
        switch (recommendation.type) {
            case 'course_video':
                return 'Video';
            case 'astronotes_content':
                return 'Astronotes';
            case 'textbook_problem':
                return 'Textbook Solution';
            case 'bank_soal_problem':
                return 'Bank Soal';
            default:
                return 'Content';
        }
    };

    const handleCardClick = () => {
        if (recommendation.type === 'course_video' && recommendation.course_slug && recommendation.subchapter_slug) {
            window.open(`/courses/${recommendation.course_slug}/${recommendation.subchapter_slug}`, '_blank');
        } else if (recommendation.type === 'textbook_problem' && recommendation.book_slug) {
            const page = recommendation.book_page ? `?page=${recommendation.book_page}` : '';
            window.open(`/library/${recommendation.book_slug}${page}`, '_blank');
        } else if (recommendation.type === 'astronotes_content' && recommendation.course_slug && recommendation.subchapter_slug) {
            window.open(`/courses/${recommendation.course_slug}/astronotes/${recommendation.subchapter_slug}`, '_blank');
        } else if (recommendation.type === 'bank_soal_problem' && recommendation.problem_slug) {
            window.open(`/exercises/${recommendation.problem_slug}`, '_blank');
        }
    };

    return (
        <div 
            className={cn(
                "group relative bg-white/5 rounded-lg border border-white/10 overflow-hidden transition-all duration-200 hover:bg-white/10 hover:border-white/20 cursor-pointer",
                className
            )}
            onClick={handleCardClick}
        >
            <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                {recommendation.thumbnail ? (
                    <img
                        src={recommendation.thumbnail}
                        alt={getCardTitle()}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            {recommendation.type === 'course_video' ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"/>
                                </svg>
                            ) : recommendation.type === 'astronotes_content' ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"/>
                                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"/>
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 1.5 17V7A2.5 2.5 0 0 1 4 4.5h16A2.5 2.5 0 0 1 22.5 7v10a2 2.5 0 0 1-2.5 2.5H4z" stroke="currentColor" strokeWidth="2" className="text-white/60"/>
                                </svg>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="absolute top-3 left-3">
                    <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getTypeColor()
                    )}>
                        {getTypeLabel()}
                    </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <CardsActionButton />
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {getCardTitle()}
                </h3>
                
                <p className="text-white/60 text-xs mb-3">
                    {getCardSubtitle()}
                </p>

                {recommendation.snippet && (
                    <p className="text-white/50 text-xs line-clamp-3 leading-relaxed">
                        {recommendation.snippet}
                    </p>
                )}
                
                {(recommendation.course_slug || recommendation.book_slug) && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-white/40 text-xs">
                            {recommendation.type === 'course_video' || recommendation.type === 'astronotes_content' 
                                ? `Course: ${recommendation.course_slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
                                : `Book: ${recommendation.book_name || recommendation.book_slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
                            }
                        </p>
                    </div>
                )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </div>
    );
};

export default ReferenceCard;