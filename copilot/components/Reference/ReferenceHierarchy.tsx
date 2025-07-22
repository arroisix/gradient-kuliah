import React from 'react';
import { ReferenceHierarchyProps, ReferenceContentType } from 'copilot/types/copilot';
import TextbookHierarchy from './TextbookHierarchy';
import CourseHierarchy from './CourseHierarchy';
import AstronotesHierarchy from './AstronotesHierarchy';
import BankSoalHierarchy from './BankSoalHierarchy';

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
                return (
                    <CourseHierarchy
                        isOpen={isOpen}
                        onClose={onClose}
                        courseSlug={referenceData.course_slug!}
                        courseName={referenceData.subchapter_name || 'Course'}
                        courseThumbnail={referenceData.thumbnail}
                        onVideoSelect={(videoId, videoTitle) => 
                            onItemSelect(videoId, videoTitle, 'course_video')
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
                        onTopicSelect={(topicId, topicTitle) => 
                            onItemSelect(topicId, topicTitle, 'astronotes_content')
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
                        onProblemSelect={(problemId, problemTitle) => 
                            onItemSelect(problemId, problemTitle, 'bank_soal_problem')
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