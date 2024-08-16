interface AutocompleteResult<T = unknown> {
    result: {
        found: number;
        hits: SearchHits<T>[];
    };
}
interface SearchResults<T = unknown> {
    results: {
        found: number;
        hits: SearchHits<T>[];
        request_params: {
            collection_name: SearchResultCardProps['type'];
        };
    }[];
}

interface SearchHits<T = unknown> {
    document: T;
    highlight: {
        [key: string]: {
            matched_tokens: string[];
            snippet: string;
        };
    };
}

interface SearchResultCardProps {
    href: string;
    type:
        | 'course'
        | 'course_video'
        | 'course_book'
        | 'astronotes_content'
        | 'textbook_problem'
        | 'bank_soal_problem'
        | 'community_post';
    thumbnail?: string;
    title: string;
    desc: string;
    course: string;
    chapter?: string;
    subchapter?: string;
    commentCount?: number;
    isAnswered?: boolean;
    duration?: string;
}

interface SearchDocument {
    id: string;
    course_name: string;
    thumbnail: string;
    type:
        | 'course'
        | 'course_video'
        | 'course_book'
        | 'astronotes_content'
        | 'textbook_problem'
        | 'bank_soal_problem'
        | 'community_post';

    /** Available for `course` and `course_video` collections */
    course_slug: string;

    /** Available for `course_video` and all book content collections */
    chapter_name: string;

    /** Available for `course_video` and all book content collections */
    subchapter_name: string;

    /** Available for `course_video` collection */
    subchapter_slug: string;

    /** Available for `course_video` collection */
    description: string;

    /** Available for `course_video` collection */
    transcript: string;

    /** Available for `course_video` collection */
    duration: string;

    /** Available for `course_book` and `textbook_problem` collection */
    book_name: string;

    /** Available for `course_book` and all book content collection */
    book_slug: string;

    book_category: string;
    book_rating: number;

    book_page: number;
    page_content: string;

    problem_title: string;
    problem_slug: string;
    problem_question: string;
    problem_solution: string;

    is_answered: boolean;
    /** Comment count for `community_post` */
    popularity: number;
}

interface SearchResultsProps {
    result?: SearchResults<SearchDocument>['results'][number];
    isLoading: boolean;
}

interface AutocompleteDocument {
    id: string;
    q: string;
}

interface AdvancedSearchParams {
    q: string;
    limit?: number;
    primary_limit?: number;
    secondary_limit?: number;
    page?: number;
    primary_page?: number;
    secondary_page?: number;
    type?:
        | 'all'
        | 'course'
        | 'astronotes'
        | 'bank-soal'
        | 'text-book'
        | 'community'
        | string;
    sort?: string;
    course?: string;
}
