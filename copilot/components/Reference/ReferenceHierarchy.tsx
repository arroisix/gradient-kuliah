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
    onItemSelect: (
        itemId: string,
        title: string,
        subtitle: string,
        header: string,
        contentType: ReferenceContentType,
    ) => void;
}

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
                        onProblemSelect={(problemId, title, subtitle, header) => 
                            onItemSelect(problemId, title, subtitle, header, 'textbook_problem')
                        }
                    />
                );
            case 'course':
                return (
                    <CourseHierarchy
                        isOpen={isOpen}
                        onClose={onClose}
                        courseSlug={referenceData.course_slug!}
                        courseName={referenceData.course_name || 'Course'}
                        courseThumbnail={referenceData.thumbnail}
                        onVideoSelect={(videoId, title, subtitle, header) => 
                            onItemSelect(videoId, title, subtitle, header, 'course')
                        }
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
                        onTopicSelect={(topicId, title, subtitle, header) => 
                            onItemSelect(topicId, title, subtitle, header, 'astronotes_content')
                        }
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
                        onProblemSelect={(problemId, title, subtitle, header) => 
                            onItemSelect(problemId, title, subtitle, header, 'bank_soal_problem')
                        }
                    />
                );
            default:
                return (
                    <></>
                );
        }
    };

    return renderHierarchyByType();
};

export default ReferenceHierarchy;