import React from 'react';
import { ReferenceHierarchyProps, ReferenceContentType } from 'copilot/types/copilot';
import TextbookHierarchy from './TextbookHierarchy';

const ReferenceHierarchy: React.FC<ReferenceHierarchyProps> = ({
    isOpen,
    onClose,
    contentType,
    referenceData,
    onItemSelect
}) => {
    if (!isOpen) return null;

    const renderHierarchyByType = () => {
        switch (contentType) {
            case 'textbook_problem':
                return (
                    <TextbookHierarchy
                        isOpen={isOpen}
                        onClose={onClose}
                        bookSlug={referenceData.book_slug!}
                        bookName={referenceData.book_name!}
                        bookThumbnail={referenceData.thumbnail}
                        onProblemSelect={(problemId, problemTitle) => 
                            onItemSelect(problemId, problemTitle, 'textbook_problem')
                        }
                    />
                );
            case 'course_video':
            case 'astronotes_content':
            case 'bank_soal_problem':
            default:
                return (
                    <></>
                );
        }
    };

    return renderHierarchyByType();
};

export default ReferenceHierarchy;