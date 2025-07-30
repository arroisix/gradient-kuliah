import React from 'react';
import { IoBookmark } from 'react-icons/io5';
import { MdFormatListBulleted } from 'react-icons/md';

interface SearchResultCardProps {
    header: string;
    title: string;
    subtitle?: string;
    searchTerm: string;
    onClick: () => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
    header,
    title,
    subtitle,
    searchTerm,
    onClick
}) => {
    const highlightSearchTerm = (text: string, searchTerm: string) => {
        if (!searchTerm.trim() || !text) return text;
        
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        
        return parts.map((part, index) => 
            regex.test(part) ? 
                <span key={index} className="text-[#F2C04C] font-bold">{part}</span> : 
                part
        );
    };

    return (
        <button 
            className="w-full rounded-lg p-4 cursor-pointer hover:opacity-80 transition-opacity text-left bg-[#222222]"
            onClick={onClick}
        >
            <div className="space-y-3">
                <div className="text-sm leading-relaxed font-bold text-[#FFFFFF]">
                    {highlightSearchTerm(header, searchTerm)}
                </div>
                
                <div className="flex items-center text-xs gap-2">
                    <div className="flex items-center gap-1">
                        <IoBookmark size={12} className="text-[#7D89CC]" />
                        <span className="text-[#999999]">
                            {highlightSearchTerm(title, searchTerm)}
                        </span>
                    </div>
                    
                    {subtitle && (
                        <>
                            <span className="text-[#999999]">|</span>
                            
                            <div className="flex items-center gap-1">
                                <MdFormatListBulleted size={12} className="text-[#7D89CC]" />
                                <span className="text-[#999999]">
                                    {highlightSearchTerm(subtitle, searchTerm)}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </button>
    );
};

export default SearchResultCard;