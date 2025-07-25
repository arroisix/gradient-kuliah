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
        itemTitle: string,
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
                        onProblemSelect={(problemId, problemTitle, chapterName, sectionName) => 
                            onItemSelect(problemId, problemTitle, chapterName, sectionName, 'textbook_problem')
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
                        onVideoSelect={(videoId, videoTitle, chapterName, subchapterName) => 
                            onItemSelect(videoId, videoTitle, chapterName, subchapterName, 'course')
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
                        onTopicSelect={(topicId, topicTitle, chapterName, subchapterName) => 
                            onItemSelect(topicId, topicTitle, chapterName, subchapterName, 'astronotes_content')
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
                        onProblemSelect={(problemId, problemTitle, chapterName, sectionName) => 
                            onItemSelect(problemId, problemTitle, chapterName, sectionName, 'bank_soal_problem')
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