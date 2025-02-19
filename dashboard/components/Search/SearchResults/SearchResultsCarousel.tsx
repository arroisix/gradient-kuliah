import { useRouter } from 'next/router';
import React from 'react';
import CourseBookResults from './CourseBookResults';
import CourseResults from './CourseResults';
import FlashcardResults from './FlashcardResults';

const SearchResultsCarousel = (props: SearchResultsProps): JSX.Element => {
    const router = useRouter();
    const { type } = router.query as { type: AdvancedSearchParams['type'] };

    switch (type) {
        case 'course':
            return <CourseResults {...props} />;

        case 'astronotes':
            return <CourseBookResults title="Astronotes Terkait" {...props} />;

        case 'text-book':
            return <CourseBookResults title="Textbook Terkait" {...props} />;

        case 'bank-soal':
            return <CourseBookResults title="Bank Soal Terkait" {...props} />;

        case 'flashcard':
            return <FlashcardResults title="Flashcard Terkait" {...props} />;

        default:
            return <></>;
    }
};

export default SearchResultsCarousel;
