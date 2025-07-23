import React from 'react';
import { ContextRecommendation, ReferenceContentType } from 'copilot/types/copilot';
import TextbookHierarchy from './TextbookHierarchy';
import CourseHierarchy from './CourseHierarchy';
import AstronotesHierarchy from './AstronotesHierarchy';
import BankSoalHierarchy from './BankSoalHierarchy';

interface ReferenceHierarchyProps {
    isOpen: boolean;
    onClose: () => void;
    contentType: ReferenceContentType;
    referenceData: ContextRecommendation;
    onItemSelect: (itemId: string, itemTitle: string, contentType: ReferenceContentType, subtitle: string, header: string) => void;
}

const ReferenceHierarchy: React.FC<ReferenceHierarchyProps> = ({
    isOpen,
    onClose,
    contentType,
    referenceData,
    onItemSelect
}) => {
    if (!isOpen) return null;

    const handleItemSelect = (id: string, title: string, subtitle: string, header: string) => {
        onItemSelect(id, title, contentType, subtitle, header);
    };

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
                        onProblemSelect={handleItemSelect}
                    />
                );
            case 'course_video':
                return (
                    <CourseHierarchy
                        isOpen={isOpen}
                        onClose={onClose}
                        courseSlug={referenceData.course_slug!}
                        courseName={referenceData.subchapter_name || 'Course'}
                        courseThumbnail={referenceData.thumbnail}
                        onVideoSelect={handleItemSelect}
                    />
                );
            case 'astronotes_content':
                return (
                    <AstronotesHierarchy
                        isOpen={isOpen}
                        onClose={onClose}
                        bookSlug={referenceData.book_slug!}
                        bookName={referenceData.book_name!}
                        bookThumbnail={referenceData.thumbnail}
                        onTopicSelect={handleItemSelect}
                    />
                );
            case 'bank_soal_problem':
                return (
                    <BankSoalHierarchy
                        isOpen={isOpen}
                        onClose={onClose}
                        bookSlug={referenceData.book_slug!}
                        bookName={referenceData.book_name!}
                        bookThumbnail={referenceData.thumbnail}
                        onProblemSelect={handleItemSelect}
                    />
                );
            default:
                return null;
        }
    };

    return renderHierarchyByType();
};

export default ReferenceHierarchy;