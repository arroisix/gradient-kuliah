import React, { useState } from 'react';

interface FlashcardDescriptionProps {
    description: string;
}

const FlashcardDescription = ({
    description
}: FlashcardDescriptionProps): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState(false);

    const truncatedDesc = description?.slice(0, 132);
    const shouldTruncate = description?.length > 132;

    return (
        <div className="mb-6">
            <p className="text-sm text-neutral-400">Deskripsi</p>
            <div>
                <p className="text-neutral-200">
                    {isExpanded ? description : truncatedDesc}
                    {shouldTruncate && !isExpanded && '...'}
                </p>
                {shouldTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[#B6A6F3] hover:opacity-80 text-sm font-medium mt-1">
                        {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default FlashcardDescription;
